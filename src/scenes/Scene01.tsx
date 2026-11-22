import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Glow, getGlowShadow} from '../components/Glow';
import {HUD} from '../components/HUD';
import { useSafeAudioSpectrum } from '../components/Waveform';
import {FONTS, PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 01 (0–3 detik): Garis cahaya oranye horizontal melesat di atas grid redup.
 */
export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {beatPulse, amplitude} = useSafeAudioSpectrum(16);

  // Horizontal orange laser beam streaks across dim grid
  const mainStreakX = interpolate(frame, [0, 38], [-600, 1280], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: 'clamp',
  });

  const secondStreakX = interpolate(frame, [28, 72], [1300, -400], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const gridPulse = 0.25 + beatPulse * 0.35 + amplitude * 0.15;

  // Quick glitch offset on final 3 frames
  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s1-g-${frame}`) - 0.5) * 36
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Dim Wireframe Grid */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={80 + i * 70}
            y1={80}
            x2={80 + i * 70}
            y2={1840}
            stroke={PALETTE.darkGrid}
            strokeWidth={1.2}
          />
        ))}
        {Array.from({length: 24}).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={80}
            y1={120 + i * 72}
            x2={1000}
            y2={120 + i * 72}
            stroke={PALETTE.darkGrid}
            strokeWidth={1.2}
          />
        ))}

        {/* Illuminated Grid Crosshairs near Center */}
        {Array.from({length: 7}).map((_, i) => (
          <circle
            key={`c-${i}`}
            cx={240 + i * 100}
            cy={960}
            r={4 + beatPulse * 4}
            fill={PALETTE.neonOrange}
            opacity={gridPulse}
          />
        ))}
      </svg>

      {/* Streaking Horizontal Orange Light Beams */}
      <Glow color={PALETTE.neonOrange} intensity={1.3 + beatPulse * 0.8}>
        <div
          style={{
            position: 'absolute',
            top: 956,
            left: 80,
            right: 80,
            height: 4,
            backgroundColor: `${PALETTE.neonOrange}44`,
          }}
        />
        {/* Primary High-Speed Streak */}
        <div
          style={{
            position: 'absolute',
            top: 952,
            left: mainStreakX,
            width: 560,
            height: 12,
            borderRadius: 6,
            background: `linear-gradient(90deg, transparent 0%, ${PALETTE.neonOrange} 55%, ${PALETTE.white} 95%, transparent 100%)`,
          }}
        />
        {/* Secondary Counter-Streak */}
        <div
          style={{
            position: 'absolute',
            top: 910,
            left: secondStreakX,
            width: 420,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(270deg, transparent 0%, ${PALETTE.neonOrange} 60%, ${PALETTE.white} 95%, transparent 100%)`,
          }}
        />
      </Glow>

      {/* Center Minimalist Telemetry Labels */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: 8,
            color: PALETTE.neonOrange,
            marginBottom: 140,
            textShadow: getGlowShadow(PALETTE.neonOrange, 0.9),
          }}
        >
          {TEXT_CONTENT.scene01.topLabel}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            letterSpacing: 5,
            color: PALETTE.gray,
            marginTop: 140,
          }}
        >
          {TEXT_CONTENT.scene01.bottomLabel}
        </div>
      </AbsoluteFill>

      <HUD
        sceneCode={TEXT_CONTENT.scene01.code}
        statusText="GRID_LASER // VELOCITY_MAX"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
