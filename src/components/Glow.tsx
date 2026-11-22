import React from 'react';
import {PALETTE} from '../config';

/**
 * Multi-layered Orange / Blue Neon Glow helper & wrapper component
 * Menghasilkan text-shadow / drop-shadow berlapis yang merespons intensitas beat & audio.
 */
export const getGlowShadow = (
  color: string = PALETTE.neonOrange,
  intensity = 1
): string => {
  const r1 = Math.round(12 * intensity);
  const r2 = Math.round(28 * intensity);
  const r3 = Math.round(58 * intensity);
  return `0 0 ${r1}px ${color}, 0 0 ${r2}px ${color}AA, 0 0 ${r3}px ${color}55`;
};

export const getDropGlowFilter = (
  color: string = PALETTE.neonOrange,
  intensity = 1
): string => {
  const r1 = Math.round(8 * intensity);
  const r2 = Math.round(22 * intensity);
  return `drop-shadow(0 0 ${r1}px ${color}) drop-shadow(0 0 ${r2}px ${color}88)`;
};

export const Glow: React.FC<{
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  chromaticOffset?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  color = PALETTE.neonOrange,
  intensity = 1,
  chromaticOffset = 2.5,
  style,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        filter: getDropGlowFilter(color, intensity),
        ...style,
      }}
    >
      {/* Subtle Chromatic Aberration Red/Cyan Fringe Layer */}
      {chromaticOffset > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${chromaticOffset}px, 0px)`,
            opacity: 0.28,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      ) : null}
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};
