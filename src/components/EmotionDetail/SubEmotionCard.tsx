import { motion } from 'framer-motion';
import { Emotion, getEmotionColor } from '@/data/emotions';
import { Check } from 'lucide-react';

interface SubEmotionCardProps {
  emotion: Emotion;
  isCollected: boolean;
  onSelect: (emotion: Emotion) => void;
  index: number;
}

const intensityLabel: Record<string, string> = {
  mild: 'Mild',
  moderate: 'Core',
  intense: 'Intense',
};

const SubEmotionCard = ({ emotion, isCollected, onSelect, index }: SubEmotionCardProps) => {
  const color = getEmotionColor(emotion.coreEmotion);
  const bgLightness = 92 - index * 6; // Gets darker for each intensity

  return (
    <motion.button
      onClick={() => onSelect(emotion)}
      className="w-full text-left rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden"
      style={{
        backgroundColor: `hsl(${color.h}, ${Math.round(color.s * 0.4)}%, ${bgLightness}%)`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        delay: 0.15 + index * 0.08,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                color: 'white',
              }}
            >
              {intensityLabel[emotion.intensity]}
            </span>
            {/* Difficulty dots */}
            <div className="flex gap-0.5">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      level <= emotion.difficultyLevel
                        ? `hsl(${color.h}, ${color.s}%, ${color.l}%)`
                        : `hsl(${color.h}, ${Math.round(color.s * 0.3)}%, 80%)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Name + definition */}
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: `hsl(${color.h}, ${Math.round(color.s * 0.8)}%, ${Math.max(color.l - 20, 20)}%)` }}
          >
            {emotion.name}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: `hsl(${color.h}, ${Math.round(color.s * 0.4)}%, 35%)` }}>
            {emotion.definition}
          </p>

          {/* Pose instruction */}
          <p
            className="text-xs mt-2 italic"
            style={{ color: `hsl(${color.h}, ${Math.round(color.s * 0.3)}%, 50%)` }}
          >
            "{emotion.poseInstruction}"
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex-shrink-0 mt-1">
          {isCollected ? (
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </motion.div>
          ) : (
            <div
              className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center group-hover:border-solid transition-all"
              style={{ borderColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
              >
                GO
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default SubEmotionCard;
