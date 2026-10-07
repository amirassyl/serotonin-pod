import { describe, it, expect, vi } from "vitest";

// MediaPipe ships browser-only bundles; the scoring function under test does not use them.
vi.mock("@mediapipe/pose", () => ({ Pose: class {}, POSE_CONNECTIONS: [] }));
vi.mock("@mediapipe/camera_utils", () => ({ Camera: class {} }));

import { calculateAlignmentScore, getSkeletonColor, LANDMARK_INDICES } from "@/hooks/usePoseDetection";
import type { DetectedLandmark } from "@/hooks/usePoseDetection";
import type { GhostCoordinates } from "@/data/emotions";

const ghost = Object.fromEntries(
  Object.keys(LANDMARK_INDICES).map((key, i) => [key, { x: 0.3 + i * 0.02, y: 0.2 + i * 0.04 }])
) as unknown as GhostCoordinates;

// Build a full 33-landmark MediaPipe frame that sits on the target pose, shifted by (dx, dy).
const frame = (dx = 0, dy = 0, visibility = 1): DetectedLandmark[] => {
  const landmarks: DetectedLandmark[] = Array.from({ length: 33 }, () => ({ x: 0, y: 0, z: 0, visibility: 0 }));
  for (const [key, index] of Object.entries(LANDMARK_INDICES)) {
    const target = ghost[key as keyof GhostCoordinates];
    landmarks[index] = { x: target.x + dx, y: target.y + dy, z: 0, visibility };
  }
  return landmarks;
};

describe("calculateAlignmentScore", () => {
  it("returns 0 when no pose is detected", () => {
    expect(calculateAlignmentScore(null, ghost)).toBe(0);
    expect(calculateAlignmentScore([], ghost)).toBe(0);
  });

  it("returns 100 when the body matches the target pose exactly", () => {
    expect(calculateAlignmentScore(frame(), ghost)).toBe(100);
  });

  it("drops as the body moves away from the target", () => {
    const near = calculateAlignmentScore(frame(0.05, 0), ghost);
    const far = calculateAlignmentScore(frame(0.2, 0), ghost);
    expect(near).toBe(90);
    expect(far).toBe(60);
  });

  it("bottoms out at 0 for a pose half a frame away", () => {
    expect(calculateAlignmentScore(frame(0.5, 0.5), ghost)).toBe(0);
  });

  it("ignores landmarks the camera cannot see", () => {
    expect(calculateAlignmentScore(frame(0, 0, 0.2), ghost)).toBe(0);
  });
});

describe("getSkeletonColor", () => {
  it("maps score bands to the three feedback colors", () => {
    expect(getSkeletonColor(85)).toBe("#34C759");
    expect(getSkeletonColor(60)).toBe("#FFD60A");
    expect(getSkeletonColor(10)).toBe("#007AFF");
  });
});
