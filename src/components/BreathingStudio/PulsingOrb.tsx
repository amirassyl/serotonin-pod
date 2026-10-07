import { useEffect, useRef, useState } from 'react';

interface PulsingOrbProps {
  isActive: boolean;
  color: { h: number; s: number; l: number };
  dialValue: number;
  getOutputVolume?: () => number;
}

const PulsingOrb = ({ isActive, color, dialValue, getOutputVolume }: PulsingOrbProps) => {
  const [volumeScale, setVolumeScale] = useState(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!getOutputVolume || !isActive) {
      setVolumeScale(1);
      return;
    }
    const poll = () => {
      const vol = getOutputVolume();
      setVolumeScale(1 + vol * 0.35);
      rafRef.current = requestAnimationFrame(poll);
    };
    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getOutputVolume, isActive]);

  const voiceExtra = isActive ? volumeScale : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outer diffuse halo */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280, height: 280,
          background: `radial-gradient(circle, hsla(${color.h}, 45%, 60%, 0.2) 0%, hsla(${color.h + 20}, 35%, 40%, 0.08) 50%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'auraBreath 18s ease-in-out infinite',
          transform: `scale(${voiceExtra})`,
          transition: isActive ? 'transform 0.1s' : undefined,
        }}
      />

      {/* Mid layer */}
      <div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          background: `radial-gradient(circle, hsla(${color.h - 10}, 50%, 65%, 0.3) 0%, hsla(${color.h + 10}, 40%, 50%, 0.1) 60%, transparent 80%)`,
          filter: 'blur(45px)',
          animation: 'auraBreath 18s ease-in-out infinite',
          animationDelay: '-0.3s',
          transform: `scale(${voiceExtra})`,
          transition: isActive ? 'transform 0.1s' : undefined,
        }}
      />

      {/* Inner bright core */}
      <div
        className="absolute rounded-full"
        style={{
          width: 120, height: 120,
          background: `radial-gradient(circle at 45% 40%, hsla(${color.h}, 55%, 75%, 0.5) 0%, hsla(${color.h + 15}, 45%, 55%, 0.2) 60%, transparent 85%)`,
          filter: 'blur(30px)',
          animation: 'auraBreath 18s ease-in-out infinite',
          animationDelay: '-0.5s',
          transform: `scale(${voiceExtra})`,
          transition: isActive ? 'transform 0.1s' : undefined,
        }}
      />

      <style>{`
        @keyframes auraBreath {
          0% { transform: scale(1); opacity: 0.6; }
          28% { transform: scale(1.5); opacity: 1; }
          35% { transform: scale(1.48); opacity: 0.95; }
          42% { transform: scale(1.52); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.97; }
          78% { transform: scale(1); opacity: 0.55; }
          85% { transform: scale(1.02); opacity: 0.58; }
          92% { transform: scale(0.98); opacity: 0.53; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default PulsingOrb;
