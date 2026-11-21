import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  COLORS,
  CinematicHUD,
  FONTS,
  ParticleField,
  useSceneEnvelope,
} from '../components/SharedUI';

interface CycleStep {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  color: string;
  startFrame: number;
}

const CYCLE_STEPS: CycleStep[] = [
  {
    id: '01',
    title: 'PENGUAPAN AIR',
    subtitle: 'Radiasi surya mengubah air laut menjadi uap',
    x: 1390,
    y: 775,
    color: COLORS.cyanGlow,
    startFrame: 20,
  },
  {
    id: '02',
    title: 'PEMBENTUKAN AWAN',
    subtitle: 'Kondensasi uap air di atmosfer tinggi',
    x: 1280,
    y: 280,
    color: COLORS.warmWhite,
    startFrame: 70,
  },
  {
    id: '03',
    title: 'TURUNNYA HUJAN',
    subtitle: 'Presipitasi membasahi daratan & pegunungan',
    x: 640,
    y: 280,
    color: '#60a5fa',
    startFrame: 120,
  },
  {
    id: '04',
    title: 'MENGALIR KE SUNGAI & LAUT',
    subtitle: 'Aliran permukaan & akuifer kembali ke samudra',
    x: 530,
    y: 775,
    color: COLORS.earthTone,
    startFrame: 170,
  },
  {
    id: '05',
    title: 'TUMBUHAN MENYERAP AIR',
    subtitle: 'Akar hutan menyerap nutrisi & transpirasi',
    x: 960,
    y: 535,
    color: COLORS.forestLight,
    startFrame: 220,
  },
];

export const Scene5Cycle: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {opacity} = useSceneEnvelope(durationInFrames, 24, 24);

  const headerReveal = spring({
    frame: frame - 10,
    fps,
    config: {damping: 18, stiffness: 85},
  });

  // Overall cycle progress for animated connecting arrows
  const flowDashOffset = -frame * 2.4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.midnightBlack,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Scientific Blueprint Grid Background */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 54%, #091e2e 0%, #050d17 65%, #020509 100%)',
        }}
      />

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, opacity: 0.16}}
      >
        {Array.from({length: 20}).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 100}
            y1={0}
            x2={i * 100}
            y2={1080}
            stroke={COLORS.cyanGlow}
            strokeWidth="0.6"
          />
        ))}
        {Array.from({length: 12}).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 100}
            x2={1920}
            y2={i * 100}
            stroke={COLORS.cyanGlow}
            strokeWidth="0.6"
          />
        ))}
      </svg>

      <ParticleField
        count={45}
        color={COLORS.cyanGlow}
        speedMultiplier={0.45}
        seedOffset={606}
        direction="drift"
      />

      {/* Top Editorial Header */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 140,
          zIndex: 30,
          opacity: headerReveal,
          transform: `translateY(${interpolate(headerReveal, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 14,
            letterSpacing: 5,
            color: COLORS.emeraldAccent,
          }}
        >
          05 // CLOSED-LOOP PLANETARY METABOLISM
        </div>
        <h1
          style={{
            fontFamily: FONTS.heading,
            fontSize: 76,
            fontWeight: 900,
            margin: '4px 0 0 0',
            letterSpacing: 5,
            color: COLORS.warmWhite,
          }}
        >
          SIKLUS KEHIDUPAN &amp; HIDROLOGI
        </h1>
      </div>

      {/* ANIMATED SCIENTIFIC DIAGRAM (SVG Paths, Arrows, Icons & Nodes) */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, zIndex: 15}}
      >
        <defs>
          <marker
            id="arrowCyan"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={COLORS.cyanGlow} />
          </marker>
          <marker
            id="arrowGreen"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={COLORS.forestLight} />
          </marker>
        </defs>

        {/* Outer Orbital Ring Connecting Steps 1 -> 2 -> 3 -> 4 -> 1 */}
        {/* Path 1: Evaporation (Ocean Bottom-Right to Cloud Top-Right) */}
        <path
          d="M 1390 710 C 1490 540, 1450 380, 1345 310"
          fill="none"
          stroke={COLORS.cyanGlow}
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowCyan)"
          opacity={interpolate(frame, [30, 65], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        {/* Path 2: Atmospheric Transport (Cloud Top-Right to Rain Top-Left) */}
        <path
          d="M 1200 280 C 1030 215, 890 215, 720 280"
          fill="none"
          stroke={COLORS.warmWhite}
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowCyan)"
          opacity={interpolate(frame, [80, 115], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        {/* Path 3: Precipitation (Rain Top-Left to River Bottom-Left) */}
        <path
          d="M 580 330 C 470 460, 460 610, 520 710"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowCyan)"
          opacity={interpolate(frame, [130, 165], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        {/* Path 4: River Runoff to Ocean (Bottom-Left to Bottom-Right) */}
        <path
          d="M 610 785 C 860 885, 1080 885, 1310 785"
          fill="none"
          stroke={COLORS.earthTone}
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowCyan)"
          opacity={interpolate(frame, [180, 215], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        {/* Path 5A & 5B: Root Absorption & Forest Transpiration (Center Hub) */}
        <path
          d="M 605 745 C 720 680, 810 610, 895 565"
          fill="none"
          stroke={COLORS.forestLight}
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowGreen)"
          opacity={interpolate(frame, [225, 260], [0, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
        <path
          d="M 1025 495 C 1110 430, 1180 365, 1230 325"
          fill="none"
          stroke={COLORS.forestLight}
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeDashoffset={flowDashOffset}
          markerEnd="url(#arrowGreen)"
          opacity={interpolate(frame, [245, 280], [0, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        {/* Node Icons & Vector Rings */}
        {CYCLE_STEPS.map((step, idx) => {
          const pop = spring({
            frame: frame - step.startFrame,
            fps,
            config: {damping: 15, stiffness: 100},
          });

          return (
            <g
              key={step.id}
              transform={`translate(${step.x}, ${step.y}) scale(${pop})`}
              opacity={pop}
            >
              {/* Outer Glowing Pulse Circle */}
              <circle
                cx="0"
                cy="0"
                r={68 + Math.sin(frame * 0.08 + idx) * 6}
                fill="none"
                stroke={step.color}
                strokeWidth="1.2"
                opacity="0.35"
              />
              {/* Main Node Disk */}
              <circle
                cx="0"
                cy="0"
                r="56"
                fill="rgba(7, 17, 28, 0.9)"
                stroke={step.color}
                strokeWidth="2.5"
              />

              {/* Custom Animated Vector Icon per Step */}
              {idx === 0 && (
                // Evaporation Waves + Upward Vapor
                <g stroke={step.color} strokeWidth="2.5" fill="none">
                  <path d="M-24,16 Q-12,8 0,16 T24,16" />
                  <path d="M-14,4 C-14,-8 -6,-12 -14,-24" />
                  <path d="M0,4 C0,-8 8,-12 0,-24" />
                  <path d="M14,4 C14,-8 22,-12 14,-24" />
                </g>
              )}
              {idx === 1 && (
                // Cloud Formation Icon
                <path
                  d="M-22,12 L18,12 C26,12 30,4 25,-3 C25,-14 13,-20 4,-15 C-3,-24 -19,-20 -21,-8 C-29,-6 -30,8 -22,12 Z"
                  fill="none"
                  stroke={step.color}
                  strokeWidth="2.5"
                />
              )}
              {idx === 2 && (
                // Falling Rain Icon
                <g stroke={step.color} strokeWidth="2.5" fill="none">
                  <path d="M-20,-4 L16,-4 C23,-4 26,-11 20,-16 C18,-25 4,-26 -2,-18 C-10,-23 -22,-17 -20,-4 Z" />
                  <line x1="-12" y1="6" x2="-18" y2="22" />
                  <line x1="2" y1="6" x2="-4" y2="22" />
                  <line x1="16" y1="6" x2="10" y2="22" />
                </g>
              )}
              {idx === 3 && (
                // River & Waves Returning to Sea
                <g stroke={step.color} strokeWidth="2.5" fill="none">
                  <path d="M-26,-10 Q-13,-20 0,-10 T26,-10" />
                  <path d="M-26,4 Q-13,-6 0,4 T26,4" />
                  <path d="M-26,18 Q-13,8 0,18 T26,18" />
                </g>
              )}
              {idx === 4 && (
                // Plant / Tree Root Absorption Icon
                <g stroke={step.color} strokeWidth="2.5" fill="none">
                  <path d="M0,-26 C18,-14 18,6 0,14 C-18,6 -18,-14 0,-26 Z" />
                  <line x1="0" y1="-20" x2="0" y2="26" />
                  <path d="M0,18 L-14,26 M0,20 L14,26" />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* TYPOGRAPHY LABELS FOR EACH OF THE 5 STEPS */}
      {CYCLE_STEPS.map((step, idx) => {
        const reveal = spring({
          frame: frame - (step.startFrame + 8),
          fps,
          config: {damping: 18, stiffness: 85},
        });

        const isLeft = idx === 2 || idx === 3;
        const isCenter = idx === 4;

        const labelLeft = isCenter
          ? step.x - 190
          : isLeft
            ? step.x - 410
            : step.x + 82;
        const labelTop = isCenter ? step.y + 72 : step.y - 36;

        return (
          <div
            key={step.id}
            style={{
              position: 'absolute',
              left: labelLeft,
              top: labelTop,
              width: isCenter ? 380 : 330,
              textAlign: isCenter ? 'center' : isLeft ? 'right' : 'left',
              zIndex: 25,
              opacity: reveal,
              transform: `translateY(${interpolate(reveal, [0, 1], [16, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                color: step.color,
              }}
            >
              FASE {step.id}
            </div>
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 2,
                color: COLORS.warmWhite,
                marginTop: 2,
              }}
            >
              {step.title}
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 16,
                color: COLORS.mutedCream,
                marginTop: 4,
                lineHeight: 1.35,
              }}
            >
              {step.subtitle}
            </div>
          </div>
        );
      })}

      <CinematicHUD
        sceneCode="SCN // 05"
        sceneLabel="HYDROLOGICAL & BIOSPHERE CYCLE"
        coordinates="GLOBAL SYSTEM // EQUILIBRIUM ACTIVE"
        accentColor={COLORS.emeraldAccent}
      />
    </AbsoluteFill>
  );
};
