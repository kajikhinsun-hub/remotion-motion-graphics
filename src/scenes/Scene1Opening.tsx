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

export const Scene1Opening: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {opacity} = useSceneEnvelope(durationInFrames, 20, 25);

  // Slow push-in camera toward Earth (2.5D depth)
  const cameraScale = interpolate(frame, [0, durationInFrames], [0.84, 1.16], {
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

  const earthGlow = interpolate(frame, [0, 55, durationInFrames], [0, 0.9, 1], {
    extrapolateRight: 'clamp',
  });

  const earthRotation = interpolate(frame, [0, durationInFrames], [-18, 22]);

  // Kinetic Typography reveals
  const overlineReveal = spring({
    frame: frame - 22,
    fps,
    config: {damping: 18, stiffness: 90},
  });

  const mainTitleReveal = spring({
    frame: frame - 38,
    fps,
    config: {damping: 16, stiffness: 85, mass: 1.1},
  });

  const subTitleReveal = spring({
    frame: frame - 58,
    fps,
    config: {damping: 18, stiffness: 80},
  });

  const horizonLineWidth = interpolate(
    spring({frame: frame - 48, fps, config: {damping: 22, stiffness: 70}}),
    [0, 1],
    [0, 680]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.midnightBlack,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Deep Space Atmosphere & Starfield */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 62%, #0a233c 0%, #050d18 45%, #020408 100%)',
          transform: `scale(${interpolate(cameraScale, [0.84, 1.16], [1, 1.06])})`,
        }}
      />

      {/* Luminous Cosmic Dust Particles */}
      <ParticleField
        count={70}
        color={COLORS.cyanGlow}
        speedMultiplier={0.75}
        seedOffset={11}
        direction="drift"
      />
      <ParticleField
        count={45}
        color={COLORS.warmWhite}
        speedMultiplier={0.5}
        seedOffset={77}
        direction="up"
      />

      {/* 2.5D Planet Earth & Orbital Telemetry Rings */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${cameraScale}) translateY(70px)`,
        }}
      >
        {/* Atmospheric Rim Horizon Glow */}
        <div
          style={{
            position: 'absolute',
            width: 820,
            height: 820,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.25), rgba(13, 148, 136, 0.08) 55%, transparent 72%)',
            filter: 'blur(25px)',
            opacity: earthGlow,
          }}
        />

        {/* SVG Earth Globe with Continents, Terminator Shadow & Orbital Grid */}
        <svg
          width={900}
          height={900}
          viewBox="0 0 900 900"
          style={{opacity: earthGlow, overflow: 'visible'}}
        >
          <defs>
            <radialGradient id="earthCore" cx="45%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#1e6091" />
              <stop offset="38%" stopColor="#0b3b59" />
              <stop offset="72%" stopColor="#061a2b" />
              <stop offset="100%" stopColor="#02070d" />
            </radialGradient>
            <linearGradient id="atmoRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#2dd4bf" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#03111c" stopOpacity="0" />
            </linearGradient>
            <clipPath id="globeClip">
              <circle cx="450" cy="450" r="310" />
            </clipPath>
          </defs>

          {/* Outer Scientific Orbital Rings */}
          <ellipse
            cx="450"
            cy="450"
            rx="420"
            ry="150"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="1"
            strokeDasharray="6 10"
            opacity="0.32"
            transform={`rotate(${-14 + frame * 0.05} 450 450)`}
          />
          <ellipse
            cx="450"
            cy="450"
            rx="370"
            ry="370"
            fill="none"
            stroke={COLORS.emeraldAccent}
            strokeWidth="0.8"
            strokeDasharray="3 14"
            opacity="0.25"
            transform={`rotate(${frame * 0.08} 450 450)`}
          />

          {/* Main Planet Sphere */}
          <circle cx="450" cy="450" r="310" fill="url(#earthCore)" />

          {/* Animated Continents & Cloud Bands inside Globe Clip */}
          <g
            clipPath="url(#globeClip)"
            transform={`translate(${earthRotation * 2.2}, 0)`}
          >
            {/* Stylised Emerald Landmasses */}
            <path
              d="M230,310 C280,270 350,280 390,330 C430,380 410,450 360,490 C310,530 240,510 210,450 C180,390 190,340 230,310 Z"
              fill="#0f5132"
              opacity="0.65"
            />
            <path
              d="M470,240 C540,220 610,260 640,330 C670,400 630,480 570,520 C510,560 470,510 460,440 C450,370 420,260 470,240 Z"
              fill="#136f48"
              opacity="0.6"
            />
            <path
              d="M340,560 C390,550 450,590 470,650 C490,710 420,740 360,710 C300,680 290,570 340,560 Z"
              fill="#0d472e"
              opacity="0.55"
            />
            {/* Latitude / Longitude Scientific Grid */}
            {[-180, -90, 0, 90, 180].map((offset, i) => (
              <ellipse
                key={i}
                cx={450 + offset}
                cy="450"
                rx="140"
                ry="310"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.6"
                opacity="0.16"
              />
            ))}
            {[-160, -80, 0, 80, 160].map((yOff, i) => (
              <line
                key={i}
                x1="120"
                y1={450 + yOff}
                x2="780"
                y2={450 + yOff}
                stroke="#38bdf8"
                strokeWidth="0.6"
                opacity="0.16"
              />
            ))}
          </g>

          {/* Atmospheric Sunrise Rim Crescent */}
          <circle
            cx="450"
            cy="450"
            r="311"
            fill="none"
            stroke="url(#atmoRim)"
            strokeWidth="6"
          />
        </svg>
      </AbsoluteFill>

      {/* Kinetic Editorial Typography Container */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          paddingBottom: 40,
        }}
      >
        {/* Small Subtitle: THE BEAUTY OF NATURE */}
        <div style={{overflow: 'hidden', marginBottom: 14}}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 12,
              color: COLORS.emeraldAccent,
              textTransform: 'uppercase',
              opacity: overlineReveal,
              transform: `translateY(${interpolate(overlineReveal, [0, 1], [28, 0])}px)`,
              textShadow: `0 0 18px ${COLORS.emeraldAccent}66`,
            }}
          >
            THE BEAUTY OF NATURE
          </div>
        </div>

        {/* Massive Hero Title: "ALAM" */}
        <div style={{overflow: 'hidden', padding: '0 24px'}}>
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 196,
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.92,
              letterSpacing: 22,
              color: COLORS.warmWhite,
              transform: `translateY(${interpolate(mainTitleReveal, [0, 1], [180, 0])}px) scale(${interpolate(mainTitleReveal, [0, 1], [0.92, 1])})`,
              opacity: mainTitleReveal,
              textShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
            }}
          >
            ALAM
          </h1>
        </div>

        {/* Glowing Horizon Divider Line */}
        <div
          style={{
            width: horizonLineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.cyanGlow}, ${COLORS.emeraldAccent}, transparent)`,
            marginTop: 22,
            marginBottom: 22,
            boxShadow: `0 0 18px ${COLORS.cyanGlow}`,
          }}
        />

        {/* Secondary Headline: "KEHIDUPAN YANG TAK TERBATAS" */}
        <div style={{overflow: 'hidden'}}>
          <h2
            style={{
              fontFamily: FONTS.body,
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: 11,
              margin: 0,
              color: COLORS.warmWhite,
              opacity: subTitleReveal,
              transform: `translateY(${interpolate(subTitleReveal, [0, 1], [40, 0])}px)`,
            }}
          >
            KEHIDUPAN YANG TAK TERBATAS
          </h2>
        </div>
      </AbsoluteFill>

      <CinematicHUD
        sceneCode="SCN // 01"
        sceneLabel="ORBITAL BIOSPHERE OBSERVATION"
        coordinates="0.0000° N, 0.0000° E // ALT 408 KM"
        accentColor={COLORS.cyanGlow}
      />
    </AbsoluteFill>
  );
};
