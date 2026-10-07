import { AnimatePresence, motion } from 'framer-motion';
import type { BreathPhase } from '@/hooks/useBreathingTimer';

interface BreathingDialProps {
  dialValue: number;
  phase: BreathPhase;
  label: string;
  color: { h: number; s: number; l: number };
}

const BreathingDial = ({ phase, label }: BreathingDialProps) => {
  return (
    <div className="h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-xs font-light uppercase"
          style={{
            color: 'hsla(0, 0%, 100%, 0.5)',
            letterSpacing: '0.3em',
          }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default BreathingDial;
