import { motion } from 'framer-motion';
import { Brain, Lightbulb } from 'lucide-react';
import { Emotion, getEmotionColor } from '@/data/emotions';

interface EmotionContextProps {
  emotion: Emotion;
}

const EmotionContext = ({ emotion }: EmotionContextProps) => {
  const color = getEmotionColor(emotion.coreEmotion);

  return (
    <motion.div
      className="bg-card/95 backdrop-blur-sm p-5 rounded-2xl shadow-elevated max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.4 }}
    >
      {/* Somatic insight */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%, 0.12)` }}
        >
          <Brain
            className="w-5 h-5"
            style={{ color: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
          />
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            In Your Body
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {emotion.somaticDescription}
          </p>
        </div>
      </div>

      {/* Did You Know? */}
      <div className="flex items-start gap-3 pt-3 border-t border-border">
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%, 0.12)` }}
        >
          <Lightbulb
            className="w-5 h-5"
            style={{ color: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}
          />
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Did You Know?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {emotion.psychiatricInsight}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionContext;
