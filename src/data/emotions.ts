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

export type CoreEmotion =
  | 'Joy'
  | 'Trust'
  | 'Fear'
  | 'Surprise'
  | 'Sadness'
  | 'Disgust'
  | 'Anger'
  | 'Anticipation';

export interface Emotion {
  id: string;
  name: string;
  coreEmotion: CoreEmotion;
  intensity: 'mild' | 'moderate' | 'intense';
  definition: string;
  psychiatricInsight: string;
  somaticDescription: string;
  poseInstruction: string;
  difficultyLevel: 1 | 2 | 3;
  ghostCoordinates: GhostCoordinates;
  ambientDescription: string;
  // Optional second pose for the timed flow (60s pose 1 → 60s pose 2)
  poseInstruction2?: string;
  ghostCoordinates2?: GhostCoordinates;
  subEmotionName2?: string;
}

export interface CoreEmotionData {
  name: CoreEmotion;
  color: { h: number; s: number; l: number };
  description: string;
  oppositeEmotion: CoreEmotion;
  emotions: [Emotion, Emotion, Emotion]; // mild, moderate, intense
}

// ─── Standard standing base (reused across many poses) ───
const standingLegs = {
  leftHip: { x: 0.44, y: 0.52 },
  rightHip: { x: 0.56, y: 0.52 },
  leftKnee: { x: 0.44, y: 0.72 },
  rightKnee: { x: 0.56, y: 0.72 },
  leftAnkle: { x: 0.44, y: 0.92 },
  rightAnkle: { x: 0.56, y: 0.92 },
};

const wideStanceLegs = {
  leftHip: { x: 0.38, y: 0.52 },
  rightHip: { x: 0.62, y: 0.52 },
  leftKnee: { x: 0.28, y: 0.72 },
  rightKnee: { x: 0.72, y: 0.72 },
  leftAnkle: { x: 0.22, y: 0.92 },
  rightAnkle: { x: 0.78, y: 0.92 },
};

// ─── The 24 Emotions ───

export const coreEmotions: CoreEmotionData[] = [
  // ══════════════════════════════════════════════
  // JOY
  // ══════════════════════════════════════════════
  {
    name: 'Joy',
    color: { h: 45, s: 100, l: 60 },
    description: 'A feeling of great pleasure and happiness. Joy spans from quiet contentment to overwhelming euphoria.',
    oppositeEmotion: 'Sadness',
    emotions: [
      {
        id: 'joy-serenity',
        name: 'Serenity',
        coreEmotion: 'Joy',
        intensity: 'mild',
        definition: 'A state of being calm, peaceful, and untroubled — joy at its most gentle.',
        psychiatricInsight: 'Research by Barbara Fredrickson shows that mild positive emotions like serenity broaden our attention and build long-term psychological resilience more effectively than intense happiness.',
        somaticDescription: 'Serenity lives as a softening in the chest and an openness in the palms — the body literally "receives" the world.',
        poseInstruction: 'Stand relaxed with arms gently open at your sides, palms facing upward at waist height.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.30, y: 0.40 },
          rightElbow: { x: 0.70, y: 0.40 },
          leftWrist: { x: 0.28, y: 0.48 },
          rightWrist: { x: 0.72, y: 0.48 },
          ...standingLegs,
        },
        ambientDescription: 'Soft wind chimes and distant birdsong',
      },
      {
        id: 'joy-joy',
        name: 'Joy',
        coreEmotion: 'Joy',
        intensity: 'moderate',
        definition: 'An active, bright feeling of happiness and delight in the present moment.',
        psychiatricInsight: 'Amy Cuddy\'s research at Harvard demonstrated that holding expansive "victory" postures for just 2 minutes increases testosterone by 20% and decreases cortisol by 25%.',
        somaticDescription: 'Joy rises through the body as an upward lift — arms want to rise, the chest opens, the face softens into a smile.',
        poseInstruction: 'Raise both arms overhead in a V shape, chest lifted, as if celebrating a personal victory.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.4, y: 0.28 },
          rightShoulder: { x: 0.6, y: 0.28 },
          leftElbow: { x: 0.28, y: 0.18 },
          rightElbow: { x: 0.72, y: 0.18 },
          leftWrist: { x: 0.2, y: 0.08 },
          rightWrist: { x: 0.8, y: 0.08 },
          ...standingLegs,
        },
        ambientDescription: 'Bright acoustic guitar melody with light percussion',
        subEmotionName2: 'Grounded Joy',
        poseInstruction2: 'Lower your arms and place both hands gently over your heart. Soften your knees and breathe the joy inward.',
        ghostCoordinates2: {
          nose: { x: 0.5, y: 0.18 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.44, y: 0.38 },
          rightElbow: { x: 0.56, y: 0.38 },
          leftWrist: { x: 0.48, y: 0.32 },
          rightWrist: { x: 0.52, y: 0.32 },
          ...standingLegs,
        },
      },
      {
        id: 'joy-ecstasy',
        name: 'Ecstasy',
        coreEmotion: 'Joy',
        intensity: 'intense',
        definition: 'An overwhelming feeling of rapturous delight — joy at its most intense and all-encompassing.',
        psychiatricInsight: 'Neuroscientist Jaak Panksepp identified that ecstatic states activate the brain\'s SEEKING system, flooding the nucleus accumbens with dopamine — the same circuit activated by profound musical experiences.',
        somaticDescription: 'Ecstasy is total vertical expansion — the body reaches its maximum height, head tilts back, every limb extends outward and upward.',
        poseInstruction: 'Stretch both arms as high as possible, rise onto your toes, and tilt your head slightly back toward the sky.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.12 },
          leftShoulder: { x: 0.42, y: 0.25 },
          rightShoulder: { x: 0.58, y: 0.25 },
          leftElbow: { x: 0.40, y: 0.12 },
          rightElbow: { x: 0.60, y: 0.12 },
          leftWrist: { x: 0.44, y: 0.02 },
          rightWrist: { x: 0.56, y: 0.02 },
          ...standingLegs,
        },
        ambientDescription: 'Soaring orchestral crescendo with choir voices',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // TRUST
  // ══════════════════════════════════════════════
  {
    name: 'Trust',
    color: { h: 120, s: 50, l: 55 },
    description: 'A firm belief in the reliability and safety of another. Trust ranges from quiet acceptance to deep admiration.',
    oppositeEmotion: 'Disgust',
    emotions: [
      {
        id: 'trust-acceptance',
        name: 'Acceptance',
        coreEmotion: 'Trust',
        intensity: 'mild',
        definition: 'A willingness to tolerate a situation or person without resistance — trust in its most relaxed form.',
        psychiatricInsight: 'Psychologist Carl Rogers described unconditional positive regard — accepting others without judgment — as the single most important factor in therapeutic healing.',
        somaticDescription: 'Acceptance shows as a gentle forward lean of the torso with hands resting on the heart — the body says "I receive you."',
        poseInstruction: 'Place both hands gently over your heart, allow a slight forward bow of the head.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.18 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.44, y: 0.38 },
          rightElbow: { x: 0.56, y: 0.38 },
          leftWrist: { x: 0.48, y: 0.32 },
          rightWrist: { x: 0.52, y: 0.32 },
          ...standingLegs,
        },
        ambientDescription: 'Gentle rainfall on leaves',
      },
      {
        id: 'trust-trust',
        name: 'Trust',
        coreEmotion: 'Trust',
        intensity: 'moderate',
        definition: 'A confident feeling that you can rely on someone or something — opening yourself to vulnerability.',
        psychiatricInsight: 'Paul Zak\'s research found that physical displays of trust (like open palms) trigger oxytocin release — the "bonding hormone" — creating a neurochemical feedback loop of increasing trust.',
        somaticDescription: 'Trust opens the front body completely — arms spread wide, chest exposed, palms facing forward. The body says "I have nothing to hide."',
        poseInstruction: 'Open both arms wide to your sides, palms facing forward, chest open and exposed.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.38, y: 0.28 },
          rightShoulder: { x: 0.62, y: 0.28 },
          leftElbow: { x: 0.18, y: 0.32 },
          rightElbow: { x: 0.82, y: 0.32 },
          leftWrist: { x: 0.05, y: 0.35 },
          rightWrist: { x: 0.95, y: 0.35 },
          ...standingLegs,
        },
        ambientDescription: 'Warm cello notes with soft harmonics',
      },
      {
        id: 'trust-admiration',
        name: 'Admiration',
        coreEmotion: 'Trust',
        intensity: 'intense',
        definition: 'A feeling of deep respect and warm approval — trust elevated to reverence.',
        psychiatricInsight: 'Dacher Keltner\'s research at UC Berkeley shows that admiration activates the vagus nerve, slowing heart rate and promoting a state of calm connection — the physiological basis of "being moved."',
        somaticDescription: 'Admiration places one hand on the heart (internal feeling) while the other reaches toward the admired — a bridge between self and other.',
        poseInstruction: 'Place your left hand on your heart, extend your right arm outward with palm up, as if offering something precious.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.44, y: 0.38 },
          rightElbow: { x: 0.78, y: 0.30 },
          leftWrist: { x: 0.48, y: 0.32 },
          rightWrist: { x: 0.92, y: 0.32 },
          ...standingLegs,
        },
        ambientDescription: 'Cathedral organ with reverberant acoustics',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // FEAR
  // ══════════════════════════════════════════════
  {
    name: 'Fear',
    color: { h: 270, s: 60, l: 55 },
    description: 'An unpleasant emotion caused by the perception of danger. Fear moves from vague unease to paralyzing terror.',
    oppositeEmotion: 'Anger',
    emotions: [
      {
        id: 'fear-apprehension',
        name: 'Apprehension',
        coreEmotion: 'Fear',
        intensity: 'mild',
        definition: 'Anxiety or fear that something bad might happen — a watchful, protective alertness.',
        psychiatricInsight: 'Mild apprehension activates the amygdala\'s early warning system. Joseph LeDoux discovered this "low road" fear response occurs 12 milliseconds before conscious awareness — your body knows before you do.',
        somaticDescription: 'Apprehension draws the arms inward and lifts the shoulders — the body begins to shield itself while staying mobile.',
        poseInstruction: 'Bring your arms close to your body, raise your shoulders slightly toward your ears, hands at chest height.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.42, y: 0.26 },
          rightShoulder: { x: 0.58, y: 0.26 },
          leftElbow: { x: 0.40, y: 0.36 },
          rightElbow: { x: 0.60, y: 0.36 },
          leftWrist: { x: 0.42, y: 0.30 },
          rightWrist: { x: 0.58, y: 0.30 },
          ...standingLegs,
        },
        ambientDescription: 'Distant thunder with low wind',
      },
      {
        id: 'fear-fear',
        name: 'Fear',
        coreEmotion: 'Fear',
        intensity: 'moderate',
        definition: 'A strong, unpleasant feeling of being in danger — the body\'s protective alarm system activated.',
        psychiatricInsight: 'Fear triggers the hypothalamic-pituitary-adrenal (HPA) axis, releasing cortisol and adrenaline. Peter Levine\'s Somatic Experiencing therapy uses conscious body awareness to "complete" interrupted fear responses stored in the body.',
        somaticDescription: 'Fear crosses the arms over the chest and begins to crouch — the body creates a shield while making itself a smaller target.',
        poseInstruction: 'Cross both arms over your chest, bend your knees slightly into a protective crouch.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.20 },
          leftShoulder: { x: 0.42, y: 0.30 },
          rightShoulder: { x: 0.58, y: 0.30 },
          leftElbow: { x: 0.55, y: 0.38 },
          rightElbow: { x: 0.45, y: 0.38 },
          leftWrist: { x: 0.60, y: 0.32 },
          rightWrist: { x: 0.40, y: 0.32 },
          leftHip: { x: 0.44, y: 0.55 },
          rightHip: { x: 0.56, y: 0.55 },
          leftKnee: { x: 0.42, y: 0.74 },
          rightKnee: { x: 0.58, y: 0.74 },
          leftAnkle: { x: 0.44, y: 0.92 },
          rightAnkle: { x: 0.56, y: 0.92 },
        },
        ambientDescription: 'Rapid heartbeat with dissonant strings',
      },
      {
        id: 'fear-terror',
        name: 'Terror',
        coreEmotion: 'Fear',
        intensity: 'intense',
        definition: 'Extreme, overwhelming fear — the body\'s maximum defensive response.',
        psychiatricInsight: 'In states of terror, the prefrontal cortex goes offline and the brainstem takes over. Bessel van der Kolk\'s "The Body Keeps the Score" documents how terror literally reshapes neural pathways, and somatic re-experiencing is key to healing.',
        somaticDescription: 'Terror covers the face and curls the body inward — every surface protected, the body folds around its vital organs.',
        poseInstruction: 'Cover your face with both hands, curl your torso forward, bend deeply at the knees.',
        difficultyLevel: 3,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.30 },
          leftShoulder: { x: 0.42, y: 0.35 },
          rightShoulder: { x: 0.58, y: 0.35 },
          leftElbow: { x: 0.44, y: 0.30 },
          rightElbow: { x: 0.56, y: 0.30 },
          leftWrist: { x: 0.46, y: 0.25 },
          rightWrist: { x: 0.54, y: 0.25 },
          leftHip: { x: 0.44, y: 0.50 },
          rightHip: { x: 0.56, y: 0.50 },
          leftKnee: { x: 0.42, y: 0.70 },
          rightKnee: { x: 0.58, y: 0.70 },
          leftAnkle: { x: 0.44, y: 0.90 },
          rightAnkle: { x: 0.56, y: 0.90 },
        },
        ambientDescription: 'Silence punctuated by sharp percussive hits',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // SURPRISE
  // ══════════════════════════════════════════════
  {
    name: 'Surprise',
    color: { h: 195, s: 80, l: 55 },
    description: 'A brief emotional state triggered by unexpected events. Surprise ranges from mild distraction to total amazement.',
    oppositeEmotion: 'Anticipation',
    emotions: [
      {
        id: 'surprise-distraction',
        name: 'Distraction',
        coreEmotion: 'Surprise',
        intensity: 'mild',
        definition: 'A brief shift in attention caused by something unexpected — the mildest form of surprise.',
        psychiatricInsight: 'Distraction activates the orienting response, first described by Ivan Pavlov. Your pupils dilate, heart rate briefly slows, and all senses sharpen — an evolutionary "what is it?" reflex.',
        somaticDescription: 'Distraction tilts the head and raises one hand — the body\'s "hmm?" gesture, curious but not alarmed.',
        poseInstruction: 'Tilt your head to one side, raise one hand to about ear height with palm open.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.52, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.32, y: 0.38 },
          rightElbow: { x: 0.72, y: 0.20 },
          leftWrist: { x: 0.28, y: 0.45 },
          rightWrist: { x: 0.78, y: 0.15 },
          ...standingLegs,
        },
        ambientDescription: 'A sudden music box note followed by curious tinkling',
      },
      {
        id: 'surprise-surprise',
        name: 'Surprise',
        coreEmotion: 'Surprise',
        intensity: 'moderate',
        definition: 'An emotional response to something completely unexpected — the classic startle-then-process reaction.',
        psychiatricInsight: 'Paul Ekman identified surprise as the briefest of all emotions, typically lasting only 1/25th of a second before transitioning into another emotion. It is the only emotion that is neither positive nor negative.',
        somaticDescription: 'Surprise throws both hands up and opens the eyes wide — the body\'s "freeze-and-assess" moment before deciding to fight, flee, or relax.',
        poseInstruction: 'Raise both hands up to head height with palms facing outward, eyes wide.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.32, y: 0.22 },
          rightElbow: { x: 0.68, y: 0.22 },
          leftWrist: { x: 0.30, y: 0.12 },
          rightWrist: { x: 0.70, y: 0.12 },
          ...standingLegs,
        },
        ambientDescription: 'Sharp ascending glissando followed by reverberant silence',
      },
      {
        id: 'surprise-amazement',
        name: 'Amazement',
        coreEmotion: 'Surprise',
        intensity: 'intense',
        definition: 'A state of overwhelming wonder — surprise so complete it temporarily halts all other thought.',
        psychiatricInsight: 'Dacher Keltner\'s awe research shows that experiences of amazement make people feel "small self" — a healthy ego dissolution that increases prosocial behavior and generosity for up to a week afterward.',
        somaticDescription: 'Amazement spreads the arms wide and tilts the head back — the body opens completely to receive the astonishing.',
        poseInstruction: 'Spread both arms wide to your sides, tilt your head back slightly, mouth open in wonder.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.12 },
          leftShoulder: { x: 0.38, y: 0.28 },
          rightShoulder: { x: 0.62, y: 0.28 },
          leftElbow: { x: 0.18, y: 0.28 },
          rightElbow: { x: 0.82, y: 0.28 },
          leftWrist: { x: 0.05, y: 0.28 },
          rightWrist: { x: 0.95, y: 0.28 },
          ...standingLegs,
        },
        ambientDescription: 'Vast reverberant space with distant ethereal choir',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // SADNESS
  // ══════════════════════════════════════════════
  {
    name: 'Sadness',
    color: { h: 210, s: 60, l: 50 },
    description: 'An emotional pain associated with loss, disappointment, or helplessness. Sadness moves from wistful pensiveness to overwhelming grief.',
    oppositeEmotion: 'Joy',
    emotions: [
      {
        id: 'sadness-pensiveness',
        name: 'Pensiveness',
        coreEmotion: 'Sadness',
        intensity: 'mild',
        definition: 'A quiet, reflective melancholy — sadness turned inward as contemplation.',
        psychiatricInsight: 'Mild sadness has been shown to improve memory accuracy, reduce judgmental errors, and increase empathy. Joseph Forgas calls this the "sadder but wiser" effect.',
        somaticDescription: 'Pensiveness drops the arms and lowers the gaze — the body\'s energy sinks gently downward, turning attention inward.',
        poseInstruction: 'Let both arms hang loosely at your sides, lower your head slightly, gaze downward.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.20 },
          leftShoulder: { x: 0.42, y: 0.30 },
          rightShoulder: { x: 0.58, y: 0.30 },
          leftElbow: { x: 0.38, y: 0.45 },
          rightElbow: { x: 0.62, y: 0.45 },
          leftWrist: { x: 0.38, y: 0.55 },
          rightWrist: { x: 0.62, y: 0.55 },
          ...standingLegs,
        },
        ambientDescription: 'Soft piano with rain on windowpanes',
      },
      {
        id: 'sadness-sadness',
        name: 'Sadness',
        coreEmotion: 'Sadness',
        intensity: 'moderate',
        definition: 'A deep emotional pain that asks for comfort — the body naturally seeks to soothe itself.',
        psychiatricInsight: 'Self-touch (like hugging yourself) activates the same oxytocin pathways as being hugged by someone else. Tiffany Field\'s Touch Research Institute confirmed that self-holding reduces cortisol by up to 30%.',
        somaticDescription: 'Sadness wraps the arms around the self and bows the head — the body becomes both the one who hurts and the one who comforts.',
        poseInstruction: 'Wrap both arms around yourself in a self-hug, bow your head gently forward.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.20 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.58, y: 0.38 },
          rightElbow: { x: 0.42, y: 0.38 },
          leftWrist: { x: 0.65, y: 0.32 },
          rightWrist: { x: 0.35, y: 0.32 },
          ...standingLegs,
        },
        ambientDescription: 'Solo violin playing a minor key lullaby',
      },
      {
        id: 'sadness-grief',
        name: 'Grief',
        coreEmotion: 'Sadness',
        intensity: 'intense',
        definition: 'Deep, consuming sorrow — sadness so heavy the body collapses under its weight.',
        psychiatricInsight: 'Elisabeth Kübler-Ross identified grief as a process, not a state. Neuroscientist Mary-Frances O\'Connor discovered that the brain processes grief in the same region as physical pain (the anterior cingulate cortex).',
        somaticDescription: 'Grief folds the body forward and down — a deep bow toward the earth, arms wrapping around the body as if holding oneself together.',
        poseInstruction: 'Fold deeply forward at the waist, wrap your arms around your body, let your head hang.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.55 },
          leftShoulder: { x: 0.42, y: 0.45 },
          rightShoulder: { x: 0.58, y: 0.45 },
          leftElbow: { x: 0.55, y: 0.50 },
          rightElbow: { x: 0.45, y: 0.50 },
          leftWrist: { x: 0.60, y: 0.42 },
          rightWrist: { x: 0.40, y: 0.42 },
          leftHip: { x: 0.44, y: 0.42 },
          rightHip: { x: 0.56, y: 0.42 },
          leftKnee: { x: 0.44, y: 0.68 },
          rightKnee: { x: 0.56, y: 0.68 },
          leftAnkle: { x: 0.44, y: 0.92 },
          rightAnkle: { x: 0.56, y: 0.92 },
        },
        ambientDescription: 'Deep, resonant bowls with ocean waves',
        subEmotionName2: 'Grief — Sukhasana',
        poseInstruction2: 'Sit on the floor in Sukhasana — legs crossed comfortably, spine long, shoulders soft. Rest the backs of your hands on your knees, palms open. Close your eyes if it feels safe. Breathe in slowly through the nose for 4, out through the mouth for 6. Let the exhale carry the weight.',
        ghostCoordinates2: {
          nose: { x: 0.50, y: 0.30 },
          leftShoulder: { x: 0.42, y: 0.40 },
          rightShoulder: { x: 0.58, y: 0.40 },
          leftElbow: { x: 0.38, y: 0.55 },
          rightElbow: { x: 0.62, y: 0.55 },
          leftWrist: { x: 0.36, y: 0.68 },
          rightWrist: { x: 0.64, y: 0.68 },
          leftHip: { x: 0.45, y: 0.68 },
          rightHip: { x: 0.55, y: 0.68 },
          leftKnee: { x: 0.32, y: 0.72 },
          rightKnee: { x: 0.68, y: 0.72 },
          leftAnkle: { x: 0.46, y: 0.82 },
          rightAnkle: { x: 0.54, y: 0.82 },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════
  // DISGUST
  // ══════════════════════════════════════════════
  {
    name: 'Disgust',
    color: { h: 150, s: 40, l: 45 },
    description: 'A strong feeling of aversion or revulsion. Disgust evolved to protect us from contamination and has expanded to include moral judgments.',
    oppositeEmotion: 'Trust',
    emotions: [
      {
        id: 'disgust-boredom',
        name: 'Boredom',
        coreEmotion: 'Disgust',
        intensity: 'mild',
        definition: 'A feeling of weariness and dissatisfaction from lack of interest — a mild rejection of the current experience.',
        psychiatricInsight: 'Boredom researcher John Eastwood found that boredom is not the absence of stimulation, but the inability to engage with available stimulation. It signals a need for meaning, not entertainment.',
        somaticDescription: 'Boredom props the head on one hand while the other drops — the body says "I\'m too disengaged to even hold myself up."',
        poseInstruction: 'Rest your chin on one hand (elbow bent), let the other arm hang loosely at your side.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.38, y: 0.38 },
          rightElbow: { x: 0.62, y: 0.45 },
          leftWrist: { x: 0.46, y: 0.18 },
          rightWrist: { x: 0.62, y: 0.55 },
          ...standingLegs,
        },
        ambientDescription: 'Slow, monotone clock ticking',
      },
      {
        id: 'disgust-disgust',
        name: 'Disgust',
        coreEmotion: 'Disgust',
        intensity: 'moderate',
        definition: 'A strong feeling of aversion that creates a physical desire to push something away.',
        psychiatricInsight: 'Paul Rozin discovered that disgust, originally evolved for food rejection, expanded through evolution to include moral disgust — we literally use the same neural circuits to reject rotten food and ethical violations.',
        somaticDescription: 'Disgust pushes the hands forward and turns the body slightly — creating distance between self and the source of revulsion.',
        poseInstruction: 'Push both hands forward with palms out in a "stop" gesture, turn your torso slightly to one side.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.48, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.30, y: 0.32 },
          rightElbow: { x: 0.72, y: 0.32 },
          leftWrist: { x: 0.22, y: 0.28 },
          rightWrist: { x: 0.82, y: 0.28 },
          ...standingLegs,
        },
        ambientDescription: 'Discordant low brass with scraping textures',
      },
      {
        id: 'disgust-loathing',
        name: 'Loathing',
        coreEmotion: 'Disgust',
        intensity: 'intense',
        definition: 'Intense disgust combined with hatred — the strongest form of aversion.',
        psychiatricInsight: 'Extreme disgust responses activate the insular cortex so powerfully that they can cause physical nausea. Research by Valerie Curtis suggests loathing evolved as a "behavioral immune system" to protect groups from threats.',
        somaticDescription: 'Loathing turns the entire body away with arms blocking — maximum physical rejection and self-protection.',
        poseInstruction: 'Turn your body to the side, cross one arm across your body as a barrier, hold the other hand up in a "stop" gesture.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.45, y: 0.15 },
          leftShoulder: { x: 0.42, y: 0.28 },
          rightShoulder: { x: 0.58, y: 0.28 },
          leftElbow: { x: 0.55, y: 0.38 },
          rightElbow: { x: 0.70, y: 0.22 },
          leftWrist: { x: 0.60, y: 0.30 },
          rightWrist: { x: 0.80, y: 0.15 },
          ...standingLegs,
        },
        ambientDescription: 'Industrial scraping and harsh dissonance',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // ANGER
  // ══════════════════════════════════════════════
  {
    name: 'Anger',
    color: { h: 0, s: 75, l: 55 },
    description: 'A strong feeling of displeasure and antagonism. Anger ranges from mild irritation to explosive rage.',
    oppositeEmotion: 'Fear',
    emotions: [
      {
        id: 'anger-annoyance',
        name: 'Annoyance',
        coreEmotion: 'Anger',
        intensity: 'mild',
        definition: 'Slight irritation or displeasure — anger at its most contained and socially managed.',
        psychiatricInsight: 'Psychologist James Gross found that mild anger, when acknowledged rather than suppressed, actually improves negotiation outcomes. People who express annoyance get 8% better deals than those who suppress it.',
        somaticDescription: 'Annoyance places hands on hips and leans slightly forward — assertive but still controlled, the body communicates "I\'m not pleased" without aggression.',
        poseInstruction: 'Place both hands firmly on your hips, lean slightly forward, feet hip-width apart.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.38, y: 0.28 },
          rightShoulder: { x: 0.62, y: 0.28 },
          leftElbow: { x: 0.28, y: 0.42 },
          rightElbow: { x: 0.72, y: 0.42 },
          leftWrist: { x: 0.38, y: 0.48 },
          rightWrist: { x: 0.62, y: 0.48 },
          ...standingLegs,
        },
        ambientDescription: 'Persistent tapping rhythm growing louder',
      },
      {
        id: 'anger-anger',
        name: 'Anger',
        coreEmotion: 'Anger',
        intensity: 'moderate',
        definition: 'A strong feeling of hostility — the body prepares for confrontation.',
        psychiatricInsight: 'Anger activates the left prefrontal cortex — the same region associated with approach behavior and goal pursuit. Eddie Harmon-Jones demonstrated that anger is uniquely "approach-motivated," unlike other negative emotions.',
        somaticDescription: 'Anger clenches the fists, widens the stance, and squares the shoulders — the body becomes a fortress ready to advance.',
        poseInstruction: 'Clench both fists at your sides, widen your stance, square your shoulders forward.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.36, y: 0.28 },
          rightShoulder: { x: 0.64, y: 0.28 },
          leftElbow: { x: 0.30, y: 0.42 },
          rightElbow: { x: 0.70, y: 0.42 },
          leftWrist: { x: 0.32, y: 0.52 },
          rightWrist: { x: 0.68, y: 0.52 },
          ...wideStanceLegs,
        },
        ambientDescription: 'Deep war drums with increasing tempo',
      },
      {
        id: 'anger-rage',
        name: 'Rage',
        coreEmotion: 'Anger',
        intensity: 'intense',
        definition: 'Violent, uncontrollable anger — the body\'s maximum arousal state.',
        psychiatricInsight: 'In rage states, the amygdala "hijacks" the rational brain. Daniel Goleman coined this "amygdala hijack" — cortisol floods the system for up to 20 minutes. Somatic awareness is the fastest way to short-circuit this loop.',
        somaticDescription: 'Rage tenses every muscle outward — arms rigid and extended, stance wide, the entire body radiating "do not approach."',
        poseInstruction: 'Extend both arms outward with tensed fists, widen your stance as far as comfortable, lean slightly forward.',
        difficultyLevel: 3,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.14 },
          leftShoulder: { x: 0.34, y: 0.28 },
          rightShoulder: { x: 0.66, y: 0.28 },
          leftElbow: { x: 0.18, y: 0.32 },
          rightElbow: { x: 0.82, y: 0.32 },
          leftWrist: { x: 0.08, y: 0.38 },
          rightWrist: { x: 0.92, y: 0.38 },
          ...wideStanceLegs,
        },
        ambientDescription: 'Thunderous percussion with distorted bass',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // ANTICIPATION
  // ══════════════════════════════════════════════
  {
    name: 'Anticipation',
    color: { h: 25, s: 90, l: 55 },
    description: 'The expectation or prediction of a future event. Anticipation spans from casual interest to intense vigilance.',
    oppositeEmotion: 'Surprise',
    emotions: [
      {
        id: 'anticipation-interest',
        name: 'Interest',
        coreEmotion: 'Anticipation',
        intensity: 'mild',
        definition: 'A state of curiosity and engagement — the mind leaning toward something worth exploring.',
        psychiatricInsight: 'Silvan Tomkins identified interest as the most frequently experienced positive affect and the primary motivator of learning. Without interest, cognitive development essentially stops.',
        somaticDescription: 'Interest leans the body forward with hands coming together — the body\'s "tell me more" posture, engaged and gathering.',
        poseInstruction: 'Lean slightly forward, bring your hands together in front of your chest, as if about to receive something.',
        difficultyLevel: 1,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.15 },
          leftShoulder: { x: 0.40, y: 0.28 },
          rightShoulder: { x: 0.60, y: 0.28 },
          leftElbow: { x: 0.38, y: 0.38 },
          rightElbow: { x: 0.62, y: 0.38 },
          leftWrist: { x: 0.46, y: 0.35 },
          rightWrist: { x: 0.54, y: 0.35 },
          ...standingLegs,
        },
        ambientDescription: 'Soft marimba pattern with rising notes',
      },
      {
        id: 'anticipation-anticipation',
        name: 'Anticipation',
        coreEmotion: 'Anticipation',
        intensity: 'moderate',
        definition: 'An excited expectation of what\'s to come — the body readies itself for action.',
        psychiatricInsight: 'Robert Sapolsky\'s dopamine research revealed that anticipation often produces more dopamine than the actual reward. The brain finds "almost having" more neurochemically exciting than "having."',
        somaticDescription: 'Anticipation lifts the body onto its toes with arms ready — the "about to spring" posture of someone who can barely contain their readiness.',
        poseInstruction: 'Rise slightly onto your toes, arms bent at your sides with hands ready, as if about to sprint.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.13 },
          leftShoulder: { x: 0.40, y: 0.26 },
          rightShoulder: { x: 0.60, y: 0.26 },
          leftElbow: { x: 0.32, y: 0.36 },
          rightElbow: { x: 0.68, y: 0.36 },
          leftWrist: { x: 0.35, y: 0.30 },
          rightWrist: { x: 0.65, y: 0.30 },
          leftHip: { x: 0.44, y: 0.50 },
          rightHip: { x: 0.56, y: 0.50 },
          leftKnee: { x: 0.44, y: 0.70 },
          rightKnee: { x: 0.56, y: 0.70 },
          leftAnkle: { x: 0.44, y: 0.88 },
          rightAnkle: { x: 0.56, y: 0.88 },
        },
        ambientDescription: 'Building snare roll with rising synth pads',
      },
      {
        id: 'anticipation-vigilance',
        name: 'Vigilance',
        coreEmotion: 'Anticipation',
        intensity: 'intense',
        definition: 'A state of intense watchfulness — hyper-alert readiness for whatever comes next.',
        psychiatricInsight: 'Vigilance engages the reticular activating system, dramatically increasing sensory processing speed. Stephen Porges\' Polyvagal Theory explains this as the "mobilization without fear" state — aroused but not panicked.',
        somaticDescription: 'Vigilance widens the stance, slightly raises the arms, and scans — the body of a sentinel on high alert, ready to respond in any direction.',
        poseInstruction: 'Take a wide stance, raise your arms slightly to your sides with palms down, hold your head high and alert.',
        difficultyLevel: 2,
        ghostCoordinates: {
          nose: { x: 0.5, y: 0.14 },
          leftShoulder: { x: 0.36, y: 0.28 },
          rightShoulder: { x: 0.64, y: 0.28 },
          leftElbow: { x: 0.22, y: 0.36 },
          rightElbow: { x: 0.78, y: 0.36 },
          leftWrist: { x: 0.15, y: 0.42 },
          rightWrist: { x: 0.85, y: 0.42 },
          ...wideStanceLegs,
        },
        ambientDescription: 'Tense sustained strings with heartbeat pulse',
      },
    ],
  },
];

// ─── Helper utilities ───

export const getAllEmotions = (): Emotion[] =>
  coreEmotions.flatMap((core) => core.emotions);

export const getEmotionById = (id: string): Emotion | undefined =>
  getAllEmotions().find((e) => e.id === id);

export const getCoreEmotionByName = (name: CoreEmotion): CoreEmotionData | undefined =>
  coreEmotions.find((c) => c.name === name);

export const getEmotionColor = (coreEmotion: CoreEmotion): { h: number; s: number; l: number } => {
  const core = getCoreEmotionByName(coreEmotion);
  return core?.color ?? { h: 0, s: 0, l: 50 };
};

export const getEmotionColorHSL = (coreEmotion: CoreEmotion): string => {
  const c = getEmotionColor(coreEmotion);
  return `${c.h} ${c.s}% ${c.l}%`;
};

export const getEmotionColorLightHSL = (coreEmotion: CoreEmotion): string => {
  const c = getEmotionColor(coreEmotion);
  return `${c.h} ${Math.round(c.s * 0.6)}% 92%`;
};

export const getCollectedCountForCore = (
  coreName: CoreEmotion,
  collectedIds: string[]
): number => {
  const core = getCoreEmotionByName(coreName);
  if (!core) return 0;
  return core.emotions.filter((e) => collectedIds.includes(e.id)).length;
};
