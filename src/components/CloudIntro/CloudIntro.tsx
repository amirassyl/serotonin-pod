import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff } from 'lucide-react';
import Cloud from './Cloud';
import CloudField from './CloudField';
import { useAmbientAudio } from './useAmbientAudio';
import {
  CoreEmotionData,
  Emotion,
  coreEmotions,
  getCoreEmotionByName,
  getAllEmotions,
  CoreEmotion,
} from '@/data/emotions';

const EMOGUIDE_AGENT_ID = import.meta.env.VITE_ELEVENLABS_INTRO_AGENT_ID ?? '';

type Stage = 'landing' | 'conversing' | 'burst' | 'narrowing' | 'handoff';

interface CloudIntroProps {
  onSelectEmotion: (emotion: Emotion) => void;
  onSkip: () => void;
}

interface TranscriptMessage {
  role: 'user' | 'agent';
  content: string;
}

const CloudIntro = ({ onSelectEmotion, onSkip }: CloudIntroProps) => {
  const [stage, setStage] = useState<Stage>('landing');
  const [selectedCore, setSelectedCore] = useState<CoreEmotionData | null>(null);
  const [entered, setEntered] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [micError, setMicError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const mountedRef = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ambient = useAmbientAudio();

  const conversation = useConversation({
    clientTools: {
      selectCoreEmotion: (params: { emotionName: string }) => {
        console.log('Agent selected core emotion:', params.emotionName);
        const core = getCoreEmotionByName(params.emotionName as CoreEmotion);
        if (core && mountedRef.current) {
          setSelectedCore(core);
          setStage('narrowing');
        }
        return 'Core emotion selected, now showing sub-emotions to the user.';
      },
      selectSubEmotion: (params: { emotionName: string }) => {
        console.log('Agent selected sub-emotion:', params.emotionName);
        const allEmotions = getAllEmotions();
        const emotion = allEmotions.find(
          (e) => e.name.toLowerCase() === params.emotionName.toLowerCase()
        );
        if (emotion && mountedRef.current) {
          handleFinalSelect(emotion);
        }
        return 'Sub-emotion selected, transitioning to studio.';
      },
    },
    onConnect: () => {
      console.log('Emoguide connected');
      if (mountedRef.current) setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log('Emoguide disconnected');
      if (mountedRef.current) setIsConnecting(false);
    },
    onMessage: (message: any) => {
      if (!mountedRef.current) return;
      if (message.type === 'user_transcript') {
        const text = message.user_transcription_event?.user_transcript;
        if (text) setTranscript((prev) => [...prev, { role: 'user', content: text }]);
      } else if (message.type === 'agent_response') {
        const text = message.agent_response_event?.agent_response;
        if (text) setTranscript((prev) => [...prev, { role: 'agent', content: text }]);
      }
    },
    onError: (error) => console.error('Emoguide error:', error),
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      conversation.endSession().catch(() => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [transcript]);

  const handleEnter = useCallback(async () => {
    if (entered) return;
    setEntered(true);
    ambient.start();
    setStage('conversing');
    setIsConnecting(true);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError(true);
      setIsConnecting(false);
      // Still show burst so user can tap manually
      setTimeout(() => setStage('burst'), 2000);
      return;
    }

    try {
      await conversation.startSession({
        agentId: EMOGUIDE_AGENT_ID,
        connectionType: 'websocket',
      } as any);
    } catch (err) {
      console.error('Emoguide session failed:', err);
      setMicError(true);
      setIsConnecting(false);
      setTimeout(() => setStage('burst'), 2000);
    }
  }, [entered, ambient, conversation]);

  const handleSelectCore = useCallback((core: CoreEmotionData) => {
    setSelectedCore(core);
    setStage('narrowing');
    // Inform the agent about the manual selection
    if (conversation.status === 'connected') {
      conversation.sendContextualUpdate(
        `The user manually tapped the "${core.name}" emotion. Now help them narrow down to a specific intensity: ${core.emotions.map((e) => e.name).join(', ')}.`
      );
    }
  }, [conversation]);

  const handleFinalSelect = useCallback(
    (emotion: Emotion) => {
      setStage('handoff');
      ambient.fadeOut();
      conversation.endSession().catch(() => {});
      setTimeout(() => {
        onSelectEmotion(emotion);
      }, 800);
    },
    [ambient, onSelectEmotion, conversation]
  );

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Skip button */}
      <motion.button
        className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full text-xs text-white/40 border border-white/10 backdrop-blur-sm hover:text-white/60 hover:border-white/20 transition-colors"
        onClick={() => {
          conversation.endSession().catch(() => {});
          onSkip();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Skip to Wheel
      </motion.button>

      {/* Connection status */}
      {entered && stage !== 'handoff' && (
        <motion.div
          className="absolute top-6 left-6 z-50 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isConnecting && (
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              Connecting...
            </span>
          )}
          {conversation.status === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              {conversation.isSpeaking ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" /> Speaking</>
              ) : (
                <><Mic size={11} /> Listening</>
              )}
            </span>
          )}
          {micError && (
            <span className="flex items-center gap-1.5 text-xs text-red-400/60">
              <MicOff size={11} /> Mic unavailable — tap to select
            </span>
          )}
        </motion.div>
      )}

      {/* Informative intro panel — landing only */}
      <AnimatePresence>
        {stage === 'landing' && !entered && (
          <motion.aside
            key="intro-panel"
            className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-40 max-w-[280px] p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <p className="text-[11px] tracking-widest uppercase text-white/40 font-light">
              A 5 minute experience
            </p>

            <div className="my-4 h-px w-8 bg-white/10" />

            <p className="text-xs text-white/45 font-light leading-relaxed">
              HI There, This is 5 minutes controlled meditative experience.
            </p>
            <p className="mt-3 text-xs text-white/45 font-light leading-relaxed">
              We start with helping you to navigate identifying how you feel, followed by learning come to balanced state.
            </p>

            <div className="my-4 h-px w-8 bg-white/10" />

            <ul className="space-y-2 text-[11px] text-white/30 font-light leading-relaxed">
              <li>· Find a quiet space</li>
              <li>· Sit comfortably, eyes soft</li>
              <li>· Nothing is recorded or stored</li>
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <motion.div
            key="landing"
            className="flex flex-col items-center gap-8"
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
          >
            <Cloud
              size="md"
              color="rgba(255, 255, 255, 0.5)"
              onClick={handleEnter}
              animate
            />
            <motion.p
              className="text-white/40 text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              tap to begin
            </motion.p>
          </motion.div>
        )}

        {stage === 'conversing' && (
          <motion.div
            key="conversing"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(40px)' }}
            transition={{ duration: 1 }}
          >
            <Cloud
              size="xl"
              color="rgba(255, 255, 255, 0.45)"
              label={transcript.length > 0
                ? transcript[transcript.length - 1].content
                : 'How are you feeling today?'
              }
              animate
              glowing
            />

            {/* Prompt to speak */}
            {conversation.status === 'connected' && !conversation.isSpeaking && transcript.length > 0 && (
              <motion.p
                className="text-white/25 text-xs tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                speak naturally — I'm listening
              </motion.p>
            )}

            {/* Manual fallback after some conversation */}
            {transcript.length >= 2 && (
              <motion.button
                className="mt-4 px-4 py-2 rounded-full text-xs text-white/30 border border-white/10 hover:text-white/50 hover:border-white/20 transition-colors"
                onClick={() => setStage('burst')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                or choose manually
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === 'burst' && (
          <motion.div
            key="burst"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-white/50 text-base mb-6 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Does it feel more like...
            </motion.p>

            <CloudField items={coreEmotions} onSelect={handleSelectCore} />
          </motion.div>
        )}

        {stage === 'narrowing' && selectedCore && (
          <motion.div
            key="narrowing"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.p
              className="text-white/50 text-base mb-2 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Is it more like...
            </motion.p>
            <motion.p
              className="text-white/30 text-xs mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              within {selectedCore.name}
            </motion.p>

            <CloudField
              items={coreEmotions}
              onSelect={handleSelectCore}
              selectedCore={selectedCore}
              onSelectEmotion={handleFinalSelect}
            />

            <motion.button
              className="mt-8 px-4 py-2 rounded-full text-xs text-white/30 border border-white/10 hover:text-white/50 hover:border-white/20 transition-colors"
              onClick={() => {
                setSelectedCore(null);
                setStage(conversation.status === 'connected' ? 'conversing' : 'burst');
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ← back to emotions
            </motion.button>
          </motion.div>
        )}

        {stage === 'handoff' && (
          <motion.div
            key="handoff"
            className="flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Cloud size="lg" color="rgba(255, 255, 255, 0.3)" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript overlay (bottom) */}
      {entered && stage !== 'landing' && stage !== 'handoff' && transcript.length > 0 && (
        <div
          ref={scrollRef}
          className="absolute bottom-8 w-full max-w-md px-8 overflow-y-auto space-y-2 z-40"
          style={{ maxHeight: '20vh' }}
        >
          {transcript.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs leading-relaxed font-light ${
                msg.role === 'agent' ? 'text-center' : 'text-right italic'
              }`}
              style={{
                color: msg.role === 'agent' ? 'hsla(0, 0%, 100%, 0.45)' : 'hsla(0, 0%, 100%, 0.25)',
              }}
            >
              {msg.content}
            </motion.div>
          ))}
        </div>
      )}

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: Math.random() * 5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CloudIntro;
