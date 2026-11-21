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

export const Scene3Ocean: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {opacity} = useSceneEnvelope(durationInFrames, 24, 24);

  // Dive / vertical camera drift from surface down into the coral reef
  const diveOffsetY = interpolate(frame, [0, durationInFrames], [45, -35], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.02, 1.12]);

  // Typography & Callout springs
  const titleReveal = spring({
    frame: frame - 18,
    fps,
    config: {damping: 18, stiffness: 85},
  });

  const subtitleReveal = spring({
    frame: frame - 34,
    fps,
    config: {damping: 20, stiffness: 80},
  });

  const callout1Reveal = spring({
    frame: frame - 60,
    fps,
    config: {damping: 18, stiffness: 85},
  });

  const callout2Reveal = spring({
    frame: frame - 90,
    fps,
    config: {damping: 18, stiffness: 85},
  });

  // Parallax fish groups
  const bgFishX = interpolate(frame, [0, durationInFrames], [1750, 220]);
  const midFishX = interpolate(frame, [0, durationInFrames], [200, 1550]);
  const fgFishX = interpolate(frame, [0, durationInFrames], [1980, -180]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deepAbyss,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Underwater Depth Gradient */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, #0b4a6f 0%, #072842 48%, #020c17 100%)',
          transform: `scale(${cameraZoom}) translateY(${diveOffsetY * 0.4}px)`,
        }}
      />

      {/* Underwater Caustic Sunbeams from Water Surface */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          opacity: 0.55,
        }}
      >
        <defs>
          <linearGradient id="oceanRay" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.52" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#03111c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[220, 560, 880, 1210, 1540].map((x, idx) => {
          const sway = Math.sin(frame * 0.03 + idx * 1.2) * 55;
          return (
            <polygon
              key={idx}
              points={`${x},0 ${x + 190},0 ${x + 310 + sway},1080 ${x - 80 + sway},1080`}
              fill="url(#oceanRay)"
            />
          );
        })}
      </svg>

      {/* PARALLAX LAYER 1 (Distant School of Fish Silhouettes) */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          transform: `translateY(${diveOffsetY * 0.5}px)`,
        }}
      >
        {[
          {dx: 0, dy: 240, s: 0.55},
          {dx: 65, dy: 215, s: 0.45},
          {dx: 120, dy: 255, s: 0.5},
          {dx: 45, dy: 280, s: 0.4},
          {dx: 170, dy: 230, s: 0.48},
        ].map((f, i) => {
          const yBob = Math.sin(frame * 0.07 + i) * 10;
          return (
            <g
              key={i}
              transform={`translate(${bgFishX + f.dx}, ${f.dy + yBob}) scale(${-f.s}, ${f.s})`}
            >
              <path
                d="M0,0 C25,-16 60,-14 85,0 C60,14 25,16 0,0 Z M80,0 L105,-14 L100,0 L105,14 Z"
                fill="#7dd3fc"
              />
            </g>
          );
        })}
      </svg>

      {/* PARALLAX LAYER 2 (Midground Marine Species & Tracking Nodes) */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${diveOffsetY * 0.8}px)`,
        }}
      >
        {[
          {dx: 0, dy: 530, s: 1.15},
          {dx: -130, dy: 585, s: 0.9},
          {dx: -75, dy: 475, s: 0.85},
        ].map((f, i) => {
          const yBob = Math.sin(frame * 0.08 + i * 2) * 14;
          const curX = midFishX + f.dx;
          const curY = f.dy + yBob;
          return (
            <g key={i} transform={`translate(${curX}, ${curY}) scale(${f.s})`}>
              <path
                d="M0,0 C30,-20 75,-18 105,0 C75,18 30,20 0,0 Z M-2,0 L-28,-18 L-20,0 L-28,18 Z"
                fill="#38bdf8"
                opacity="0.85"
              />
              {i === 0 && (
                <>
                  <circle
                    cx="55"
                    cy="0"
                    r="36"
                    fill="none"
                    stroke={COLORS.emeraldAccent}
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  <circle cx="55" cy="0" r="4" fill={COLORS.emeraldAccent} />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* PARALLAX LAYER 3 (Foreground Reef & Seaweed Silhouette with Sway) */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraZoom}) translateY(${diveOffsetY * 1.1}px)`,
        }}
      >
        {/* Deep Seabed Ridge */}
        <path
          d="M0,1080 L0,860 C260,820 480,910 760,880 C1080,840 1390,910 1650,830 L1920,850 L1920,1080 Z"
          fill="#041829"
        />

        {/* Coral Reef Structures (Left & Right) */}
        <g transform={`translate(220, 890) rotate(${Math.sin(frame * 0.04) * 3})`}>
          <path
            d="M0,0 C-15,-65 -45,-110 -35,-165 C-15,-125 0,-95 5,-45 C15,-115 35,-160 55,-190 C55,-135 35,-85 20,-30 C45,-80 75,-115 95,-130 C75,-85 45,-40 25,10 Z"
            fill="#0d9488"
            opacity="0.78"
          />
        </g>

        <g transform={`translate(1470, 880) rotate(${Math.cos(frame * 0.035) * 3})`}>
          <path
            d="M0,0 C-20,-85 -65,-140 -50,-210 C-20,-150 -5,-105 8,-55 C20,-140 50,-195 75,-230 C70,-160 45,-100 28,-35 C65,-95 105,-140 130,-160 C100,-100 60,-45 35,15 Z"
            fill="#0284c7"
            opacity="0.82"
          />
        </g>

        {/* Fast Foreground Silhouette Fish */}
        <g transform={`translate(${fgFishX}, 780) scale(-1.7, 1.7)`}>
          <path
            d="M0,0 C30,-18 70,-16 95,0 C70,16 30,18 0,0 Z M92,0 L120,-18 L112,0 L120,18 Z"
            fill="#020810"
            opacity="0.9"
          />
        </g>
      </svg>

      {/* Underwater Bubbles & Bioluminescent Plankton */}
      <ParticleField
        count={75}
        color="#7dd3fc"
        speedMultiplier={0.95}
        seedOffset={404}
        direction="up"
      />

      {/* SCIENTIFIC INFOGRAPHIC CALLOUT LINES & LABELS */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, zIndex: 22, pointerEvents: 'none'}}
      >
        {/* Callout 1: Coral Reef Target (Bottom Left) */}
        <g opacity={callout1Reveal}>
          <circle
            cx="245"
            cy="740"
            r="24"
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="1.5"
          />
          <circle cx="245" cy="740" r="5" fill={COLORS.emeraldAccent} />
          <polyline
            points="265,725 360,630 660,630"
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="2"
            strokeDasharray="450"
            strokeDashoffset={interpolate(callout1Reveal, [0, 1], [450, 0])}
          />
        </g>

        {/* Callout 2: Deep Pelagic Biodiversity Target (Right) */}
        <g opacity={callout2Reveal}>
          <circle
            cx="1510"
            cy="700"
            r="28"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="1.5"
          />
          <circle cx="1510" cy="700" r="5" fill={COLORS.cyanGlow} />
          <polyline
            points="1490,680 1370,560 1030,560"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="2"
            strokeDasharray="480"
            strokeDashoffset={interpolate(callout2Reveal, [0, 1], [480, 0])}
          />
        </g>
      </svg>

      {/* Label Information 1: Coral Reef */}
      <div
        style={{
          position: 'absolute',
          top: 565,
          left: 365,
          zIndex: 25,
          opacity: callout1Reveal,
          transform: `translateY(${interpolate(callout1Reveal, [0, 1], [15, 0])}px)`,
          fontFamily: FONTS.mono,
        }}
      >
        <div style={{fontSize: 13, letterSpacing: 3, color: COLORS.emeraldAccent}}>
          EKOSISTEM TERUMBU KARANG
        </div>
        <div style={{fontSize: 22, fontWeight: 700, color: COLORS.warmWhite, marginTop: 2}}>
          25% Biota Laut Bermukim di &lt;1% Area Samudra
        </div>
      </div>

      {/* Label Information 2: Ocean Thermal & Carbon Sink */}
      <div
        style={{
          position: 'absolute',
          top: 495,
          left: 1030,
          zIndex: 25,
          opacity: callout2Reveal,
          transform: `translateY(${interpolate(callout2Reveal, [0, 1], [15, 0])}px)`,
          fontFamily: FONTS.mono,
        }}
      >
        <div style={{fontSize: 13, letterSpacing: 3, color: COLORS.cyanGlow}}>
          BIOSFER PELAGIS &amp; REGULATOR TERMAL
        </div>
        <div style={{fontSize: 22, fontWeight: 700, color: COLORS.warmWhite, marginTop: 2}}>
          71% Permukaan Bumi // 90% Biosfer Hidup
        </div>
      </div>

      {/* EDITORIAL TYPOGRAPHY (Top Left Hero Layout) */}
      <div
        style={{
          position: 'absolute',
          top: 175,
          left: 140,
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            letterSpacing: 5,
            color: COLORS.cyanGlow,
            marginBottom: 10,
            opacity: titleReveal,
          }}
        >
          03 // MARINE HYDROSPHERE &amp; CORAL BIODIVERSITY
        </div>

        <div style={{overflow: 'hidden'}}>
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 146,
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.92,
              letterSpacing: 10,
              color: COLORS.warmWhite,
              transform: `translateY(${interpolate(titleReveal, [0, 1], [150, 0])}px)`,
              textShadow: '0 20px 50px rgba(2, 12, 23, 0.85)',
            }}
          >
            LAUTAN
          </h1>
        </div>

        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 34,
            fontWeight: 400,
            color: COLORS.warmWhite,
            margin: '20px 0 0 0',
            opacity: subtitleReveal,
            transform: `translateY(${interpolate(subtitleReveal, [0, 1], [25, 0])}px)`,
          }}
        >
          Rumah bagi keanekaragaman kehidupan.
        </p>
      </div>

      <CinematicHUD
        sceneCode="SCN // 03"
        sceneLabel="SUBSURFACE CORAL ECOSYSTEM"
        coordinates="0.5897° S, 130.5170° E // DEPTH -28.4 M"
        accentColor={COLORS.cyanGlow}
      />
    </AbsoluteFill>
  );
};
