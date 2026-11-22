import React from 'react';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PALETTE, VIDEO_CONFIG, getBeatPulse} from '../config';
import {getDropGlowFilter} from './Glow';

/**
 * Audio Data & Spectrum Hook + Waveform Component (`src/components/Waveform.tsx`)
 * Menggunakan `useAudioData` dan `visualizeAudio` dari `@remotion/media-utils`,
 * dilengkapi fallback deterministik yang aman jika audio belum dimuat.
 */
export const useSafeAudioSpectrum = (numberOfSamples = 32) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audioSrc = staticFile(VIDEO_CONFIG.audioFile);
  const audioData = useAudioData(audioSrc);
  const currentTimeSec = frame / fps;
  const beatPulse = getBeatPulse(currentTimeSec);

  if (audioData) {
    try {
      const spectrum = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples,
      });
      const avgAmplitude =
        spectrum.reduce((acc, v) => acc + v, 0) / spectrum.length;
      return {
        spectrum,
        amplitude: Math.min(1, avgAmplitude * 2.4 + beatPulse * 0.35),
        beatPulse,
      };
    } catch {
      // Fallback below if frame out of bounds
    }
  }

  // Safe deterministic fallback if audio is unavailable
  const fallbackSpectrum = Array.from({length: numberOfSamples}).map((_, i) => {
    const wave1 = Math.abs(Math.sin(frame * 0.22 + i * 0.38));
    const wave2 = Math.abs(Math.cos(frame * 0.15 - i * 0.24));
    return Math.min(1, (wave1 * 0.45 + wave2 * 0.3 + beatPulse * 0.55));
  });

  return {
    spectrum: fallbackSpectrum,
    amplitude: Math.min(1, 0.35 + beatPulse * 0.65),
    beatPulse,
  };
};

export const Waveform: React.FC<{
  mode?: 'line' | 'bars';
  color?: string;
  secondaryColor?: string;
  width?: number;
  height?: number;
  barCount?: number;
  glow?: boolean;
}> = ({
  mode = 'bars',
  color = PALETTE.electricBlue,
  secondaryColor = PALETTE.goldAccent,
  width = 920,
  height = 360,
  barCount = 32,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const {spectrum, beatPulse} = useSafeAudioSpectrum(barCount);

  if (mode === 'line') {
    const pointsCount = 64;
    const stepX = width / (pointsCount - 1);
    const midY = height / 2;

    const buildWavePath = (phaseOffset: number, ampScale: number) => {
      const pts: string[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const specIdx = i % spectrum.length;
        const env = Math.sin((i / (pointsCount - 1)) * Math.PI); // taper ends
        const rawAmp = spectrum[specIdx] * 1.4 + beatPulse * 0.45;
        const y =
          midY +
          Math.sin(frame * 0.18 + i * 0.32 + phaseOffset) *
            (height * 0.42) *
            env *
            rawAmp *
            ampScale;
        const x = i * stepX;
        pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      return pts.join(' ');
    };

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          filter: glow ? getDropGlowFilter(color, 1 + beatPulse * 0.8) : undefined,
          overflow: 'visible',
        }}
      >
        <path
          d={buildWavePath(1.2, 0.65)}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={3}
          opacity={0.45}
        />
        <path
          d={buildWavePath(0, 1.0)}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d={buildWavePath(2.4, 0.8)}
          fill="none"
          stroke={PALETTE.white}
          strokeWidth={2}
          opacity={0.75}
        />
      </svg>
    );
  }

  // Symmetric Bars Mode (Ideal behind character in Scene 10)
  const totalBars = barCount;
  const barGap = 8;
  const barWidth = (width - (totalBars - 1) * barGap) / totalBars;
  const midY = height / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        filter: glow ? getDropGlowFilter(color, 0.85 + beatPulse * 0.5) : undefined,
        overflow: 'visible',
      }}
    >
      {Array.from({length: totalBars}).map((_, i) => {
        // Mirror index from center so center behind character bursts symmetrically
        const distFromCenter = Math.abs(i - (totalBars - 1) / 2);
        const specIdx = Math.floor(distFromCenter) % spectrum.length;
        const val = spectrum[specIdx];
        const taper = 1 - (distFromCenter / (totalBars / 2)) * 0.45;
        const barH = Math.max(
          18,
          Math.min(height, (val * height * 1.15 + beatPulse * 95 + 28) * taper)
        );
        const x = i * (barWidth + barGap);
        const isGoldAccent = i % 5 === 0;

        return (
          <g key={i}>
            <rect
              x={x}
              y={midY - barH / 2}
              width={barWidth}
              height={barH}
              rx={barWidth / 2}
              fill={isGoldAccent ? secondaryColor : color}
              opacity={isGoldAccent ? 0.88 : 0.72}
            />
          </g>
        );
      })}
    </svg>
  );
};
