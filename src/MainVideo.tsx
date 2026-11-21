import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS} from './components/SharedUI';
import {SoundscapeTrack, SoundscapeUrls} from './components/SoundscapeTrack';
import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Forest} from './scenes/Scene2Forest';
import {Scene3Ocean} from './scenes/Scene3Ocean';
import {Scene4Mountains} from './scenes/Scene4Mountains';
import {Scene5Cycle} from './scenes/Scene5Cycle';
import {Scene6Closing} from './scenes/Scene6Closing';

export interface MainVideoProps {
  audioUrls?: SoundscapeUrls;
}

/**
 * KEAJAIBAN ALAM SEMESTA — 65-Second (1950 frames @ 30fps) Documentary Motion Graphics
 *
 * Timeline Breakdown (with 15-frame smooth cross-fade overlaps):
 * - Scene 1 (Opening):   0–7s   (Frames 0 – 225)
 * - Scene 2 (Hutan):     7–18s  (Frames 210 – 555)
 * - Scene 3 (Laut):      18–30s (Frames 540 – 915)
 * - Scene 4 (Pegunungan):30–42s (Frames 900 – 1275)
 * - Scene 5 (Siklus):    42–55s (Frames 1260 – 1665)
 * - Scene 6 (Closing):   55–65s (Frames 1650 – 1950)
 */
export const MainVideo: React.FC<MainVideoProps> = ({audioUrls}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.midnightBlack}}>
      {/* Synchronized Multi-Channel Soundscape Slots */}
      <SoundscapeTrack audioUrls={audioUrls} />

      {/* SCENE 1 — OPENING (0–7 detik / 0–225 frames) */}
      <Sequence from={0} durationInFrames={225} name="Scene 1: Opening — Alam">
        <Scene1Opening durationInFrames={225} />
      </Sequence>

      {/* SCENE 2 — HUTAN (7–18 detik / 210–555 frames) */}
      <Sequence
        from={210}
        durationInFrames={345}
        name="Scene 2: Hutan — Paru-Paru Bumi"
      >
        <Scene2Forest durationInFrames={345} />
      </Sequence>

      {/* SCENE 3 — LAUT (18–30 detik / 540–915 frames) */}
      <Sequence from={540} durationInFrames={375} name="Scene 3: Laut — Lautan">
        <Scene3Ocean durationInFrames={375} />
      </Sequence>

      {/* SCENE 4 — PEGUNUNGAN (30–42 detik / 900–1275 frames) */}
      <Sequence
        from={900}
        durationInFrames={375}
        name="Scene 4: Pegunungan — Sumber Kehidupan"
      >
        <Scene4Mountains durationInFrames={375} />
      </Sequence>

      {/* SCENE 5 — SIKLUS KEHIDUPAN (42–55 detik / 1260–1665 frames) */}
      <Sequence
        from={1260}
        durationInFrames={405}
        name="Scene 5: Siklus Kehidupan — Infografik"
      >
        <Scene5Cycle durationInFrames={405} />
      </Sequence>

      {/* SCENE 6 — CLOSING (55–65 detik / 1650–1950 frames) */}
      <Sequence
        from={1650}
        durationInFrames={300}
        name="Scene 6: Closing — Epilog Bumi"
      >
        <Scene6Closing durationInFrames={300} />
      </Sequence>
    </AbsoluteFill>
  );
};
