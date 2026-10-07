export type PoseCategory = 'Expansion' | 'Openness' | 'Stability' | 'Release' | 'Comfort';

export interface PoseLandmark {
  x: number;
  y: number;
  visibility?: number;
}

export interface GhostCoordinates {
  nose: PoseLandmark;
  leftShoulder: PoseLandmark;
  rightShoulder: PoseLandmark;
  leftElbow: PoseLandmark;
  rightElbow: PoseLandmark;
  leftWrist: PoseLandmark;
  rightWrist: PoseLandmark;
  leftHip: PoseLandmark;
  rightHip: PoseLandmark;
  leftKnee: PoseLandmark;
  rightKnee: PoseLandmark;
  leftAnkle: PoseLandmark;
  rightAnkle: PoseLandmark;
}

export interface Pose {
  id: string;
  title: string;
  category: PoseCategory;
  difficultyLevel: 1 | 2 | 3;
  scientificBenefit: string;
  shortDescription: string;
  ghostCoordinates: GhostCoordinates;
}

// Normalized coordinates (0-1 range) for ghost poses
// These represent the target positions relative to body center
export const poses: Pose[] = [
  {
    id: 'victory-v',
    title: 'The Victory V',
    category: 'Expansion',
    difficultyLevel: 1,
    scientificBenefit: 'Raising arms in a V shape increases testosterone levels by up to 20% and decreases cortisol, creating a biochemical shift toward confidence.',
    shortDescription: 'Arms raised in V shape above head',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.4, y: 0.28 },
      rightShoulder: { x: 0.6, y: 0.28 },
      leftElbow: { x: 0.28, y: 0.18 },
      rightElbow: { x: 0.72, y: 0.18 },
      leftWrist: { x: 0.2, y: 0.08 },
      rightWrist: { x: 0.8, y: 0.08 },
      leftHip: { x: 0.42, y: 0.52 },
      rightHip: { x: 0.58, y: 0.52 },
      leftKnee: { x: 0.42, y: 0.72 },
      rightKnee: { x: 0.58, y: 0.72 },
      leftAnkle: { x: 0.42, y: 0.92 },
      rightAnkle: { x: 0.58, y: 0.92 },
    },
  },
  {
    id: 'commander',
    title: 'The Commander',
    category: 'Expansion',
    difficultyLevel: 1,
    scientificBenefit: 'The hands-on-hips stance expands your physical presence, signaling dominance and triggering feelings of power and control.',
    shortDescription: 'Hands on hips, chest expanded',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.38, y: 0.28 },
      rightShoulder: { x: 0.62, y: 0.28 },
      leftElbow: { x: 0.28, y: 0.42 },
      rightElbow: { x: 0.72, y: 0.42 },
      leftWrist: { x: 0.38, y: 0.48 },
      rightWrist: { x: 0.62, y: 0.48 },
      leftHip: { x: 0.42, y: 0.52 },
      rightHip: { x: 0.58, y: 0.52 },
      leftKnee: { x: 0.40, y: 0.72 },
      rightKnee: { x: 0.60, y: 0.72 },
      leftAnkle: { x: 0.38, y: 0.92 },
      rightAnkle: { x: 0.62, y: 0.92 },
    },
  },
  {
    id: 'sky-reacher',
    title: 'The Sky Reacher',
    category: 'Expansion',
    difficultyLevel: 1,
    scientificBenefit: 'Full vertical extension activates the sympathetic nervous system, increasing alertness and energy while stretching the entire posterior chain.',
    shortDescription: 'Both arms stretched straight up',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.42, y: 0.28 },
      rightShoulder: { x: 0.58, y: 0.28 },
      leftElbow: { x: 0.42, y: 0.15 },
      rightElbow: { x: 0.58, y: 0.15 },
      leftWrist: { x: 0.44, y: 0.02 },
      rightWrist: { x: 0.56, y: 0.02 },
      leftHip: { x: 0.44, y: 0.52 },
      rightHip: { x: 0.56, y: 0.52 },
      leftKnee: { x: 0.44, y: 0.72 },
      rightKnee: { x: 0.56, y: 0.72 },
      leftAnkle: { x: 0.44, y: 0.92 },
      rightAnkle: { x: 0.56, y: 0.92 },
    },
  },
  {
    id: 'welcoming-open',
    title: 'The Welcoming Open',
    category: 'Openness',
    difficultyLevel: 1,
    scientificBenefit: 'Open arm postures signal approachability and trust, while stimulating oxytocin release and reducing defensive stress responses.',
    shortDescription: 'Arms wide open, palms forward',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.38, y: 0.28 },
      rightShoulder: { x: 0.62, y: 0.28 },
      leftElbow: { x: 0.18, y: 0.32 },
      rightElbow: { x: 0.82, y: 0.32 },
      leftWrist: { x: 0.05, y: 0.35 },
      rightWrist: { x: 0.95, y: 0.35 },
      leftHip: { x: 0.44, y: 0.52 },
      rightHip: { x: 0.56, y: 0.52 },
      leftKnee: { x: 0.44, y: 0.72 },
      rightKnee: { x: 0.56, y: 0.72 },
      leftAnkle: { x: 0.44, y: 0.92 },
      rightAnkle: { x: 0.56, y: 0.92 },
    },
  },
  {
    id: 'ceo-lean',
    title: 'The CEO Lean',
    category: 'Openness',
    difficultyLevel: 2,
    scientificBenefit: 'This reclined posture with hands behind head maximizes territorial expansion, associated with high-status individuals and reduced anxiety.',
    shortDescription: 'Relaxed lean back, hands behind head',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.18 },
      leftShoulder: { x: 0.35, y: 0.30 },
      rightShoulder: { x: 0.65, y: 0.30 },
      leftElbow: { x: 0.22, y: 0.22 },
      rightElbow: { x: 0.78, y: 0.22 },
      leftWrist: { x: 0.42, y: 0.12 },
      rightWrist: { x: 0.58, y: 0.12 },
      leftHip: { x: 0.42, y: 0.55 },
      rightHip: { x: 0.58, y: 0.55 },
      leftKnee: { x: 0.38, y: 0.75 },
      rightKnee: { x: 0.62, y: 0.75 },
      leftAnkle: { x: 0.35, y: 0.95 },
      rightAnkle: { x: 0.65, y: 0.95 },
    },
  },
  {
    id: 'warrior',
    title: 'The Warrior',
    category: 'Stability',
    difficultyLevel: 2,
    scientificBenefit: 'Wide stance with extended arms activates core stability muscles and creates grounding, reducing the startle response and promoting calm focus.',
    shortDescription: 'Wide stance, arms extended to sides',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.38, y: 0.28 },
      rightShoulder: { x: 0.62, y: 0.28 },
      leftElbow: { x: 0.18, y: 0.30 },
      rightElbow: { x: 0.82, y: 0.30 },
      leftWrist: { x: 0.02, y: 0.32 },
      rightWrist: { x: 0.98, y: 0.32 },
      leftHip: { x: 0.38, y: 0.52 },
      rightHip: { x: 0.62, y: 0.52 },
      leftKnee: { x: 0.28, y: 0.72 },
      rightKnee: { x: 0.72, y: 0.72 },
      leftAnkle: { x: 0.22, y: 0.92 },
      rightAnkle: { x: 0.78, y: 0.92 },
    },
  },
  {
    id: 'tree',
    title: 'The Tree',
    category: 'Stability',
    difficultyLevel: 3,
    scientificBenefit: 'Single-leg balance poses require deep focus, activating the prefrontal cortex and improving concentration while building proprioceptive awareness.',
    shortDescription: 'One leg lifted, arms overhead',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.42, y: 0.28 },
      rightShoulder: { x: 0.58, y: 0.28 },
      leftElbow: { x: 0.40, y: 0.15 },
      rightElbow: { x: 0.60, y: 0.15 },
      leftWrist: { x: 0.48, y: 0.02 },
      rightWrist: { x: 0.52, y: 0.02 },
      leftHip: { x: 0.45, y: 0.52 },
      rightHip: { x: 0.55, y: 0.52 },
      leftKnee: { x: 0.55, y: 0.58 },
      rightKnee: { x: 0.50, y: 0.72 },
      leftAnkle: { x: 0.52, y: 0.68 },
      rightAnkle: { x: 0.50, y: 0.92 },
    },
  },
  {
    id: 'ragdoll',
    title: 'The Ragdoll',
    category: 'Release',
    difficultyLevel: 1,
    scientificBenefit: 'Forward folding activates the parasympathetic nervous system, slowing heart rate and promoting relaxation while releasing tension in the spine.',
    shortDescription: 'Forward fold, arms hanging loose',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.55 },
      leftShoulder: { x: 0.42, y: 0.45 },
      rightShoulder: { x: 0.58, y: 0.45 },
      leftElbow: { x: 0.40, y: 0.60 },
      rightElbow: { x: 0.60, y: 0.60 },
      leftWrist: { x: 0.42, y: 0.75 },
      rightWrist: { x: 0.58, y: 0.75 },
      leftHip: { x: 0.44, y: 0.42 },
      rightHip: { x: 0.56, y: 0.42 },
      leftKnee: { x: 0.44, y: 0.68 },
      rightKnee: { x: 0.56, y: 0.68 },
      leftAnkle: { x: 0.44, y: 0.92 },
      rightAnkle: { x: 0.56, y: 0.92 },
    },
  },
  {
    id: 'shaker',
    title: 'The Shaker',
    category: 'Release',
    difficultyLevel: 2,
    scientificBenefit: 'Shaking releases stored muscular tension and trauma, a practice used in somatic therapy to discharge stress hormones and reset the nervous system.',
    shortDescription: 'Active shake motion, loose movement',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.40, y: 0.28 },
      rightShoulder: { x: 0.60, y: 0.28 },
      leftElbow: { x: 0.30, y: 0.38 },
      rightElbow: { x: 0.70, y: 0.38 },
      leftWrist: { x: 0.25, y: 0.48 },
      rightWrist: { x: 0.75, y: 0.48 },
      leftHip: { x: 0.44, y: 0.52 },
      rightHip: { x: 0.56, y: 0.52 },
      leftKnee: { x: 0.42, y: 0.72 },
      rightKnee: { x: 0.58, y: 0.72 },
      leftAnkle: { x: 0.42, y: 0.92 },
      rightAnkle: { x: 0.58, y: 0.92 },
    },
  },
  {
    id: 'self-hug',
    title: 'The Self-Hug',
    category: 'Comfort',
    difficultyLevel: 1,
    scientificBenefit: 'Self-touch activates the same neural pathways as touch from others, releasing oxytocin and reducing feelings of loneliness and anxiety.',
    shortDescription: 'Arms wrapped around self',
    ghostCoordinates: {
      nose: { x: 0.5, y: 0.15 },
      leftShoulder: { x: 0.40, y: 0.28 },
      rightShoulder: { x: 0.60, y: 0.28 },
      leftElbow: { x: 0.58, y: 0.38 },
      rightElbow: { x: 0.42, y: 0.38 },
      leftWrist: { x: 0.65, y: 0.32 },
      rightWrist: { x: 0.35, y: 0.32 },
      leftHip: { x: 0.44, y: 0.52 },
      rightHip: { x: 0.56, y: 0.52 },
      leftKnee: { x: 0.44, y: 0.72 },
      rightKnee: { x: 0.56, y: 0.72 },
      leftAnkle: { x: 0.44, y: 0.92 },
      rightAnkle: { x: 0.56, y: 0.92 },
    },
  },
];

export const getCategoryColor = (category: PoseCategory): string => {
  const colors: Record<PoseCategory, string> = {
    Expansion: 'category-expansion',
    Openness: 'category-openness',
    Stability: 'category-stability',
    Release: 'category-release',
    Comfort: 'category-comfort',
  };
  return colors[category];
};

// Returns pastel HSL values for category pills
export const getCategoryHSL = (category: PoseCategory): { bg: string; text: string } => {
  const colors: Record<PoseCategory, { bg: string; text: string }> = {
    Expansion: { bg: '30 100% 94%', text: '30 100% 45%' },
    Openness: { bg: '270 100% 95%', text: '270 60% 50%' },
    Stability: { bg: '210 100% 95%', text: '210 100% 45%' },
    Release: { bg: '142 76% 95%', text: '142 50% 35%' },
    Comfort: { bg: '330 100% 96%', text: '330 60% 45%' },
  };
  return colors[category];
};
