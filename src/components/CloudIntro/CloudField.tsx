import { motion, AnimatePresence } from 'framer-motion';
import Cloud from './Cloud';
import { CoreEmotionData, Emotion, getEmotionColor } from '@/data/emotions';

interface CloudFieldProps {
  items: CoreEmotionData[];
  onSelect: (core: CoreEmotionData) => void;
  selectedCore?: CoreEmotionData;
  onSelectEmotion?: (emotion: Emotion) => void;
}

// Positions for 8 emotion clouds in a circular layout
const corePositions = [
  { x: 0, y: -140 },
  { x: 110, y: -95 },
  { x: 140, y: 15 },
  { x: 95, y: 120 },
  { x: -10, y: 145 },
  { x: -110, y: 95 },
  { x: -145, y: -15 },
  { x: -95, y: -110 },
];

// Positions for 3 sub-emotion clouds
const subPositions = [
  { x: -150, y: -30 },
  { x: 0, y: -60 },
  { x: 150, y: -30 },
];

const CloudField = ({ items, onSelect, selectedCore, onSelectEmotion }: CloudFieldProps) => {
  if (selectedCore && onSelectEmotion) {
    const c = getEmotionColor(selectedCore.name);
    const cloudColor = `hsla(${c.h}, ${c.s}%, ${c.l}%, 0.5)`;

    return (
      <div className="relative flex items-center justify-center" style={{ width: 500, height: 400 }}>
        <AnimatePresence>
          {selectedCore.emotions.map((emotion, i) => (
            <motion.div
              key={emotion.id}
              className="absolute"
              style={{
                transform: `translate(${subPositions[i].x}px, ${subPositions[i].y}px)`,
              }}
            >
              <Cloud
                size="md"
                label={emotion.name}
                color={cloudColor}
                onClick={() => onSelectEmotion(emotion)}
                delay={i * 0.15}
                glowing
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Intensity labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8">
          {['mild', 'moderate', 'intense'].map((level) => (
            <motion.span
              key={level}
              className="text-xs text-white/40 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {level}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: 500, height: 500 }}>
      <AnimatePresence>
        {items.map((core, i) => {
          const c = getEmotionColor(core.name);
          const cloudColor = `hsla(${c.h}, ${c.s}%, ${c.l}%, 0.5)`;
          const pos = corePositions[i];

          return (
            <motion.div
              key={core.name}
              className="absolute"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <Cloud
                size="sm"
                label={core.name}
                color={cloudColor}
                onClick={() => onSelect(core)}
                delay={i * 0.12}
                glowing
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CloudField;
