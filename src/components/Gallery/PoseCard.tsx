import { motion } from 'framer-motion';
import { Pose, getCategoryHSL } from '@/data/poses';
import { Check } from 'lucide-react';

interface PoseCardProps {
  pose: Pose;
  isNext: boolean;
  isCompleted: boolean;
  onClick: () => void;
  layoutId: string;
}

const PoseCard = ({ pose, isNext, isCompleted, onClick, layoutId }: PoseCardProps) => {
  const categoryColors = getCategoryHSL(pose.category);
  
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl cursor-pointer bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated-lg group"
      whileTap={{ scale: 0.98 }}
    >
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Category pill */}
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `hsl(${categoryColors.bg})`,
                color: `hsl(${categoryColors.text})`,
              }}
            >
              {pose.category}
            </span>
            <h3 className="text-xl font-semibold text-foreground">
              {pose.title}
            </h3>
          </div>
          
          {/* Status indicators */}
          <div className="flex flex-col items-end gap-2">
            {isNext && !isCompleted && (
              <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                Next up
              </span>
            )}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="w-7 h-7 rounded-full bg-accent flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-accent-foreground" strokeWidth={3} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {pose.shortDescription}
        </p>

        {/* Difficulty indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Difficulty</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full transition-colors ${
                  level <= pose.difficultyLevel 
                    ? 'bg-foreground/40' 
                    : 'bg-foreground/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scientific benefit preview */}
        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
          "{pose.scientificBenefit.slice(0, 80)}..."
        </p>
      </div>
    </motion.div>
  );
};

export default PoseCard;
