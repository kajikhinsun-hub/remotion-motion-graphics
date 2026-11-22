import React from 'react';
import {evolvePath} from '@remotion/paths';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Glow} from '../components/Glow';
import {HUD} from '../components/HUD';
import {KineticText} from '../components/KineticText';
import {useSafeAudioSpectrum} from '../components/Waveform';
import {PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 05 (12–15 detik): Terowongan cincin konsentris gaya peta topografi (spring),
 * garis oranye menyusup.
 */
export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  const infiltratePath =
    'M 540 180 C 660 440, 420 680, 540 960 C 660 1240, 460 1480, 540 1740';
  const lineProgress = interpolate(frame, [8, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const evolved = evolvePath(lineProgress, infiltratePath);

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s5-g-${frame}`) - 0.5) * 36
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Topographic Concentric Rings Tunnel */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 11}).map((_, i) => {
          const ringPop = spring({
            frame: frame - i * 3,
            fps,
            config: {damping: 12, stiffness: 120},
          });
          const rx = (90 + i * 42) * ringPop * (1 + beatPulse * 0.04);
          const ry = (130 + i * 62) * ringPop * (1 + beatPulse * 0.04);
          const rot = frame * (i % 2 === 0 ? 0.35 : -0.25) + i * 14;
          return (
            <ellipse
              key={i}
              cx={540}
              cy={960}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={i % 3 === 0 ? PALETTE.neonOrange : PALETTE.gray}
              strokeWidth={i % 3 === 0 ? 3 : 1.4}
              strokeDasharray={i % 2 === 0 ? '24 10' : undefined}
              opacity={0.28 + (1 - i / 11) * 0.55}
              transform={`rotate(${rot} 540 960)`}
            />
          );
        })}

        {/* Infiltrating Glowing Orange Thread */}
        <path
          d={infiltratePath}
          fill="none"
          stroke={PALETTE.neonOrange}
          strokeWidth={6}
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
        />
      </svg>

      {/* Center Vertical Typography */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
        }}
      >
        <Glow color={PALETTE.neonOrange} intensity={1.1 + beatPulse * 0.6}>
          <KineticText
            words={[...TEXT_CONTENT.scene05.words]}
            startFrame={14}
            staggerFrames={6}
            fontSize={132}
            baseColor={PALETTE.white}
            accentColor={PALETTE.neonOrange}
            accentKeywords={['DEEP', 'CORE']}
            glowColor={PALETTE.neonOrange}
            beatPulse={beatPulse}
            layout="stack"
          />
        </Glow>
      </AbsoluteFill>

      <HUD
        sceneCode={TEXT_CONTENT.scene05.code}
        statusText="TOPOGRAPHY_TUNNEL // INFILTRATION"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
