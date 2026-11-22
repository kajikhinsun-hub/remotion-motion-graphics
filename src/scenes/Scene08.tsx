import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {HUD} from '../components/HUD';
import {KineticText} from '../components/KineticText';
import {useSafeAudioSpectrum} from '../components/Waveform';
import {PALETTE, TEXT_CONTENT} from '../config';

// Helper generating SVG hexagon points
const hexPoints = (cx: number, cy: number, r: number): string => {
  return Array.from({length: 6})
    .map((_, i) => {
      const a = ((60 * i - 30) * Math.PI) / 180;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
};

/**
 * Scene 08 (21–23.9 detik / ~87 frame):
 * - Sub-adegan A (0–43 frame / ~1.4s): Jaringan heksagonal garis tipis tumbuh + teks oranye bertumpuk.
 * - Hard cut tepat di beat 22.76s (frame ~53 dari scene ini / pertengahan) ke:
 * - Sub-adegan B (44–87 frame / ~1.4s): Ruang wireframe 2D (rak perspektif satu titik) kamera maju + teks oranye bertumpuk.
 * Semua murni 2D SVG/CSS.
 */
export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(16);

  const isPartB = frame >= 44;
  const subFrame = isPartB ? frame - 44 : frame;

  // Hard cut glitch offset around frame 44
  const cutGlitch =
    Math.abs(frame - 44) <= 2 ? (random(`s8-cut-${frame}`) - 0.5) * 44 : 0;
  const exitGlitch =
    frame >= durationInFrames - 2
      ? (random(`s8-end-${frame}`) - 0.5) * 40
      : 0;

  // Hex grid cells for Sub-scene A
  const hexCenters = [
    {x: 540, y: 760},
    {x: 390, y: 675},
    {x: 690, y: 675},
    {x: 390, y: 845},
    {x: 690, y: 845},
    {x: 540, y: 590},
    {x: 540, y: 930},
    {x: 240, y: 760},
    {x: 840, y: 760},
  ];

  // One-point perspective corridor zoom for Sub-scene B
  const corridorZoom = interpolate(subFrame, [0, 43], [1, 1.55], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${cutGlitch + exitGlitch}px)`,
        overflow: 'hidden',
      }}
    >
      {!isPartB ? (
        /* SUB-SCENE A: Growing Thin Hexagonal Network */
        <>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            {hexCenters.map((hc, i) => {
              const pop = spring({
                frame: subFrame - i * 2,
                fps,
                config: {damping: 12, stiffness: 150},
              });
              return (
                <polygon
                  key={i}
                  points={hexPoints(hc.x, hc.y, 95 * pop)}
                  fill="none"
                  stroke={i === 0 ? PALETTE.neonOrange : PALETTE.white}
                  strokeWidth={i === 0 ? 3.5 : 1.5}
                  opacity={0.75}
                />
              );
            })}
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 1120,
              left: 80,
              right: 80,
            }}
          >
            <KineticText
              words={[...TEXT_CONTENT.scene08.subA]}
              startFrame={2}
              staggerFrames={4}
              fontSize={136}
              baseColor={PALETTE.neonOrange}
              accentColor={PALETTE.white}
              accentKeywords={['HEXAGON']}
              glowColor={PALETTE.neonOrange}
              beatPulse={beatPulse}
              layout="stack"
            />
          </div>
        </>
      ) : (
        /* SUB-SCENE B: 2D SVG One-Point Perspective Wireframe Rack Room */
        <>
          <svg
            width={1080}
            height={1920}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `scale(${corridorZoom})`,
              transformOrigin: '540px 820px',
            }}
          >
            {/* Perspective Radial Rack Lines converging to Vanishing Point (540, 820) */}
            {[
              [80, 120],
              [1000, 120],
              [80, 1780],
              [1000, 1780],
              [80, 520],
              [1000, 520],
              [80, 1240],
              [1000, 1240],
              [340, 120],
              [740, 120],
              [340, 1780],
              [740, 1780],
            ].map(([x, y], i) => (
              <line
                key={`ray-${i}`}
                x1={x}
                y1={y}
                x2={540}
                y2={820}
                stroke={PALETTE.neonOrange}
                strokeWidth={1.6}
                opacity={0.55}
              />
            ))}

            {/* Depth Rack Frames */}
            {[0.18, 0.34, 0.52, 0.72, 0.92].map((scale, i) => {
              const w = 880 * scale;
              const h = 1480 * scale;
              return (
                <rect
                  key={`rack-${i}`}
                  x={540 - w / 2}
                  y={820 - h * 0.45}
                  width={w}
                  height={h}
                  fill="none"
                  stroke={i % 2 === 0 ? PALETTE.neonOrange : PALETTE.white}
                  strokeWidth={2}
                  opacity={0.65}
                />
              );
            })}
          </svg>

          <div
            style={{
              position: 'absolute',
              top: 1080,
              left: 80,
              right: 80,
            }}
          >
            <KineticText
              words={[...TEXT_CONTENT.scene08.subB]}
              startFrame={45}
              staggerFrames={4}
              fontSize={138}
              baseColor={PALETTE.neonOrange}
              accentColor={PALETTE.white}
              accentKeywords={['MATRIX']}
              glowColor={PALETTE.neonOrange}
              beatPulse={beatPulse}
              layout="stack"
            />
          </div>
        </>
      )}

      <HUD
        sceneCode={TEXT_CONTENT.scene08.code}
        statusText={isPartB ? 'PERSPECTIVE_VAULT // Z_PUSH' : 'HEX_MESH // EXPANDING'}
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
