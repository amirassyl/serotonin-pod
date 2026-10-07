import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface OutroScreenProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

const OutroScreen = ({ onDismiss, autoDismissMs = 6000 }: OutroScreenProps) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [onDismiss, autoDismissMs]);

  return (
    <motion.div
      onClick={onDismiss}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ backgroundColor: '#0a0a1a' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Warm glow blob — suggests the post-practice "lifted" state */}
      <motion.div
        className="absolute"
        style={{
          width: '70vmin',
          height: '70vmin',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, hsla(28, 80%, 65%, 0.18) 0%, hsla(340, 60%, 60%, 0.10) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute"
        style={{
          width: '50vmin',
          height: '50vmin',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, hsla(45, 90%, 70%, 0.10) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Whisper text */}
      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.6 }}
      >
        <p className="text-[10px] tracking-[0.4em] text-white/40 font-light uppercase mb-6">
          Thank You
        </p>
        <p className="text-2xl text-white/75 font-light leading-relaxed mb-3">
          You moved through it.
        </p>
        <p className="text-sm text-white/40 font-light">
          Come back when you need to return.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default OutroScreen;
