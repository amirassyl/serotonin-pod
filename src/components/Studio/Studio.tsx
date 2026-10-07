import { motion, AnimatePresence } from 'framer-motion';
import { Emotion, getEmotionColor, GhostCoordinates } from '@/data/emotions';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import CameraView from './CameraView';
import MannequinOverlay from './MannequinOverlay';
import OutroScreen from './OutroScreen';
import { HoldTimer } from '@/components/HUD';
import { usePoseDetection, calculateAlignmentScore } from '@/hooks/usePoseDetection';
import { ArrowLeft, Check, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudioProps {
  emotion: Emotion;
  onBack: () => void;
  onComplete: (emotionId: string) => void;
}

const HOLD_DURATION = 3000;
const POSE_DURATION_SEC = 60; // each pose runs for this long
const EVET_AGENT_ID = import.meta.env.VITE_ELEVENLABS_POSE_AGENT_ID ?? '';

type Phase = 'idle' | 'pose1' | 'pose2' | 'outro';

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
};

const springTransition = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 200,
};

interface TranscriptMessage {
  role: 'user' | 'agent';
  content: string;
}

const Studio = ({ emotion, onBack, onComplete }: StudioProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const alignmentScoreRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [chromeFaded, setChromeFaded] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(POSE_DURATION_SEC);

  // Active pose data (swaps when pose 2 begins)
  const hasSecondPose = !!emotion.ghostCoordinates2 && !!emotion.poseInstruction2;
  const activeGhostCoords: GhostCoordinates =
    phase === 'pose2' && emotion.ghostCoordinates2
      ? emotion.ghostCoordinates2
      : emotion.ghostCoordinates;
  const activePoseInstruction =
    phase === 'pose2' && emotion.poseInstruction2
      ? emotion.poseInstruction2
      : emotion.poseInstruction;
  const activeSubName =
    phase === 'pose2' && emotion.subEmotionName2
      ? emotion.subEmotionName2
      : emotion.name;

  const { landmarks, isLoading, error } = usePoseDetection(videoRef, isVideoReady);
  const alignmentScore = calculateAlignmentScore(landmarks, activeGhostCoords);
  const color = getEmotionColor(emotion.coreEmotion);

  // Keep alignmentScoreRef in sync so the client tool always reads latest
  alignmentScoreRef.current = alignmentScore;

  // --- ElevenLabs Evet agent ---
  const conversation = useConversation({
    clientTools: {
      check_pose_accuracy: async () => {
        const score = alignmentScoreRef.current;
        console.log('Evet check_pose_accuracy → ', score);
        return String(score);
      },
    },
    onConnect: () => {
      console.log('Evet connected');
      if (mountedRef.current) {
        setVoiceConnecting(false);
        setConnectionError(null);
        setTimeout(() => {
          if (mountedRef.current) setChromeFaded(true);
        }, 3000);
      }
    },
    onDisconnect: () => {
      console.log('Evet disconnected');
      if (mountedRef.current) setVoiceConnecting(false);
    },
    onMessage: (message: any) => {
      if (!mountedRef.current) return;
      if (message.type === 'user_transcript') {
        const text = message.user_transcription_event?.user_transcript;
        if (text) setTranscript(prev => [...prev, { role: 'user', content: text }]);
      } else if (message.type === 'agent_response') {
        const text = message.agent_response_event?.agent_response;
        if (text) setTranscript(prev => [...prev, { role: 'agent', content: text }]);
      }
    },
    onError: (err) => {
      console.error('Evet error:', err);
      if (mountedRef.current) setConnectionError(String(err));
    },
  });

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Start Evet session on user gesture
  const startEvetSession = useCallback(async () => {
    setSessionStarted(true);
    setVoiceConnecting(true);
    setConnectionError(null);

    try {
      await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: false,
        },
      });
    } catch (err) {
      console.error('Mic permission failed:', err);
      setVoiceConnecting(false);
      setConnectionError(`Microphone access denied: ${err}`);
      return;
    }

    try {
      console.log('Starting Evet session...');
      await conversation.startSession({
        agentId: EVET_AGENT_ID,
        connectionType: 'websocket',
        dynamicVariables: {
          core_emotion: emotion.coreEmotion,
          sub_emotion: emotion.name,
          activity_type: 'somatic_movement',
          flow_instructions: emotion.poseInstruction,
          vibe: emotion.ambientDescription,
        },
      } as any);
      console.log('Evet session started');
      // Kick off pose 1 and the countdown
      if (mountedRef.current) {
        setPhase('pose1');
        setSecondsLeft(POSE_DURATION_SEC);
      }
    } catch (err) {
      console.error('Evet session start failed:', err);
      setVoiceConnecting(false);
      setConnectionError(`Session failed: ${err}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion]);

  // Phase / countdown machine
  useEffect(() => {
    if (phase !== 'pose1' && phase !== 'pose2') return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1;
        // Reached 0 — transition
        clearInterval(interval);
        if (phase === 'pose1') {
          if (hasSecondPose) {
            // Tell Evet to guide the user into the next pose
            try {
              conversation.sendContextualUpdate(
                `Transition now. The user is moving into the second pose: ${emotion.subEmotionName2 ?? emotion.name}. ` +
                `New pose instruction: ${emotion.poseInstruction2}. ` +
                `Briefly acknowledge the transition and gently guide them into this new shape.`
              );
            } catch (e) {
              console.warn('sendContextualUpdate failed', e);
            }
            setPhase('pose2');
            return POSE_DURATION_SEC;
          } else {
            // No second pose — deepen the current one
            try {
              conversation.sendContextualUpdate(
                `One minute has passed. Invite the user to deepen the current pose and breathe into it for another minute.`
              );
            } catch {}
            setPhase('pose2'); // reuse pose2 phase but with same coords (fallback)
            return POSE_DURATION_SEC;
          }
        } else {
          // pose2 finished — outro
          try {
            conversation.endSession();
          } catch {}
          setPhase('outro');
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, hasSecondPose, emotion]);


  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      try {
        conversation.endSession();
      } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setDimensions({
      width: video.videoWidth || 1280,
      height: video.videoHeight || 720,
    });
    setIsVideoReady(true);
  }, []);

  // Hold timer logic
  useEffect(() => {
    if (isCompleted) return;

    if (alignmentScore >= 80) {
      if (!holdStartRef.current) {
        holdStartRef.current = Date.now();
      }

      const updateProgress = () => {
        if (!holdStartRef.current || isCompleted) return;

        const elapsed = Date.now() - holdStartRef.current;
        const progress = Math.min(elapsed / HOLD_DURATION, 1);
        setHoldProgress(progress);

        if (progress >= 1) {
          triggerCelebration();
          setIsCompleted(true);
          // Note: do NOT call onComplete here — the timed flow ends with the OutroScreen
        } else {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      holdStartRef.current = null;
      setHoldProgress(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [alignmentScore, isCompleted, onComplete, emotion.id]);

  // Reset hold progress + completion state when transitioning to a new pose
  useEffect(() => {
    setIsCompleted(false);
    setHoldProgress(0);
    holdStartRef.current = null;
  }, [phase]);

  const triggerCelebration = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    const hslStr = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const hslStr2 = `hsl(${color.h}, ${Math.round(color.s * 0.7)}%, ${Math.min(color.l + 15, 80)}%)`;
    const colors = [hslStr, hslStr2, '#4ade80', '#e6e6fa'];
    fire(0.25, { spread: 26, startVelocity: 55, colors });
    fire(0.2, { spread: 60, colors });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors });
    fire(0.1, { spread: 120, startVelocity: 45, colors });
  };

  const voiceStatus =
    connectionError
      ? `Error: ${connectionError}`
      : conversation.status === 'connected'
        ? conversation.isSpeaking
          ? 'Speaking'
          : 'Listening'
        : voiceConnecting
          ? 'Connecting…'
          : null;

  return (
    <motion.div
      className="fixed inset-0 z-50"
      style={{ backgroundColor: '#000000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Full-screen ghost camera feed */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.3,
            filter: 'grayscale(100%) brightness(40%) contrast(120%)',
          }}
        >
          <CameraView ref={videoRef} onVideoReady={handleVideoReady} />
        </div>

        {isVideoReady && (
          <MannequinOverlay
            landmarks={landmarks}
            ghostCoordinates={activeGhostCoords}
            alignmentScore={alignmentScore}
            coreEmotion={emotion.coreEmotion}
            emotionColor={color}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-3 rounded-full transition-opacity duration-300 hover:opacity-60"
        style={{ opacity: 0.3 }}
        whileTap={{ scale: 0.9 }}
        transition={springTransition}
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </motion.button>

      {/* Voice status indicator — top right */}
      <AnimatePresence>
        {voiceStatus && (
          <motion.div
            className="absolute top-6 right-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full max-w-xs"
            style={{ backgroundColor: connectionError ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: connectionError
                  ? '#EF4444'
                  : conversation.status === 'connected'
                    ? '#34C759'
                    : 'rgba(255,255,255,0.4)',
                boxShadow: connectionError
                  ? '0 0 8px rgba(239,68,68,0.6)'
                  : conversation.status === 'connected'
                    ? '0 0 8px rgba(52,199,89,0.6)'
                    : 'none',
              }}
            />
            <span className={`text-xs font-medium truncate ${connectionError ? 'text-red-300' : 'text-white/60'}`}>
              {voiceStatus}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown chip — top center, only during pose1/pose2 */}
      <AnimatePresence>
        {(phase === 'pose1' || phase === 'pose2') && (
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-light">
              {phase === 'pose1' ? 'Pose 1' : 'Pose 2'} · {activeSubName}
            </span>
            <span className="text-sm tabular-nums text-white/60 font-light">
              {formatTime(secondsLeft)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!sessionStarted && isVideoReady && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={startEvetSession}
              className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg"
              style={{
                backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                boxShadow: `0 0 40px hsl(${color.h}, ${color.s}%, ${color.l}% / 0.4)`,
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springTransition}
            >
              <Mic className="w-5 h-5" />
              Tap to Start
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hold timer */}
      <AnimatePresence>
        {alignmentScore >= 70 && !isCompleted && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <HoldTimer progress={holdProgress} isActive={alignmentScore >= 80} />
          </div>
        )}
      </AnimatePresence>

      {/* Transcript overlay — bottom */}
      <AnimatePresence>
        {transcript.length > 0 && (
          <motion.div
            className="absolute bottom-6 left-6 right-6 z-10 max-h-32 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-32 space-y-1 px-4 py-3 rounded-2xl"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
            >
              {transcript.slice(-4).map((msg, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{
                    color: msg.role === 'agent' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                    fontStyle: msg.role === 'user' ? 'italic' : 'normal',
                  }}
                >
                  {msg.content}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center max-w-md px-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springTransition}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                  boxShadow: `0 0 40px hsl(${color.h}, ${color.s}%, ${color.l}% / 0.5)`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...springTransition, delay: 0.2 }}
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-2">
                Emotion Collected!
              </h3>
              <p
                className="text-lg font-medium mb-1"
                style={{ color: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
              >
                {emotion.name}
              </p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {emotion.definition}
              </p>

              <div
                className="rounded-xl p-4 mb-8 text-left"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <p
                  className="text-xs font-medium uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Did You Know?
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {emotion.psychiatricInsight}
                </p>
              </div>

              <motion.button
                onClick={onBack}
                className="px-8 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                  boxShadow: `0 0 30px hsl(${color.h}, ${color.s}%, ${color.l}% / 0.4)`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Exploring
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && !isVideoReady && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            style={{ backgroundColor: '#000000' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 border-2 rounded-full animate-spin mb-4 mx-auto"
                style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'rgba(255,255,255,0.4)' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Initializing camera...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
        >
          <div className="text-center max-w-md px-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-full font-medium text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Outro screen — appears after both poses complete */}
      <AnimatePresence>
        {phase === 'outro' && (
          <OutroScreen
            onDismiss={() => {
              onComplete(emotion.id);
              onBack();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Studio;
