# Serotonin Pod

A browser-based wellness experience prototyped for the [Exploratorium](https://www.exploratorium.edu/) in San Francisco. A visitor names what they are feeling, then is guided through a body pose and a breathing exercise matched to that emotion, with a voice guide and live camera feedback.

**Live prototype:** https://stance-magic.lovable.app (needs camera and microphone access)

## Context

This was the web component of a Minerva University civic project (September 2025 – May 2026), built by a team of five students for the Exploratorium. The brief was a pop-up photobooth outside the museum that helps young adults practise *emotional granularity*: naming a specific emotion instead of a vague one. The full deliverable also included the booth exterior concept, a Figma user flow and a printed takeaway card.

The prototype was delivered to the Exploratorium for internal review. It has not been installed for visitors.

## How it works

1. **Intro** – a field of drifting clouds and a voice guide that welcomes the visitor.
2. **Feeling wheel** – eight core emotions, each opening into three more specific ones (24 in total). The visitor can pick by voice or by tapping.
3. **Pose studio** (all emotions except the Fear family) – the camera tracks the visitor's body and draws a glowing "ghost" mannequin of the target pose next to their own skeleton. The skeleton changes color as the two line up, and a short hold timer fills once the match is close. Each session runs two one-minute poses.
4. **Breathing studio** (the Fear family) – instead of a pose, a pulsing orb paces a two-minute box-breathing exercise while the voice guide talks the visitor through it.

### The technical core

- **Pose tracking:** MediaPipe Pose runs in the browser and returns 33 body landmarks per frame (`src/hooks/usePoseDetection.ts`).
- **Alignment score:** for ten key joints, the distance between the detected landmark and the target pose is turned into a 0–100 score; joints the camera cannot see are skipped (`calculateAlignmentScore`, same file).
- **Voice:** three ElevenLabs conversational agents, one per stage. The agents can call functions in the browser: the intro agent selects the emotion the visitor names, and the pose agent can ask for the live alignment score.
- **Overlay:** both skeletons are drawn with Three.js (React Three Fiber) on a transparent canvas over the video, with smoothing between frames.
- **Session flow:** `src/components/Studio/Studio.tsx` holds the state machine that coordinates camera, voice, timers and the pose swap.

## Stack

TypeScript, React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Three.js with React Three Fiber, MediaPipe Pose, ElevenLabs React SDK, Vitest.

## How it was built

The app was built in [Lovable](https://lovable.dev), an AI app builder: the code was generated and revised through prompts, and I directed the build, tested each iteration in the browser and with the team, and decided what to change next. I am stating this plainly because most of the code in this repository was written by the tool, not typed by hand.

Changes made when publishing this repository: API identifiers moved to environment variables, and unit tests added for the alignment score.

## Run it locally

```sh
npm install
cp .env.example .env   # fill in the ElevenLabs agent IDs
npm run dev
```

Without the ElevenLabs agent IDs the visual flow and pose tracking still work; the voice guide does not.

```sh
npm test        # unit tests for the pose alignment score
npm run build
```

`npm run lint` currently reports errors, mostly in the generated UI component files.

## Limitations

- A prototype: tested by the team, not with museum visitors.
- Pose targets are hand-set coordinates for a front-facing camera; they are not calibrated for body size or distance.
- The voice agents need an ElevenLabs account that is not included here.
- Some earlier experiments remain in the code but are not used by the current flow: a pose gallery, a score dial and a text-based breathing guide (`supabase/functions/meditation-guide`).
