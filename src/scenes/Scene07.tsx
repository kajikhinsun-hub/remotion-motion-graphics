import React from 'react';
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
import {useSafeAudioSpectrum} from '../components/Waveform';
import {FONTS, PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 07 (18–21 detik): Cincin zoom cepat, kotak terminal mengetik teks pendek.
 */
export const Scene07: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  const boxPop = spring({
    frame: frame - 8,
    fps,
    config: {damping: 12, stiffness: 170},
  });

  const typedChars = Math.max(0, Math.floor((frame - 12) * 2.6));
  const fullCmd = TEXT_CONTENT.scene07.terminalText;
  const visibleCmd = fullCmd.slice(0, typedChars);

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s7-g-${frame}`) - 0.5) * 38
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Rapid Zooming Rings */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 8}).map((_, i) => {
          const cycle = ((frame * 3.8 + i * 28) % 220) / 220;
          const radius = interpolate(cycle, [0, 1], [30, 920]);
          const alpha = interpolate(cycle, [0, 0.2, 1], [0, 0.85, 0]);
          return (
            <circle
              key={i}
              cx={540}
              cy={960}
              r={radius}
              fill="none"
              stroke={i % 2 === 0 ? PALETTE.neonOrange : PALETTE.white}
              strokeWidth={interpolate(cycle, [0, 1], [1.5, 8])}
              opacity={alpha}
            />
          );
        })}
      </svg>

      {/* Center Terminal Box */}
      <Glow color={PALETTE.neonOrange} intensity={1.1 + beatPulse * 0.6}>
        <div
          style={{
            width: 860,
            border: `2.5px solid ${PALETTE.neonOrange}`,
            backgroundColor: 'rgba(14, 14, 18, 0.92)',
            transform: `scale(${boxPop * (1 + beatPulse * 0.03)})`,
            padding: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: `1.5px solid ${PALETTE.neonOrange}55`,
              paddingBottom: 16,
              marginBottom: 24,
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: PALETTE.neonOrange,
            }}
          >
            <span>{TEXT_CONTENT.scene07.terminalTitle}</span>
            <span>[PID 9042]</span>
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: FONTS.mono,
              fontSize: 30,
              lineHeight: 1.55,
              color: PALETTE.white,
              whiteSpace: 'pre-wrap',
            }}
          >
            {visibleCmd}
            <span style={{color: PALETTE.neonOrange}}>█</span>
          </pre>
        </div>
      </Glow>

      <HUD
        sceneCode={TEXT_CONTENT.scene07.code}
        statusText="WARP_RINGS // TERMINAL_EXEC"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
