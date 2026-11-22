import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Glow, getGlowShadow} from '../components/Glow';
import {HUD} from '../components/HUD';
import {useSafeAudioSpectrum} from '../components/Waveform';
import {FONTS, PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 06 (15–18 detik): "BOSS" dan "SERVANT" bertumpuk, yang bawah mirror,
 * flip masuk dengan overshoot.
 */
export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  // Overshoot spring flip for BOSS
  const bossFlip = spring({
    frame: frame - 4,
    fps,
    config: {damping: 9, stiffness: 165, mass: 0.9},
  });
  const bossBlur = interpolate(frame - 4, [0, 4], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Overshoot spring flip for mirrored SERVANT
  const servantFlip = spring({
    frame: frame - 18,
    fps,
    config: {damping: 9, stiffness: 165, mass: 0.9},
  });
  const servantBlur = interpolate(frame - 18, [0, 4], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s6-g-${frame}`) - 0.5) * 38
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      {/* Top Word: BOSS */}
      <div
        style={{
          transform: `scaleY(${bossFlip}) scale(${1 + beatPulse * 0.05})`,
          transformOrigin: 'center bottom',
          filter: bossBlur > 0.1 ? `blur(${bossBlur}px)` : undefined,
          fontFamily: FONTS.display,
          fontSize: 235,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: 12,
          color: PALETTE.white,
          textShadow: getGlowShadow(PALETTE.neonOrange, 0.9 + beatPulse * 0.6),
        }}
      >
        {TEXT_CONTENT.scene06.topWord}
      </div>

      {/* Glowing Horizon Mirror Axis Divider */}
      <Glow color={PALETTE.neonOrange} intensity={1.4 + beatPulse * 0.6}>
        <div
          style={{
            width: 820,
            height: 6,
            backgroundColor: PALETTE.neonOrange,
            margin: '18px 0',
          }}
        />
      </Glow>

      {/* Bottom Word: SERVANT (Mirrored vertically with scaleY(-1)) */}
      <div
        style={{
          transform: `scaleY(${-servantFlip}) scale(${1 + beatPulse * 0.05})`,
          transformOrigin: 'center top',
          filter: servantBlur > 0.1 ? `blur(${servantBlur}px)` : undefined,
          fontFamily: FONTS.display,
          fontSize: 215,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: 10,
          color: PALETTE.neonOrange,
          opacity: 0.88,
          textShadow: getGlowShadow(PALETTE.neonOrange, 1.1 + beatPulse * 0.6),
        }}
      >
        {TEXT_CONTENT.scene06.bottomWord}
      </div>

      <div
        style={{
          marginTop: 70,
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: 6,
          color: PALETTE.gray,
        }}
      >
        {TEXT_CONTENT.scene06.caption}
      </div>

      <HUD
        sceneCode={TEXT_CONTENT.scene06.code}
        statusText="MIRROR_AXIS // INVERSION_LOCKED"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
