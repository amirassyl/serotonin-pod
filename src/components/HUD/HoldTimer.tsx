import { motion } from 'framer-motion';

interface HoldTimerProps {
  progress: number;
  isActive: boolean;
}

const HoldTimer = ({ progress, isActive }: HoldTimerProps) => {
  const circumference = 2 * Math.PI * 55;
  const strokeDashoffset = circumference - progress * circumference;

  const glowColor = isActive ? 'rgba(74, 222, 128, 0.8)' : 'rgba(230, 230, 250, 0.5)';
  const strokeColor = isActive ? 'rgba(74, 222, 128, 0.9)' : 'rgba(230, 230, 250, 0.6)';
  const textColor = isActive ? 'rgba(74, 222, 128, 1)' : 'rgba(255, 255, 255, 0.5)';
  const trackColor = 'rgba(255, 255, 255, 0.08)';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="relative"
    >
      <div
        className="rounded-full p-4"
        style={{
          background: 'transparent',
          boxShadow: isActive ? `0 0 40px ${glowColor}` : 'none',
        }}
      >
        <svg className="w-28 h-28 -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="55"
            stroke={trackColor}
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="56"
            cy="56"
            r="55"
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1 }}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xs font-light uppercase tracking-widest"
            style={{ color: textColor }}
          >
            {isActive ? 'Hold' : 'Almost'}
          </span>
          <span
            className="text-2xl font-light"
            style={{ color: textColor }}
          >
            {Math.ceil((1 - progress) * 3)}s
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default HoldTimer;
