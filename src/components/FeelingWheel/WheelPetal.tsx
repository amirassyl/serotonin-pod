import { motion } from 'framer-motion';
import { CoreEmotionData, getCollectedCountForCore } from '@/data/emotions';
import { Check } from 'lucide-react';

interface WheelPetalProps {
  core: CoreEmotionData;
  index: number;
  totalPetals: number;
  radius: number;
  collectedIds: string[];
  onSelect: (core: CoreEmotionData) => void;
}

const WheelPetal = ({ core, index, totalPetals, radius, collectedIds, onSelect }: WheelPetalProps) => {
  const angleStep = (2 * Math.PI) / totalPetals;
  const startAngle = index * angleStep - Math.PI / 2; // Start from top
  const endAngle = startAngle + angleStep;
  const gap = 0.03; // Radians gap between petals

  const innerRadius = radius * 0.28;
  const outerRadius = radius * 0.92;

  // Build SVG arc path
  const x1 = Math.cos(startAngle + gap) * outerRadius;
  const y1 = Math.sin(startAngle + gap) * outerRadius;
  const x2 = Math.cos(endAngle - gap) * outerRadius;
  const y2 = Math.sin(endAngle - gap) * outerRadius;
  const x3 = Math.cos(endAngle - gap) * innerRadius;
  const y3 = Math.sin(endAngle - gap) * innerRadius;
  const x4 = Math.cos(startAngle + gap) * innerRadius;
  const y4 = Math.sin(startAngle + gap) * innerRadius;

  const largeArcFlag = angleStep - 2 * gap > Math.PI ? 1 : 0;

  const pathD = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');

  // Label position (center of the petal)
  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = (innerRadius + outerRadius) / 2;
  const labelX = Math.cos(midAngle) * labelRadius;
  const labelY = Math.sin(midAngle) * labelRadius;

  // Progress badge position (outer edge)
  const badgeRadius = outerRadius + 16;
  const badgeX = Math.cos(midAngle) * badgeRadius;
  const badgeY = Math.sin(midAngle) * badgeRadius;

  const collected = getCollectedCountForCore(core.name, collectedIds);
  const total = core.emotions.length;
  const isComplete = collected === total;
  const { h, s, l } = core.color;

  // Rotate label text to be readable
  const labelAngleDeg = (midAngle * 180) / Math.PI;
  const shouldFlip = labelAngleDeg > 90 || labelAngleDeg < -90;
  const textRotation = shouldFlip ? labelAngleDeg + 180 : labelAngleDeg;

  return (
    <motion.g
      className="cursor-pointer"
      onClick={() => onSelect(core)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        delay: index * 0.06,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Petal arc */}
      <motion.path
        d={pathD}
        fill={`hsl(${h}, ${s}%, ${l}%)`}
        opacity={collected > 0 ? 1 : 0.7}
        stroke="white"
        strokeWidth={2}
        style={{ filter: isComplete ? 'saturate(1.2)' : 'none' }}
      />

      {/* Emotion name label */}
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${textRotation}, ${labelX}, ${labelY})`}
        className="pointer-events-none select-none"
        fill="white"
        fontSize={radius > 150 ? 14 : 11}
        fontWeight={600}
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        {core.name}
      </text>

      {/* Progress badge */}
      <g transform={`translate(${badgeX}, ${badgeY})`}>
        <circle
          r={12}
          fill={isComplete ? `hsl(${h}, ${s}%, ${Math.max(l - 10, 30)}%)` : 'hsl(var(--card))'}
          stroke={`hsl(${h}, ${s}%, ${l}%)`}
          strokeWidth={2}
        />
        {isComplete ? (
          <Check
            x={-6}
            y={-6}
            width={12}
            height={12}
            color="white"
            strokeWidth={3}
          />
        ) : (
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fontWeight={700}
            fill={`hsl(${h}, ${s}%, ${l}%)`}
          >
            {collected}/{total}
          </text>
        )}
      </g>
    </motion.g>
  );
};

export default WheelPetal;
