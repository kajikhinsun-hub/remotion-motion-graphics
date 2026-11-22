import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONTS, PALETTE} from '../config';
import {getGlowShadow} from './Glow';

/**
 * Word-by-Word Kinetic Typography Component (`src/components/KineticText.tsx`)
 * - Masuk per kata menggunakan `spring()` dengan overshoot kecil
 * - Efek blur-to-sharp selama 4 frame saat kata muncul
 * - Pulse scale & glow mengikuti beat
 * - Mendukung highlight warna emas/oranye pada kata kunci
 */
export const KineticText: React.FC<{
  words: string[];
  startFrame?: number;
  staggerFrames?: number;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  baseColor?: string;
  accentColor?: string;
  accentKeywords?: string[];
  glowColor?: string;
  beatPulse?: number;
  layout?: 'stack' | 'wrap';
  align?: 'center' | 'left';
  chromaticAberration?: boolean;
}> = ({
  words,
  startFrame = 0,
  staggerFrames = 4,
  fontSize = 112,
  lineHeight = 0.96,
  fontFamily = FONTS.display,
  baseColor = PALETTE.white,
  accentColor = PALETTE.neonOrange,
  accentKeywords = [],
  glowColor,
  beatPulse = 0,
  layout = 'stack',
  align = 'center',
  chromaticAberration = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'stack' ? 'column' : 'row',
        flexWrap: layout === 'wrap' ? 'wrap' : 'nowrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: layout === 'stack' ? 8 : '12px 22px',
        width: '100%',
        textAlign: align,
      }}
    >
      {words.map((word, idx) => {
        const wordStart = startFrame + idx * staggerFrames;
        const localFrame = frame - wordStart;

        // Spring with slight overshoot (damping: 11, stiffness: 170)
        const pop = spring({
          frame: localFrame,
          fps,
          config: {damping: 11, stiffness: 170, mass: 0.85},
        });

        // 4-frame blur-to-sharp entrance
        const blurPx = interpolate(localFrame, [0, 4], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const opacity = interpolate(localFrame, [0, 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const isKeyword = accentKeywords.includes(word.toUpperCase());
        const wordColor = isKeyword ? accentColor : baseColor;
        const activeGlow =
          glowColor ?? (isKeyword ? accentColor : undefined);

        const beatScale = 1 + beatPulse * (isKeyword ? 0.065 : 0.03);
        const yOffset = interpolate(pop, [0, 1], [42, 0]);

        return (
          <div
            key={`${word}-${idx}`}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity,
              transform: `translateY(${yOffset}px) scale(${pop * beatScale})`,
              filter: blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
              fontFamily,
              fontSize,
              fontWeight: 900,
              lineHeight,
              letterSpacing: 3,
              color: wordColor,
              textShadow: activeGlow
                ? getGlowShadow(activeGlow, 0.85 + beatPulse * 0.6)
                : undefined,
            }}
          >
            {/* Subtle RGB Chromatic Aberration (2.5px offset) */}
            {chromaticAberration ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    left: -2.5,
                    top: 0,
                    color: '#FF3B30',
                    opacity: 0.34,
                    pointerEvents: 'none',
                  }}
                >
                  {word}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: 2.5,
                    top: 0,
                    color: '#38BDF8',
                    opacity: 0.34,
                    pointerEvents: 'none',
                  }}
                >
                  {word}
                </span>
              </>
            ) : null}
            <span style={{position: 'relative'}}>{word}</span>
          </div>
        );
      })}
    </div>
  );
};
