import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const COLORS = {
  midnightBlack: '#05080c',
  deepSpace: '#070d17',
  deepForestGreen: '#092218',
  emeraldAccent: '#2dd4bf',
  forestLight: '#34d399',
  oceanBlue: '#072438',
  deepAbyss: '#03111c',
  cyanGlow: '#38bdf8',
  warmWhite: '#f8F6F0',
  mutedCream: '#cbd5e1',
  earthTone: '#d4a373',
  amberGold: '#f59e0b',
};

export const FONTS = {
  heading: '"Impact", "Bebas Neue", "Oswald", "Arial Narrow", system-ui, sans-serif',
  body: '"Inter", "Helvetica Neue", Roboto, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
};

// Deterministic PRNG based on seed
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
};

// Envelope helper for crossfades & scene transitions
export const useSceneEnvelope = (
  durationInFrames: number,
  fadeInFrames = 24,
  fadeOutFrames = 24
) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  return {opacity, frame};
};

// Minimalist Futuristic Documentary HUD & Letterbox Overlay
export const CinematicHUD: React.FC<{
  sceneCode: string;
  sceneLabel: string;
  coordinates: string;
  accentColor?: string;
}> = ({sceneCode, sceneLabel, coordinates, accentColor = COLORS.emeraldAccent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const hudReveal = spring({
    frame: frame - 8,
    fps,
    config: {damping: 20, stiffness: 90},
  });

  const seconds = Math.floor(frame / fps);
  const framesRem = frame % fps;
  const timecode = `00:00:${String(seconds).padStart(2, '0')}:${String(framesRem).padStart(2, '0')}`;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 50}}>
      {/* Subtle Top & Bottom Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, transparent 58%, rgba(3, 6, 10, 0.72) 100%)',
        }}
      />

      {/* Top Editorial Telemetry Bar */}
      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 64,
          right: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: interpolate(hudReveal, [0, 1], [0, 0.78]),
          transform: `translateY(${interpolate(hudReveal, [0, 1], [-12, 0])}px)`,
          fontFamily: FONTS.mono,
          fontSize: 13,
          letterSpacing: 3,
          color: COLORS.warmWhite,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
              display: 'inline-block',
            }}
          />
          <span style={{color: accentColor, fontWeight: 700}}>{sceneCode}</span>
          <span style={{opacity: 0.4}}>//</span>
          <span style={{opacity: 0.85}}>{sceneLabel}</span>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: 0.75}}>
          <span>{coordinates}</span>
          <span>REC [{timecode}]</span>
        </div>
      </div>

      {/* Corner Crosshairs */}
      {[
        {top: 36, left: 48},
        {top: 36, right: 48},
        {bottom: 36, left: 48},
        {bottom: 36, right: 48},
      ].map((pos, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            ...pos,
            width: 14,
            height: 14,
            borderTop: pos.top !== undefined ? `1.5px solid ${ COLORS.warmWhite }44` : undefined,
            borderBottom:
              pos.bottom !== undefined ? `1.5px solid ${ COLORS.warmWhite }44` : undefined,
            borderLeft: pos.left !== undefined ? `1.5px solid ${ COLORS.warmWhite }44` : undefined,
            borderRight:
              pos.right !== undefined ? `1.5px solid ${ COLORS.warmWhite }44` : undefined,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Deterministic Floating Particle Field
export const ParticleField: React.FC<{
  count?: number;
  color?: string;
  speedMultiplier?: number;
  seedOffset?: number;
  direction?: 'up' | 'drift' | 'float';
}> = ({
  count = 45,
  color = COLORS.warmWhite,
  speedMultiplier = 1,
  seedOffset = 100,
  direction = 'up',
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({length: count}).map((_, i) => {
      const s = seedOffset + i * 17;
      return {
        x: seededRandom(s) * 1920,
        y: seededRandom(s + 1) * 1080,
        size: 1.8 + seededRandom(s + 2) * 4.5,
        speedX: (seededRandom(s + 3) - 0.5) * 0.7 * speedMultiplier,
        speedY:
          direction === 'up'
            ? (-0.35 - seededRandom(s + 4) * 0.85) * speedMultiplier
            : (seededRandom(s + 4) - 0.5) * 0.6 * speedMultiplier,
        baseAlpha: 0.18 + seededRandom(s + 5) * 0.55,
        phase: seededRandom(s + 6) * Math.PI * 2,
      };
    });
  }, [count, seedOffset, speedMultiplier, direction]);

  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
    >
      {particles.map((p, idx) => {
        const curX = (p.x + frame * p.speedX + Math.sin(frame * 0.03 + p.phase) * 18 + 1920) % 1920;
        const curY = (p.y + frame * p.speedY + 1080) % 1080;
        const pulse = 0.65 + 0.35 * Math.sin(frame * 0.06 + p.phase);
        return (
          <circle
            key={idx}
            cx={curX}
            cy={curY}
            r={p.size}
            fill={color}
            opacity={p.baseAlpha * pulse}
          />
        );
      })}
    </svg>
  );
};
