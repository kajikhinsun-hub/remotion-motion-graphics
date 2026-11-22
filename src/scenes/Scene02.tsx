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
import {Glow, getGlowShadow} from '../components/Glow';
import {HUD} from '../components/HUD';
import {useSafeAudioSpectrum} from '../components/Waveform';
import {FONTS, PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 02 (3–6 detik): Teks terminal mengetik; kata besar "AGI" muncul
 * dengan percikan oranye dari garis yang digambar.
 */
export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  // Drawn line path that sparks the "AGI" reveal
  const fusePath = 'M 140 980 L 540 980 L 940 980';
  const lineProgress = interpolate(frame, [0, 18], [0.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const evolved = evolvePath(lineProgress, fusePath);

  // "AGI" hero word spring
  const agiLocal = frame + 4;
  const agiSpring = spring({
    frame: agiLocal,
    fps,
    config: {damping: 10, stiffness: 180},
  });
  const agiBlur = interpolate(frame, [0, 3], [4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Deterministic orange sparks bursting from the drawn line
  const sparks = React.useMemo(() => {
    return Array.from({length: 28}).map((_, i) => {
      const angle = random(`sp-a-${i}`) * Math.PI * 2;
      const speed = 90 + random(`sp-s-${i}`) * 260;
      const size = 3 + random(`sp-r-${i}`) * 6;
      return {angle, speed, size};
    });
  }, []);

  const sparkProgress = interpolate(frame, [0, 38], [0.22, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s2-g-${frame}`) - 0.5) * 40
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Top Terminal Typing Block (Safe Margin 80px) */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 110,
          right: 110,
          padding: 32,
          border: `1.5px solid ${PALETTE.neonOrange}66`,
          backgroundColor: 'rgba(20, 20, 24, 0.85)',
          fontFamily: FONTS.mono,
          fontSize: 24,
          lineHeight: 1.65,
          color: PALETTE.white,
        }}
      >
        {TEXT_CONTENT.scene02.terminalLines.map((line, idx) => {
          const lineStart = idx * 8;
          const charsToShow = Math.max(
            0,
            Math.floor((frame + 14 - lineStart) * 2.4)
          );
          const visibleText = line.slice(0, charsToShow);
          return (
            <div key={idx} style={{color: idx === 2 ? PALETTE.neonOrange : PALETTE.gray}}>
              {visibleText}
              {charsToShow < line.length && charsToShow > 0 ? '█' : ''}
            </div>
          );
        })}
      </div>

      {/* Drawn Fuse Line & Bursting Orange Sparks */}
      <svg
        width={1080}
        height={1920}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <path
          d={fusePath}
          fill="none"
          stroke={PALETTE.neonOrange}
          strokeWidth={5}
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
        />
        {sparkProgress > 0 && sparkProgress < 1
          ? sparks.map((sp, i) => {
              const sx = 540 + Math.cos(sp.angle) * sp.speed * sparkProgress;
              const sy =
                980 +
                Math.sin(sp.angle) * sp.speed * sparkProgress +
                sparkProgress * sparkProgress * 90;
              return (
                <circle
                  key={i}
                  cx={sx}
                  cy={sy}
                  r={sp.size * (1 - sparkProgress)}
                  fill={i % 2 === 0 ? PALETTE.neonOrange : PALETTE.white}
                />
              );
            })
          : null}
      </svg>

      {/* Massive Hero "AGI" Typography */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 120,
        }}
      >
        {agiLocal >= 0 ? (
          <Glow color={PALETTE.neonOrange} intensity={1.3 + beatPulse * 0.7}>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 340,
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: 16,
                color: PALETTE.white,
                transform: `scale(${agiSpring * (1 + beatPulse * 0.06)})`,
                filter: agiBlur > 0.1 ? `blur(${agiBlur}px)` : undefined,
                textShadow: getGlowShadow(PALETTE.neonOrange, 1.2 + beatPulse * 0.6),
              }}
            >
              {TEXT_CONTENT.scene02.heroWord}
            </div>
          </Glow>
        ) : null}

        <div
          style={{
            marginTop: 36,
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: 8,
            color: PALETTE.neonOrange,
            opacity: interpolate(frame, [36, 48], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {TEXT_CONTENT.scene02.subWord}
        </div>
      </AbsoluteFill>

      <HUD
        sceneCode={TEXT_CONTENT.scene02.code}
        statusText="NEURAL_IGNITION // SPARK_ACTIVE"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
