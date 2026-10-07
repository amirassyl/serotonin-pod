import { useCallback, useEffect, useRef, useState } from 'react';
import { Pose as MediaPipePose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { GhostCoordinates, PoseLandmark } from '@/data/emotions';

export interface DetectedLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseDetectionResult {
  landmarks: DetectedLandmark[] | null;
  isLoading: boolean;
  error: string | null;
}

// MediaPipe landmark indices
const LANDMARK_INDICES = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
};

export const usePoseDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [landmarks, setLandmarks] = useState<DetectedLandmark[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const poseRef = useRef<MediaPipePose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const isInitializedRef = useRef(false);

  const onResults = useCallback((results: Results) => {
    if (results.poseLandmarks) {
      setLandmarks(results.poseLandmarks as DetectedLandmark[]);
    } else {
      setLandmarks(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isActive || !videoRef.current || isInitializedRef.current) return;

    const initPose = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const pose = new MediaPipePose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          },
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults(onResults);
        await pose.initialize();

        poseRef.current = pose;
        isInitializedRef.current = true;

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (poseRef.current && videoRef.current) {
                await poseRef.current.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });

          cameraRef.current = camera;
          camera.start();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize pose detection');
        setIsLoading(false);
      }
    };

    initPose();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
      isInitializedRef.current = false;
    };
  }, [isActive, videoRef, onResults]);

  return { landmarks, isLoading, error };
};

// Calculate alignment score between detected pose and target ghost pose
export const calculateAlignmentScore = (
  detectedLandmarks: DetectedLandmark[] | null,
  ghostCoordinates: GhostCoordinates
): number => {
  if (!detectedLandmarks || detectedLandmarks.length === 0) return 0;

  const keyPoints: (keyof GhostCoordinates)[] = [
    'leftShoulder', 'rightShoulder',
    'leftElbow', 'rightElbow',
    'leftWrist', 'rightWrist',
    'leftHip', 'rightHip',
    'leftKnee', 'rightKnee',
  ];

  let totalScore = 0;
  let validPoints = 0;

  for (const key of keyPoints) {
    const ghostPoint = ghostCoordinates[key];
    const detectedPoint = detectedLandmarks[LANDMARK_INDICES[key]];

    if (detectedPoint && detectedPoint.visibility > 0.5) {
      // Calculate distance (both are normalized 0-1)
      const dx = detectedPoint.x - ghostPoint.x;
      const dy = detectedPoint.y - ghostPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Convert distance to score (closer = higher score)
      // Max reasonable distance is ~0.5 (half the frame)
      const pointScore = Math.max(0, 1 - distance * 2);
      totalScore += pointScore;
      validPoints++;
    }
  }

  if (validPoints === 0) return 0;
  
  // Return as percentage
  return Math.round((totalScore / validPoints) * 100);
};

// Get the color based on alignment score - Wellness palette
export const getSkeletonColor = (score: number): string => {
  if (score >= 80) return '#34C759'; // Sage Green
  if (score >= 50) return '#FFD60A'; // Warm Yellow
  return '#007AFF'; // Sanctuary Blue
};

// Extract key landmarks for drawing
export const extractKeyLandmarks = (
  landmarks: DetectedLandmark[]
): Record<keyof typeof LANDMARK_INDICES, PoseLandmark> => {
  const result: Partial<Record<keyof typeof LANDMARK_INDICES, PoseLandmark>> = {};
  
  for (const [key, index] of Object.entries(LANDMARK_INDICES)) {
    const landmark = landmarks[index];
    if (landmark) {
      result[key as keyof typeof LANDMARK_INDICES] = {
        x: landmark.x,
        y: landmark.y,
        visibility: landmark.visibility,
      };
    }
  }
  
  return result as Record<keyof typeof LANDMARK_INDICES, PoseLandmark>;
};

export { POSE_CONNECTIONS, LANDMARK_INDICES };
