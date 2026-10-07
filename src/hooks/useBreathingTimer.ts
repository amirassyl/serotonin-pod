import { useState, useEffect, useCallback, useRef } from 'react';

export type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

interface BreathingTimerState {
  phase: BreathPhase;
  progress: number; // 0-1 within current phase
  dialValue: number; // 0-1 overall dial position
  label: string;
  isRunning: boolean;
}

const PHASE_DURATION = 4000; // 4 seconds per phase
const PHASES: BreathPhase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
const LABELS: Record<BreathPhase, string> = {
  'inhale': 'Breathe In',
  'hold-in': 'Hold',
  'exhale': 'Breathe Out',
  'hold-out': 'Hold',
};

export function useBreathingTimer(autoStart = false) {
  const [state, setState] = useState<BreathingTimerState>({
    phase: 'inhale',
    progress: 0,
    dialValue: 0,
    label: 'Breathe In',
    isRunning: false,
  });

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const totalCycle = PHASE_DURATION * 4;
    const cyclePos = elapsed % totalCycle;
    const phaseIndex = Math.floor(cyclePos / PHASE_DURATION);
    const phase = PHASES[phaseIndex];
    const progress = (cyclePos % PHASE_DURATION) / PHASE_DURATION;

    let dialValue: number;
    switch (phase) {
      case 'inhale': dialValue = progress; break;
      case 'hold-in': dialValue = 1; break;
      case 'exhale': dialValue = 1 - progress; break;
      case 'hold-out': dialValue = 0; break;
    }

    setState({
      phase,
      progress,
      dialValue,
      label: LABELS[phase],
      isRunning: true,
    });

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setState(s => ({ ...s, isRunning: false }));
  }, []);

  useEffect(() => {
    if (autoStart) start();
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoStart, start]);

  return { ...state, start, stop };
}
