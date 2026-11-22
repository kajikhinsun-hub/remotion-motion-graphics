import React from 'react';
import {evolvePath} from '@remotion/paths';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Glow} from '../components/Glow';
import {HUD} from '../components/HUD';
import {KineticText} from '../components/KineticText';
import {useSafeAudioSpectrum} from '../components/Waveform';
import {PALETTE, TEXT_CONTENT} from '../config';

const LINE_ART_PATHS = [
  'M 540 340 L 760 470 L 760 730 L 540 860 L 320 730 L 320 470 Z',
  'M 540 410 L 690 500 L 690 690 L 540 780 L 390 690 L 390 500 Z',
  'M 320 470 L 760 730',
  'M 760 470 L 320 730',
  'M 540 340 L 540 860',
  'M 220 600 L 320 600 M 760 600 L 860 600',
];

/**
 * Scene 03 (6–9 detik): Ilustrasi line-art tergambar stroke-by-stroke (evolvePath),
 * teks muncul per kata.
 */
export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s3-g-${frame}`) - 0.5) * 35
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Stroke-by-Stroke Line-Art Illustration using evolvePath */}
      <Glow color={PALETTE.neonOrange} intensity={1.1 + beatPulse * 0.6}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {LINE_ART_PATHS.map((d, i) => {
            const p = interpolate(frame, [i * 6, 42 + i * 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const evolved = evolvePath(p, d);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i === 0 ? PALETTE.neonOrange : PALETTE.white}
                strokeWidth={i < 2 ? 4 : 2}
                strokeDasharray={evolved.strokeDasharray}
                strokeDashoffset={evolved.strokeDashoffset}
                opacity={i < 2 ? 0.95 : 0.6}
              />
            );
          })}
          {/* Center Pulsing Core Node */}
          <circle
            cx={540}
            cy={600}
            r={22 + beatPulse * 14}
            fill={PALETTE.neonOrange}
          />
        </svg>
      </Glow>

      {/* Word-by-Word Kinetic Typography Stacked Vertically in Lower Center */}
      <div
        style={{
          position: 'absolute',
          top: 980,
          left: 80,
          right: 80,
        }}
      >
        <KineticText
          words={[...TEXT_CONTENT.scene03.words]}
          startFrame={16}
          staggerFrames={9}
          fontSize={138}
          baseColor={PALETTE.white}
          accentColor={PALETTE.neonOrange}
          accentKeywords={['CONSCIOUS', 'ONLINE']}
          glowColor={PALETTE.neonOrange}
          beatPulse={beatPulse}
          layout="stack"
        />
      </div>

      <HUD
        sceneCode={TEXT_CONTENT.scene03.code}
        statusText={TEXT_CONTENT.scene03.caption}
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
