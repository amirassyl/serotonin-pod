import { motion } from 'framer-motion';

interface AlignmentScoreProps {
  score: number;
  isLoading: boolean;
}

const AlignmentScore = ({ score, isLoading }: AlignmentScoreProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'text-accent';
    if (score >= 50) return 'text-warm-yellow';
    return 'text-primary';
  };

  const getStrokeColor = () => {
    if (score >= 80) return '#34C759'; // Sage Green
    if (score >= 50) return '#FFD60A'; // Warm Yellow
    return '#007AFF'; // Sanctuary Blue
  };

  return (
    <motion.div
      className="bg-card/95 backdrop-blur-sm p-4 rounded-2xl shadow-elevated"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
    >
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="5"
            fill="none"
          />
          {/* Progress circle - Apple Watch style */}
          <motion.circle
            cx="48"
            cy="48"
            r="45"
            stroke={getStrokeColor()}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <motion.span
                className={`text-2xl font-bold ${getScoreColor()}`}
                key={score}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {score}
              </motion.span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Alignment
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AlignmentScore;
