import React from 'react';
import {noise2D} from '@remotion/noise';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Deterministic Film Grain, Fine Scanlines & Vignette Overlay (`src/components/Grain.tsx`)
 * Menggunakan @remotion/noise agar 100% deterministik di setiap frame.
 */
export const Grain: React.FC<{
  theme?: 'dark' | 'light';
  beatPulse?: number;
}> = ({theme = 'dark', beatPulse = 0}) => {
  const frame = useCurrentFrame();

  // Deterministic grain jitter offset via @remotion/noise
  const gx = noise2D('grain-x', frame * 0.35, 0) * 40;
  const gy = noise2D('grain-y', 0, frame * 0.35) * 40;

  // RGB Chromatic Aberration edge bars pulsing on beat
  const rgbShift = 2 + beatPulse * 3.5;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 90}}>
      {/* 1. Fine Horizontal CRT/Monitor Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            theme === 'dark'
              ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 4px)'
              : 'repeating-linear-gradient(0deg, rgba(27,42,107,0.045) 0px, rgba(27,42,107,0.045) 2px, transparent 2px, transparent 4px)',
          opacity: 0.7,
        }}
      />

      {/* 2. Deterministic SVG Turbulence Film Grain */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: theme === 'dark' ? 0.08 : 0.045,
          transform: `translate(${gx}px, ${gy}px) scale(1.08)`,
        }}
      >
        <filter id="deterministicGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={2}
            seed={(frame % 30) + 1}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#deterministicGrain)" />
      </svg>

      {/* 3. Subtle Chromatic Aberration Edge Frame (RGB 2-3px offset) */}
      <div
        style={{
          position: 'absolute',
          inset: 14,
          borderLeft: `${rgbShift}px solid rgba(255, 60, 40, 0.16)`,
          borderRight: `${rgbShift}px solid rgba(56, 189, 248, 0.16)`,
          pointerEvents: 'none',
        }}
      />

      {/* 4. Smooth Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            theme === 'dark'
              ? 'radial-gradient(circle at 50% 50%, transparent 56%, rgba(0, 0, 0, 0.78) 100%)'
              : 'radial-gradient(circle at 50% 45%, transparent 62%, rgba(27, 42, 107, 0.22) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
