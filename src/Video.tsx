import React from 'react';
import {noise2D} from '@remotion/noise';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Grain} from './components/Grain';
import {
  PALETTE,
  SCENE_TIMINGS,
  VIDEO_CONFIG,
  getBeatPulse,
  secToFrame,
} from './config';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';

/**
 * Main Vertical 9:16 2D Kinetic Typography Composition (`src/Video.tsx`)
 * - Memenuhi seluruh frame 1080x1920 murni 2D (tanpa laptop/bezel/3D)
 * - Slow dolly/zoom pada seluruh frame (scale 1 -> 1.06) + shake kecil deterministik di tiap beat
 * - Sinkron dengan `public/audio.mp3`
 */
export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const currentTimeSec = frame / fps;
  const beatPulse = getBeatPulse(currentTimeSec);

  // Slow global dolly-in (scale 1.0 -> 1.06 across 1147 frames)
  const globalDolly = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateRight: 'clamp',
  });

  // Deterministic micro camera shake on beat via @remotion/noise
  const shakeX = noise2D('cam-x', frame * 0.45, 0) * 11 * beatPulse;
  const shakeY = noise2D('cam-y', 0, frame * 0.45) * 11 * beatPulse;

  const isLightTheme = currentTimeSec >= SCENE_TIMINGS.scene09.startSec;

  const scenesList = [
    {cfg: SCENE_TIMINGS.scene01, Comp: Scene01},
    {cfg: SCENE_TIMINGS.scene02, Comp: Scene02},
    {cfg: SCENE_TIMINGS.scene03, Comp: Scene03},
    {cfg: SCENE_TIMINGS.scene04, Comp: Scene04},
    {cfg: SCENE_TIMINGS.scene05, Comp: Scene05},
    {cfg: SCENE_TIMINGS.scene06, Comp: Scene06},
    {cfg: SCENE_TIMINGS.scene07, Comp: Scene07},
    {cfg: SCENE_TIMINGS.scene08, Comp: Scene08},
    {cfg: SCENE_TIMINGS.scene09, Comp: Scene09},
    {cfg: SCENE_TIMINGS.scene10, Comp: Scene10},
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isLightTheme ? PALETTE.lightBg : PALETTE.darkBg,
        overflow: 'hidden',
      }}
    >
      {/* Master Audio Track */}
      <Audio src={staticFile(VIDEO_CONFIG.audioFile)} />

      {/* Global Dolly-In & Beat Shake Wrapper */}
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px) scale(${globalDolly.toFixed(4)})`,
          transformOrigin: '50% 50%',
        }}
      >
        {scenesList.map(({cfg, Comp}) => {
          const fromFrame = secToFrame(cfg.startSec, fps);
          const endFrame = secToFrame(cfg.endSec, fps);
          const duration = Math.max(1, endFrame - fromFrame);

          return (
            <Sequence
              key={cfg.id}
              from={fromFrame}
              durationInFrames={duration}
              name={cfg.id}
            >
              <Comp />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Global Deterministic Film Grain, Scanlines, Chromatic Edge & Vignette */}
      <Grain theme={isLightTheme ? 'light' : 'dark'} beatPulse={beatPulse} />
    </AbsoluteFill>
  );
};
