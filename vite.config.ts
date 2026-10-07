import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Workaround for MediaPipe ESM compatibility issue
// https://github.com/google/mediapipe/issues/2546
function mediapipe_workaround(): Plugin {
  return {
    name: "mediapipe_workaround",
    load(id) {
      const MEDIAPIPE_EXPORT_NAMES: Record<string, string[]> = {
        "pose.js": [
          "POSE_CONNECTIONS",
          "POSE_LANDMARKS",
          "POSE_LANDMARKS_LEFT",
          "POSE_LANDMARKS_RIGHT",
          "POSE_LANDMARKS_NEUTRAL",
          "Pose",
          "VERSION",
        ],
        "camera_utils.js": ["Camera"],
        "drawing_utils.js": ["drawConnectors", "drawLandmarks", "lerp"],
      };

      for (const [file, exports] of Object.entries(MEDIAPIPE_EXPORT_NAMES)) {
        if (id.includes(`@mediapipe`) && id.endsWith(file)) {
          let code = fs.readFileSync(id, "utf-8");
          for (const name of exports) {
            // Reference window/globalThis where MediaPipe registers its constructors
            code += `\nexports.${name} = (typeof window !== 'undefined' ? window : globalThis).${name};`;
          }
          return { code, map: null };
        }
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mediapipe_workaround(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
