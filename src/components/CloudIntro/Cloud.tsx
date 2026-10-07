import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CloudProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
  delay?: number;
  animate?: boolean;
  glowing?: boolean;
}

const sizeMap = {
  sm: { w: 120, h: 80, blur: 30, circles: 4 },
  md: { w: 200, h: 140, blur: 45, circles: 6 },
  lg: { w: 320, h: 220, blur: 55, circles: 7 },
  xl: { w: 480, h: 340, blur: 65, circles: 8 },
};

const circleLayouts = [
  { x: 0.5, y: 0.5, scale: 1.0 },
  { x: 0.25, y: 0.55, scale: 0.7 },
  { x: 0.75, y: 0.55, scale: 0.7 },
  { x: 0.35, y: 0.3, scale: 0.8 },
  { x: 0.65, y: 0.3, scale: 0.8 },
  { x: 0.15, y: 0.45, scale: 0.5 },
  { x: 0.85, y: 0.45, scale: 0.5 },
  { x: 0.5, y: 0.25, scale: 0.6 },
];

const Cloud = ({
  size = 'md',
  label,
  color = 'rgba(255, 255, 255, 0.7)',
  onClick,
  className,
  delay = 0,
  animate = true,
  glowing = false,
}: CloudProps) => {
  const dims = sizeMap[size];
  const circles = circleLayouts.slice(0, dims.circles);

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center cursor-default select-none',
        onClick && 'cursor-pointer',
        className
      )}
      style={{ width: dims.w, height: dims.h }}
      initial={animate ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.3, opacity: 0, filter: 'blur(30px)' }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
        delay,
      }}
      whileHover={onClick ? { scale: 1.08, y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      {/* Cloud blobs */}
      {circles.map((c, i) => {
        const blobSize = dims.h * 0.7 * c.scale;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: blobSize,
              height: blobSize,
              left: c.x * dims.w - blobSize / 2,
              top: c.y * dims.h - blobSize / 2,
              background: `radial-gradient(circle, ${color}, transparent 70%)`,
              filter: `blur(${dims.blur * (0.6 + c.scale * 0.4)}px)`,
            }}
            animate={
              animate
                ? {
                    x: [0, (i % 2 === 0 ? 3 : -3), 0],
                    y: [0, (i % 3 === 0 ? -4 : 2), 0],
                  }
                : undefined
            }
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Glow effect */}
      {glowing && (
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 60%)`,
            filter: `blur(${dims.blur * 1.5}px)`,
          }}
        />
      )}

      {/* Label pill */}
      {label && (
        <motion.div
          className="relative z-10 px-5 py-2.5 rounded-full backdrop-blur-xl border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
        >
          <span className="text-sm font-medium text-white/90 tracking-wide">
            {label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cloud;
