import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GhostCoordinates, CoreEmotion } from '@/data/emotions';
import { DetectedLandmark, LANDMARK_INDICES } from '@/hooks/usePoseDetection';

interface MannequinOverlayProps {
  landmarks: DetectedLandmark[] | null;
  ghostCoordinates: GhostCoordinates;
  alignmentScore: number;
  coreEmotion: CoreEmotion;
  emotionColor: { h: number; s: number; l: number };
  width: number;
  height: number;
}

// Connections between joints
const SKELETON_CONNECTIONS: [keyof typeof LANDMARK_INDICES, keyof typeof LANDMARK_INDICES][] = [
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
];

// Larger joints for torso emphasis
const TORSO_JOINTS = new Set(['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip']);
const HEAD_JOINT = 'nose';

const LAVENDER = new THREE.Color('#e6e6fa');
const MINT_GREEN = new THREE.Color('#4ade80');

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Convert normalized coordinates to orthographic 3D space
function toWorld(nx: number, ny: number, w: number, h: number): [number, number, number] {
  // Mirror X (camera is mirrored), map to centered orthographic space
  const x = (1 - nx) * w - w / 2;
  const y = -(ny * h - h / 2); // Flip Y for Three.js
  return [x, y, 0];
}

// ─── Ghost Mannequin (target pose, bright) ───────────────────────

interface GhostMannequinProps {
  ghostCoordinates: GhostCoordinates;
  alignmentScore: number;
  width: number;
  height: number;
}

function GhostMannequin({ ghostCoordinates, alignmentScore, width, height }: GhostMannequinProps) {
  const lerpedRef = useRef<Record<string, THREE.Vector3>>({});
  const colorRef = useRef(LAVENDER.clone());
  const materialRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const limbMaterialRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  // Initialize lerped positions
  const jointKeys = useMemo(() => Object.keys(ghostCoordinates) as (keyof GhostCoordinates)[], [ghostCoordinates]);

  // Refs for mesh objects
  const jointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const limbGroupRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    // Compute target color
    const colorT = alignmentScore >= 80 ? 1 : alignmentScore >= 70 ? (alignmentScore - 70) / 10 : 0;
    const targetColor = LAVENDER.clone().lerp(MINT_GREEN, colorT);
    colorRef.current.lerp(targetColor, 0.08);

    // Lerp ghost positions
    for (const key of jointKeys) {
      const ghost = ghostCoordinates[key];
      const [tx, ty, tz] = toWorld(ghost.x, ghost.y, width, height);

      if (!lerpedRef.current[key]) {
        lerpedRef.current[key] = new THREE.Vector3(tx, ty, tz);
      } else {
        const v = lerpedRef.current[key];
        v.x = lerp(v.x, tx, 0.05);
        v.y = lerp(v.y, ty, 0.05);
        v.z = lerp(v.z, tz, 0.05);
      }
    }

    // Update joint positions and materials
    jointKeys.forEach((key, i) => {
      const mesh = jointMeshRefs.current[i];
      const pos = lerpedRef.current[key];
      if (mesh && pos) {
        mesh.position.set(pos.x, pos.y, pos.z);
      }
    });

    // Update materials color
    materialRefs.current.forEach((mat) => {
      if (mat) {
        mat.emissive.copy(colorRef.current);
        mat.color.copy(colorRef.current);
      }
    });
    limbMaterialRefs.current.forEach((mat) => {
      if (mat) {
        mat.emissive.copy(colorRef.current);
        mat.color.copy(colorRef.current);
      }
    });

    // Update limb positions (cylinder between two joints)
    SKELETON_CONNECTIONS.forEach(([startKey, endKey], i) => {
      const group = limbGroupRefs.current[i];
      const p1 = lerpedRef.current[startKey];
      const p2 = lerpedRef.current[endKey];
      if (!group || !p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const length = dir.length();

      group.position.copy(mid);
      group.scale.set(1, length, 1);

      // Orient cylinder along the direction
      if (length > 0.001) {
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
        group.quaternion.copy(quat);
      }
    });
  });

  return (
    <group>
      {/* Joints */}
      {jointKeys.map((key, i) => {
        const isHead = key === HEAD_JOINT;
        const isTorso = TORSO_JOINTS.has(key);
        const radius = isHead ? 18 : isTorso ? 8 : 6;

        return (
          <mesh
            key={`ghost-joint-${key}`}
            ref={(el) => { jointMeshRefs.current[i] = el; }}
          >
            <sphereGeometry args={[radius, 16, 16]} />
            <meshStandardMaterial
              ref={(el) => {
                if (el) materialRefs.current[i] = el;
              }}
              color={LAVENDER}
              emissive={LAVENDER}
              emissiveIntensity={0.8}
              transparent
              opacity={isHead ? 0.6 : 0.9}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Limbs */}
      {SKELETON_CONNECTIONS.map(([startKey, endKey], i) => (
        <group
          key={`ghost-limb-${startKey}-${endKey}`}
          ref={(el) => { limbGroupRefs.current[i] = el; }}
        >
          <mesh>
            <cylinderGeometry args={[3, 3, 1, 8, 1]} />
            <meshStandardMaterial
              ref={(el) => {
                if (el) limbMaterialRefs.current[i] = el;
              }}
              color={LAVENDER}
              emissive={LAVENDER}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── User Mannequin (detected pose, subtle) ──────────────────────

interface UserMannequinProps {
  landmarks: DetectedLandmark[] | null;
  alignmentScore: number;
  width: number;
  height: number;
}

function UserMannequin({ landmarks, alignmentScore, width, height }: UserMannequinProps) {
  const lerpedRef = useRef<Record<string, THREE.Vector3>>({});
  const visibilityRef = useRef<Record<string, number>>({});
  const colorRef = useRef(LAVENDER.clone());
  const jointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const limbGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const materialRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const limbMaterialRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  const jointKeys = useMemo(
    () => Object.keys(LANDMARK_INDICES) as (keyof typeof LANDMARK_INDICES)[],
    []
  );

  useFrame(() => {
    if (!landmarks || landmarks.length === 0) return;

    // Color
    const colorT = alignmentScore >= 80 ? 1 : alignmentScore >= 70 ? (alignmentScore - 70) / 10 : 0;
    const targetColor = LAVENDER.clone().lerp(MINT_GREEN, colorT);
    colorRef.current.lerp(targetColor, 0.08);

    // Lerp user positions
    for (const key of jointKeys) {
      const idx = LANDMARK_INDICES[key];
      const lm = landmarks[idx];
      if (!lm || lm.visibility <= 0.5) {
        visibilityRef.current[key] = 0;
        continue;
      }
      visibilityRef.current[key] = 1;

      const [tx, ty, tz] = toWorld(lm.x, lm.y, width, height);
      if (!lerpedRef.current[key]) {
        lerpedRef.current[key] = new THREE.Vector3(tx, ty, tz);
      } else {
        const v = lerpedRef.current[key];
        v.x = lerp(v.x, tx, 0.15);
        v.y = lerp(v.y, ty, 0.15);
        v.z = lerp(v.z, tz, 0.15);
      }
    }

    // Update joint meshes
    jointKeys.forEach((key, i) => {
      const mesh = jointMeshRefs.current[i];
      const pos = lerpedRef.current[key];
      const vis = visibilityRef.current[key] || 0;
      if (mesh) {
        if (pos && vis > 0) {
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }
      }
    });

    materialRefs.current.forEach((mat) => {
      if (mat) {
        mat.emissive.copy(colorRef.current);
        mat.color.copy(colorRef.current);
      }
    });
    limbMaterialRefs.current.forEach((mat) => {
      if (mat) {
        mat.emissive.copy(colorRef.current);
        mat.color.copy(colorRef.current);
      }
    });

    // Limbs
    SKELETON_CONNECTIONS.forEach(([startKey, endKey], i) => {
      const group = limbGroupRefs.current[i];
      const p1 = lerpedRef.current[startKey];
      const p2 = lerpedRef.current[endKey];
      const v1 = visibilityRef.current[startKey] || 0;
      const v2 = visibilityRef.current[endKey] || 0;

      if (!group) return;
      if (!p1 || !p2 || v1 === 0 || v2 === 0) {
        group.visible = false;
        return;
      }
      group.visible = true;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const length = dir.length();

      group.position.copy(mid);
      group.scale.set(1, length, 1);

      if (length > 0.001) {
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
        group.quaternion.copy(quat);
      }
    });
  });

  return (
    <group>
      {jointKeys.map((key, i) => {
        const isHead = key === 'nose';
        const radius = isHead ? 10 : 4;
        return (
          <mesh
            key={`user-joint-${key}`}
            ref={(el) => { jointMeshRefs.current[i] = el; }}
            visible={false}
          >
            <sphereGeometry args={[radius, 12, 12]} />
            <meshStandardMaterial
              ref={(el) => { if (el) materialRefs.current[i] = el; }}
              color={LAVENDER}
              emissive={LAVENDER}
              emissiveIntensity={0.3}
              transparent
              opacity={0.25}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {SKELETON_CONNECTIONS.map(([startKey, endKey], i) => (
        <group
          key={`user-limb-${startKey}-${endKey}`}
          ref={(el) => { limbGroupRefs.current[i] = el; }}
          visible={false}
        >
          <mesh>
            <cylinderGeometry args={[2, 2, 1, 6, 1]} />
            <meshStandardMaterial
              ref={(el) => { if (el) limbMaterialRefs.current[i] = el; }}
              color={LAVENDER}
              emissive={LAVENDER}
              emissiveIntensity={0.2}
              transparent
              opacity={0.15}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Main Overlay ────────────────────────────────────────────────

const MannequinOverlay = ({
  landmarks,
  ghostCoordinates,
  alignmentScore,
  coreEmotion,
  emotionColor,
  width,
  height,
}: MannequinOverlayProps) => {
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        orthographic
        camera={{
          left: -halfW,
          right: halfW,
          top: halfH,
          bottom: -halfH,
          near: -100,
          far: 100,
          position: [0, 0, 50],
        }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.1} />

        <GhostMannequin
          ghostCoordinates={ghostCoordinates}
          alignmentScore={alignmentScore}
          width={width}
          height={height}
        />

        <UserMannequin
          landmarks={landmarks}
          alignmentScore={alignmentScore}
          width={width}
          height={height}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default MannequinOverlay;
