import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';
import { Emotion } from '@/data/emotions';
import { useBreathingTimer } from '@/hooks/useBreathingTimer';
import PulsingOrb from './PulsingOrb';
import BreathingDial from './BreathingDial';

interface BreathingStudioProps {
  emotion: Emotion;
  onBack: () => void;
  onComplete: (emotionId: string) => void;
}

const FEAR_COLOR = { h: 270, s: 60, l: 55 };
const AGENT_ID = import.meta.env.VITE_ELEVENLABS_BREATHING_AGENT_ID ?? '';

interface TranscriptMessage {
  role: 'user' | 'agent';
  content: string;
}

const BreathingStudio = ({ emotion, onBack, onComplete }: BreathingStudioProps) => {
  const timer = useBreathingTimer(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [micError, setMicError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chromeFaded, setChromeFaded] = useState(false);
  const mountedRef = useRef(true);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Yogaboo connected');
      if (mountedRef.current) {
        setIsConnecting(false);
        setTimeout(() => {
          if (mountedRef.current) setChromeFaded(true);
        }, 3000);
      }
    },
    onDisconnect: () => {
      console.log('Yogaboo disconnected');
      if (mountedRef.current) setIsConnecting(false);
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
    onError: (error) => console.error('Yogaboo error:', error),
  });

  // Single startup effect — connect once on mount, disconnect on unmount
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const connect = async () => {
      setIsConnecting(true);

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error('Microphone permission failed:', err);
        if (!cancelled) {
          setMicError(true);
          setIsConnecting(false);
        }
        return;
      }

      if (cancelled) return;
      setMicError(false);

      try {
        console.log('Starting Yogaboo session (webrtc)...');
        await conversation.startSession({
          agentId: AGENT_ID,
          connectionType: 'websocket',
        } as any);
        console.log('Yogaboo session started successfully');
      } catch (err) {
        console.error('Yogaboo session start failed:', err);
        if (!cancelled) {
          setMicError(true);
          setIsConnecting(false);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      conversation.endSession().catch(() => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [transcript]);

  // Auto-complete after 2 minutes
  useEffect(() => {
    const timeout = setTimeout(() => onComplete(emotion.id), 2 * 60 * 1000);
    return () => clearTimeout(timeout);
  }, [emotion.id, onComplete]);

  const handleBack = useCallback(() => {
    mountedRef.current = false;
    conversation.endSession().catch(() => {});
    onBack();
  }, [conversation, onBack]);

  const handleRetry = useCallback(async () => {
    setIsConnecting(true);
    setMicError(false);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: AGENT_ID, connectionType: 'websocket' } as any);
    } catch (err) {
      console.error('Retry failed:', err);
      setMicError(true);
      setIsConnecting(false);
    }
  }, [conversation]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a1a' }}
    >
      {/* Animated mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '-10%', left: '-15%',
            background: 'radial-gradient(circle, hsla(260, 50%, 25%, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'meshDrift1 60s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '-15%', right: '-10%',
            background: 'radial-gradient(circle, hsla(230, 40%, 20%, 0.35) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'meshDrift2 55s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            top: '40%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, hsla(280, 35%, 18%, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'meshDrift3 70s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Chrome (fades out) */}
      <AnimatePresence>
        {!chromeFaded && (
          <motion.button
            key="back"
            onClick={handleBack}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute top-6 left-6 z-10 flex items-center gap-2 transition-colors"
            style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}
          >
            <ArrowLeft size={18} />
            <span className="text-xs font-light tracking-widest uppercase">Back</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!chromeFaded && (
          <motion.div
            key="status"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute top-6 right-6 z-10 flex items-center gap-2"
          >
            {conversation.status === 'connected' && (
              <span className="flex items-center gap-1.5 text-xs font-light tracking-wide" style={{ color: 'hsla(0, 0%, 100%, 0.35)' }}>
                {conversation.isSpeaking ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" /> Speaking</>
                ) : (
                  <><Mic size={11} /> Listening</>
                )}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible back (tiny, after fade) */}
      {chromeFaded && (
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 left-6 z-10"
          style={{ color: 'hsla(0, 0%, 100%, 0.15)' }}
        >
          <ArrowLeft size={16} />
        </motion.button>
      )}

      {/* Central orb + label */}
      <div className="flex flex-col items-center gap-8 z-10">
        <PulsingOrb
          isActive={conversation.isSpeaking}
          color={FEAR_COLOR}
          dialValue={timer.dialValue}
          getOutputVolume={conversation.status === 'connected' ? () => conversation.getOutputVolume() : undefined}
        />
        <BreathingDial
          dialValue={timer.dialValue}
          phase={timer.phase}
          label={timer.label}
          color={FEAR_COLOR}
        />
      </div>

      {/* Mic error */}
      {micError && (
        <div className="mt-6 px-4 py-2 rounded-lg text-sm flex items-center gap-2 z-10"
          style={{ background: 'hsla(0, 60%, 50%, 0.15)', color: 'hsla(0, 80%, 70%, 0.8)' }}>
          <MicOff size={14} />
          Microphone required.
          <button onClick={handleRetry} className="underline ml-1 font-light">Retry</button>
        </div>
      )}

      {/* Connecting */}
      {isConnecting && (
        <motion.div
          className="mt-6 flex items-center gap-2 text-xs font-light tracking-wider z-10"
          style={{ color: 'hsla(0, 0%, 100%, 0.35)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'hsla(270, 60%, 65%, 0.6)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          Connecting...
        </motion.div>
      )}

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 w-full max-w-md px-8 overflow-y-auto space-y-3 z-10"
        style={{ maxHeight: '25vh' }}
      >
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs leading-relaxed font-light ${
              msg.role === 'agent' ? 'text-center' : 'text-right italic'
            }`}
            style={{ color: msg.role === 'agent' ? 'hsla(0, 0%, 100%, 0.5)' : 'hsla(0, 0%, 100%, 0.3)' }}
          >
            {msg.content}
          </motion.div>
        ))}
      </div>

      {/* Mesh gradient keyframes */}
      <style>{`
        @keyframes meshDrift1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(80px, 60px) scale(1.15); }
        }
        @keyframes meshDrift2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-60px, -40px) scale(1.1); }
        }
        @keyframes meshDrift3 {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-45%, -55%) scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
};

export default BreathingStudio;
