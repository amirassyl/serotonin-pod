import { useRef, useCallback, useEffect } from 'react';

// Creates a gentle ambient drone using Web Audio API
export const useAmbientAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const activeRef = useRef(false);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Layered drone: fundamental + fifths + subtle shimmer
    const frequencies = [55, 82.5, 110, 165, 220];
    const types: OscillatorType[] = ['sine', 'sine', 'sine', 'triangle', 'sine'];
    const volumes = [0.4, 0.25, 0.2, 0.08, 0.05];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = types[i];
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volumes[i], ctx.currentTime);

      // Subtle frequency drift for organic feel
      if (i > 0) {
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 1.002, ctx.currentTime + 8);
        osc.frequency.linearRampToValueAtTime(freq * 0.998, ctx.currentTime + 16);
      }

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      oscillatorsRef.current.push(osc);
    });
  }, []);

  const fadeOut = useCallback(() => {
    if (!ctxRef.current || !gainRef.current) return;
    const ctx = ctxRef.current;
    gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

    setTimeout(() => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      oscillatorsRef.current = [];
      try { ctx.close(); } catch {}
      activeRef.current = false;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
      }
    };
  }, []);

  return { start, fadeOut };
};
