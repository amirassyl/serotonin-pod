import { motion } from 'framer-motion';
import { CoreEmotionData, coreEmotions, getAllEmotions } from '@/data/emotions';
import WheelPetal from './WheelPetal';

interface FeelingWheelProps {
  collectedEmotions: string[];
  onSelectCore: (core: CoreEmotionData) => void;
}

const FeelingWheel = ({ collectedEmotions, onSelectCore }: FeelingWheelProps) => {
  const totalEmotions = getAllEmotions().length;
  const collectedCount = collectedEmotions.length;

  // Responsive radius — will be constrained by the viewBox
  const radius = 180;
  const viewSize = (radius + 40) * 2;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
          The Feeling Wheel
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Explore how emotions live in your body. Tap an emotion to begin.
        </p>
      </motion.div>

      {/* Progress pill */}
      <motion.div
        className="pill-container mb-8 flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.15 }}
      >
        <span className="text-sm font-semibold text-foreground">
          {collectedCount}/{totalEmotions}
        </span>
        <span className="text-sm text-muted-foreground">emotions discovered</span>
      </motion.div>

      {/* The Wheel */}
      <motion.div
        className="w-full max-w-lg aspect-square"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 0.1 }}
      >
        <svg
          viewBox={`${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`}
          className="w-full h-full"
        >
          {/* Center decoration */}
          <motion.circle
            cx={0}
            cy={0}
            r={radius * 0.24}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={1.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.5 }}
          />
          <motion.text
            x={0}
            y={-4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontWeight={600}
            fill="hsl(var(--foreground))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            YOU
          </motion.text>
          <motion.text
            x={0}
            y={12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="hsl(var(--muted-foreground))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            are here
          </motion.text>

          {/* Petals */}
          {coreEmotions.map((core, i) => (
            <WheelPetal
              key={core.name}
              core={core}
              index={i}
              totalPetals={coreEmotions.length}
              radius={radius}
              collectedIds={collectedEmotions}
              onSelect={onSelectCore}
            />
          ))}
        </svg>
      </motion.div>

      {/* Instruction hint */}
      <motion.p
        className="text-xs text-muted-foreground mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
      >
        Based on Robert Plutchik's Wheel of Emotions (1980)
      </motion.p>
    </motion.div>
  );
};

export default FeelingWheel;
