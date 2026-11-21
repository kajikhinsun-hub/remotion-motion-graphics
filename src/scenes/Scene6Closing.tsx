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
} from '../components/SharedUI';

export const Scene6Closing: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fade in smoothly, end with a long cinematic fade out to black
  const sceneOpacity = interpolate(
    frame,
    [0, 28, durationInFrames - 50, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  // Camera slowly pulls away (zoom out from 1.18 to 0.86)
  const cameraPullBack = interpolate(
    frame,
    [0, durationInFrames],
    [1.18, 0.86],
    {
      easing: Easing.bezier(0.22, 0.61, 0.36, 1),
    }
  );

  const line1Reveal = spring({
    frame: frame - 32,
    fps,
    config: {damping: 18, stiffness: 80},
  });

  const line2Reveal = spring({
    frame: frame - 72,
    fps,
    config: {damping: 16, stiffness: 75, mass: 1.1},
  });

  const dividerWidth = interpolate(
    spring({frame: frame - 55, fps, config: {damping: 22, stiffness: 70}}),
    [0, 1],
    [0, 740]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.midnightBlack,
        opacity: sceneOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Unified Biosphere Panorama (Mountains + Forest + Ocean Horizon) */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraPullBack})`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Cosmic Deep Background */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 50% 60%, #0b293f 0%, #061523 52%, #02050a 100%)',
          }}
        />

        {/* Panoramic Biosphere Planetary Arc combining Mountains, Forest & Ocean */}
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="biosphereGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.forestLight} stopOpacity="0.6" />
              <stop offset="50%" stopColor={COLORS.cyanGlow} stopOpacity="0.9" />
              <stop offset="100%" stopColor={COLORS.earthTone} stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="planetHorizon" cx="50%" cy="100%" r="75%">
              <stop offset="0%" stopColor="#0a3b52" />
              <stop offset="55%" stopColor="#07221b" />
              <stop offset="100%" stopColor="#020810" />
            </radialGradient>
          </defs>

          {/* Outer Orbital Halo Rings */}
          <circle
            cx="960"
            cy="1280"
            r="790"
            fill="none"
            stroke="url(#biosphereGlow)"
            strokeWidth="2"
            opacity="0.45"
          />
          <circle
            cx="960"
            cy="1280"
            r="850"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="1"
            strokeDasharray="6 14"
            opacity="0.3"
          />

          {/* Planetary Curvature Base */}
          <circle cx="960" cy="1280" r="740" fill="url(#planetHorizon)" />

          {/* Unified Silhouette along Planetary Rim: Mountains (Center), Forest (Left), Ocean Waves (Right) */}
          {/* Alpine Peaks Center */}
          <polygon
            points="690,610 810,455 910,535 995,415 1110,540 1210,470 1310,625"
            fill="#122b3d"
            opacity="0.85"
          />
          {/* Snow Caps */}
          <polygon
            points="995,415 955,470 995,458 1035,475"
            fill={COLORS.warmWhite}
            opacity="0.75"
          />

          {/* Forest Canopy Silhouette Left Arc */}
          <path
            d="M280,790 Q420,590 680,585 L710,645 Q460,670 280,790 Z"
            fill="#0b3b28"
            opacity="0.9"
          />

          {/* Ocean Wave Lines Right Arc */}
          <path
            d="M1180,590 Q1420,610 1630,775"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="4"
            opacity="0.7"
          />
          <path
            d="M1140,620 Q1390,645 1590,795"
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="2.5"
            opacity="0.5"
          />

          {/* Glowing Atmospheric Rim Line */}
          <circle
            cx="960"
            cy="1280"
            r="740"
            fill="none"
            stroke="url(#biosphereGlow)"
            strokeWidth="5"
          />
        </svg>
      </AbsoluteFill>

      {/* Luminous Floating Dust Across All Biomes */}
      <ParticleField
        count={60}
        color={COLORS.warmWhite}
        speedMultiplier={0.5}
        seedOffset={707}
        direction="up"
      />
      <ParticleField
        count={40}
        color={COLORS.emeraldAccent}
        speedMultiplier={0.4}
        seedOffset={808}
        direction="drift"
      />

      {/* CLOSING EDITORIAL MANIFESTO TYPOGRAPHY */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30,
          padding: '0 120px',
          paddingBottom: 90,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            letterSpacing: 8,
            color: COLORS.cyanGlow,
            marginBottom: 24,
            opacity: line1Reveal,
          }}
        >
          KEAJAIBAN ALAM SEMESTA // EPILOG
        </div>

        {/* Quote Line 1 */}
        <div style={{overflow: 'hidden'}}>
          <h2
            style={{
              fontFamily: FONTS.body,
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: 6,
              margin: 0,
              color: COLORS.mutedCream,
              opacity: line1Reveal,
              transform: `translateY(${interpolate(line1Reveal, [0, 1], [60, 0])}px)`,
            }}
          >
            &ldquo;BUMI BUKAN SEKADAR TEMPAT KITA HIDUP.&rdquo;
          </h2>
        </div>

        {/* Glowing Divider */}
        <div
          style={{
            width: dividerWidth,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.forestLight}, ${COLORS.cyanGlow}, ${COLORS.earthTone}, transparent)`,
            marginTop: 32,
            marginBottom: 32,
            boxShadow: `0 0 22px ${COLORS.cyanGlow}`,
          }}
        />

        {/* Quote Line 2 (Climax Headline) */}
        <div style={{overflow: 'hidden'}}>
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: 7,
              margin: 0,
              lineHeight: 1.05,
              color: COLORS.warmWhite,
              opacity: line2Reveal,
              transform: `translateY(${interpolate(line2Reveal, [0, 1], [110, 0])}px) scale(${interpolate(line2Reveal, [0, 1], [0.94, 1])})`,
              textShadow: '0 22px 55px rgba(0, 0, 0, 0.9)',
            }}
          >
            &ldquo;BUMI ADALAH KEHIDUPAN ITU SENDIRI.&rdquo;
          </h1>
        </div>
      </AbsoluteFill>

      <CinematicHUD
        sceneCode="SCN // 06"
        sceneLabel="PLANETARY BIOSPHERE SYNTHESIS"
        coordinates="EARTH // ONE INTERCONNECTED SYSTEM"
        accentColor={COLORS.cyanGlow}
      />
    </AbsoluteFill>
  );
};
