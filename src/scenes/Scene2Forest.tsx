import React from 'react';
import {
  AbsoluteFill,
  Easing,
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

export const Scene2Forest: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {opacity} = useSceneEnvelope(durationInFrames, 24, 24);

  // Slow push-in camera through tropical canopy
  const cameraPush = interpolate(frame, [0, durationInFrames], [1, 1.18], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // Parallax shifts for 3 depth layers of trees
  const bgParallaxX = interpolate(frame, [0, durationInFrames], [0, -18]);
  const midParallaxX = interpolate(frame, [0, durationInFrames], [0, -45]);
  const fgParallaxX = interpolate(frame, [0, durationInFrames], [0, -90]);

  // Typography & Infographic springs
  const titleReveal = spring({
    frame: frame - 20,
    fps,
    config: {damping: 18, stiffness: 85},
  });

  const bodyReveal = spring({
    frame: frame - 36,
    fps,
    config: {damping: 20, stiffness: 80},
  });

  const infoReveal = spring({
    frame: frame - 65,
    fps,
    config: {damping: 18, stiffness: 75},
  });

  const metricCounterProgress = interpolate(frame, [70, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const o2Value = (metricCounterProgress * 28.4).toFixed(1);
  const co2Value = (metricCounterProgress * 2.6).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04120c',
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Deep Tropical Forest Atmosphere Gradient */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, #0b2e1f 0%, #071f15 52%, #030e09 100%)',
        }}
      />

      {/* Volumetric Sunbeams / God Rays piercing canopy */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          opacity: 0.58,
        }}
      >
        <defs>
          <linearGradient id="godRay" x1="0%" y1="0%" x2="35%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          {x1: 280, x2: 720, w: 260, phase: 0},
          {x1: 620, x2: 1120, w: 340, phase: 1.5},
          {x1: 980, x2: 1520, w: 240, phase: 3.1},
          {x1: 1280, x2: 1820, w: 290, phase: 4.4},
        ].map((ray, i) => {
          const rayPulse = 0.65 + 0.35 * Math.sin(frame * 0.025 + ray.phase);
          return (
            <polygon
              key={i}
              points={`${ray.x1},0 ${ray.x1 + ray.w},0 ${ray.x2 + ray.w * 1.6},1080 ${ray.x2},1080`}
              fill="url(#godRay)"
              opacity={rayPulse}
            />
          );
        })}
      </svg>

      {/* LAYER 1 (Background): Distant Misty Rainforest Trunks */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraPush * 0.96}) translateX(${bgParallaxX}px)`,
          opacity: 0.45,
        }}
      >
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {[140, 390, 680, 960, 1270, 1560, 1790].map((x, idx) => (
            <g key={idx}>
              <rect
                x={x}
                y={0}
                width={38 + (idx % 3) * 14}
                height={1080}
                fill="#0d3b28"
              />
              <circle
                cx={x + 20}
                cy={110 + (idx % 2) * 70}
                r={180}
                fill="#0f442e"
                opacity="0.7"
              />
            </g>
          ))}
        </svg>
      </AbsoluteFill>

      {/* LAYER 2 (Midground): Tall Tropical Trees & Hanging Vines */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraPush * 1.03}) translateX(${midParallaxX}px)`,
        }}
      >
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {[80, 520, 1080, 1460, 1820].map((x, idx) => (
            <g key={idx}>
              <path
                d={`M${x},1080 C${x + 15},700 ${x - 10},350 ${x + 8},0 L${x + 86},0 C${x + 72},350 ${x + 95},700 ${x + 110},1080 Z`}
                fill="#062116"
              />
              {/* Tropical Canopy Foliage Clusters */}
              <circle
                cx={x + 45}
                cy={80}
                r={210}
                fill="#082b1d"
                opacity="0.92"
              />
            </g>
          ))}
          {/* Ground Ferns & Undergrowth */}
          <path
            d="M0,1080 L0,930 Q240,860 480,940 T960,920 T1440,950 T1920,910 L1920,1080 Z"
            fill="#041910"
          />
        </svg>
      </AbsoluteFill>

      {/* Floating Bio-Luminescent Spores & Pollen */}
      <ParticleField
        count={65}
        color={COLORS.forestLight}
        speedMultiplier={0.65}
        seedOffset={202}
        direction="up"
      />
      <ParticleField
        count={35}
        color="#fde68a"
        speedMultiplier={0.45}
        seedOffset={303}
        direction="drift"
      />

      {/* LAYER 3 (Foreground): Close Silhouette Framing Foliage (2.5D Depth) */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraPush * 1.12}) translateX(${fgParallaxX}px)`,
          pointerEvents: 'none',
        }}
      >
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Left Foreground Giant Trunk */}
          <path
            d="M-60,1080 C-10,680 -30,300 20,0 L170,0 C120,340 140,720 210,1080 Z"
            fill="#020b07"
          />
          {/* Right Foreground Giant Trunk */}
          <path
            d="M1780,1080 C1810,700 1790,340 1830,0 L1980,0 L1980,1080 Z"
            fill="#020b07"
          />
        </svg>
      </AbsoluteFill>

      {/* EDITORIAL TYPOGRAPHY (Left Column) */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 165,
          maxWidth: 780,
          zIndex: 25,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            letterSpacing: 5,
            color: COLORS.forestLight,
            marginBottom: 14,
            opacity: titleReveal,
          }}
        >
          02 // TERRESTRIAL BIOME & PHOTOSYNTHESIS
        </div>

        <div style={{overflow: 'hidden'}}>
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 118,
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.95,
              letterSpacing: 6,
              color: COLORS.warmWhite,
              transform: `translateY(${interpolate(titleReveal, [0, 1], [120, 0])}px)`,
              textShadow: '0 18px 45px rgba(0,0,0,0.75)',
            }}
          >
            PARU-PARU BUMI
          </h1>
        </div>

        <div
          style={{
            width: interpolate(titleReveal, [0, 1], [0, 240]),
            height: 4,
            backgroundColor: COLORS.forestLight,
            marginTop: 24,
            marginBottom: 24,
            boxShadow: `0 0 16px ${COLORS.forestLight}`,
          }}
        />

        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.mutedCream,
            margin: 0,
            lineHeight: 1.4,
            opacity: bodyReveal,
            transform: `translateY(${interpolate(bodyReveal, [0, 1], [24, 0])}px)`,
          }}
        >
          Ekosistem yang menopang kehidupan.
        </p>
      </div>

      {/* SCIENTIFIC INFOGRAPHIC OVERLAY (Right Side — O2 & CO2 Exchange Diagram) */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          right: 150,
          width: 680,
          height: 640,
          zIndex: 25,
          opacity: infoReveal,
          transform: `translateX(${interpolate(infoReveal, [0, 1], [50, 0])}px)`,
        }}
      >
        <svg width={680} height={640} viewBox="0 0 680 640">
          {/* Botanical Leaf / Canopy Wireframe Node */}
          <circle
            cx="340"
            cy="310"
            r="145"
            fill="rgba(9, 34, 24, 0.55)"
            stroke={COLORS.forestLight}
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <circle
            cx="340"
            cy="310"
            r={145 + Math.sin(frame * 0.08) * 10}
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="1"
            opacity="0.35"
          />

          {/* Stylised Leaf Vector Inside Node */}
          <path
            d="M340,210 C395,235 415,305 340,410 C265,305 285,235 340,210 Z"
            fill="rgba(52, 211, 153, 0.18)"
            stroke={COLORS.forestLight}
            strokeWidth="2.5"
          />
          <line
            x1="340"
            y1="215"
            x2="340"
            y2="410"
            stroke={COLORS.forestLight}
            strokeWidth="2"
          />

          {/* Incoming CO2 Flow Line (Top Left to Center) */}
          <path
            d="M70,130 L210,130 L265,220"
            fill="none"
            stroke={COLORS.earthTone}
            strokeWidth="2"
            strokeDasharray="300"
            strokeDashoffset={interpolate(infoReveal, [0, 1], [300, 0])}
          />
          <circle cx="70" cy="130" r="5" fill={COLORS.earthTone} />
          <circle cx="265" cy="220" r="4" fill={COLORS.earthTone} />

          {/* Outgoing O2 Flow Line (Center to Bottom Right) */}
          <path
            d="M415,390 L475,490 L620,490"
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="2.5"
            strokeDasharray="320"
            strokeDashoffset={interpolate(infoReveal, [0, 1], [320, 0])}
          />
          <circle cx="415" cy="390" r="5" fill={COLORS.emeraldAccent} />
          <circle cx="620" cy="490" r="6" fill={COLORS.emeraldAccent} />
        </svg>

        {/* CO2 Absorption Telemetry Callout */}
        <div
          style={{
            position: 'absolute',
            top: 38,
            left: 40,
            fontFamily: FONTS.mono,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              color: COLORS.earthTone,
              marginBottom: 4,
            }}
          >
            SERAPAN KARBON DIOKSIDA (CO₂)
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.warmWhite,
            }}
          >
            -{co2Value}{' '}
            <span style={{fontSize: 18, fontWeight: 400, opacity: 0.8}}>
              Gt / TAHUN
            </span>
          </div>
        </div>

        {/* O2 Production Telemetry Callout */}
        <div
          style={{
            position: 'absolute',
            bottom: 78,
            right: 45,
            textAlign: 'right',
            fontFamily: FONTS.mono,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              color: COLORS.emeraldAccent,
              marginBottom: 4,
            }}
          >
            PRODUKSI OKSIGEN (O₂) ATMOSFER
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: COLORS.forestLight,
              textShadow: `0 0 24px ${COLORS.forestLight}55`,
            }}
          >
            +{o2Value}%{' '}
            <span style={{fontSize: 18, fontWeight: 400, color: COLORS.warmWhite}}>
              SUPLAI GLOBAL
            </span>
          </div>
        </div>
      </div>

      <CinematicHUD
        sceneCode="SCN // 02"
        sceneLabel="TROPICAL RAINFOREST CANOPY"
        coordinates="3.4653° S, 62.2159° W // BIOMASS DENSITY HIGH"
        accentColor={COLORS.forestLight}
      />
    </AbsoluteFill>
  );
};
