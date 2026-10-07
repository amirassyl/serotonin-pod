import { motion } from 'framer-motion';
import { CoreEmotionData, Emotion } from '@/data/emotions';
import SubEmotionCard from './SubEmotionCard';
import { ArrowLeft } from 'lucide-react';

interface EmotionDetailProps {
  coreEmotion: CoreEmotionData;
  collectedEmotions: string[];
  onSelectEmotion: (emotion: Emotion) => void;
  onBack: () => void;
}

const springTransition = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 200,
};

const EmotionDetail = ({
  coreEmotion,
  collectedEmotions,
  onSelectEmotion,
  onBack,
}: EmotionDetailProps) => {
  const { h, s, l } = coreEmotion.color;

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Colored header band */}
      <motion.div
        className="relative px-6 pt-8 pb-10 md:px-12 md:pt-12 md:pb-14"
        style={{
          background: `linear-gradient(135deg, hsl(${h}, ${s}%, ${l}%), hsl(${h}, ${Math.round(s * 0.8)}%, ${Math.max(l - 15, 30)}%))`,
        }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springTransition}
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex items-center gap-2 text-white transition-all hover:bg-white/30 mb-6"
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Wheel</span>
        </motion.button>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.1 }}
        >
          {coreEmotion.name}
        </motion.h2>

        <motion.p
          className="text-white/80 text-lg max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.15 }}
        >
          {coreEmotion.description}
        </motion.p>

        {/* Opposite emotion note */}
        <motion.div
          className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-white/70 text-xs">
            Opposite emotion: <strong className="text-white">{coreEmotion.oppositeEmotion}</strong>
          </span>
        </motion.div>
      </motion.div>

      {/* Intensity cards */}
      <div className="flex-1 px-6 md:px-12 -mt-6">
        <div className="max-w-lg mx-auto space-y-3">
          {coreEmotion.emotions.map((emotion, i) => (
            <SubEmotionCard
              key={emotion.id}
              emotion={emotion}
              isCollected={collectedEmotions.includes(emotion.id)}
              onSelect={onSelectEmotion}
              index={i}
            />
          ))}
        </div>

        {/* Educational footer */}
        <motion.div
          className="max-w-lg mx-auto mt-8 mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            Each intensity level represents how strongly you might experience{' '}
            <strong style={{ color: `hsl(${h}, ${s}%, ${l}%)` }}>{coreEmotion.name}</strong>.
            Try each pose to learn how these emotions feel in your body.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmotionDetail;
