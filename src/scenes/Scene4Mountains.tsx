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

export const Scene4Mountains: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {opacity} = useSceneEnvelope(durationInFrames, 24, 24);

  // Cinematic aerial drone movement (slow pan + elevation shift)
  const aerialZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.14], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
  const panX = interpolate(frame, [0, durationInFrames], [0, -75]);

  // Fog & Cloud horizontal drift
  const cloudDrift1 = interpolate(frame, [0, durationInFrames], [-80, 140]);
  const cloudDrift2 = interpolate(frame, [0, durationInFrames], [90, -160]);

  // Typography & Data telemetry springs
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

  const dataReveal = spring({
    frame: frame - 65,
    fps,
    config: {damping: 18, stiffness: 80},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070c14',
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Alpine Dawn Sky Gradient */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, #091321 0%, #162a3e 46%, #2c3e4f 78%, #101924 100%)',
        }}
      />

      {/* High-Altitude Warm Sun Horizon Glow */}
      <div
        style={{
          position: 'absolute',
          top: '34%',
          left: '58%',
          width: 820,
          height: 520,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212, 163, 115, 0.34) 0%, rgba(56, 189, 248, 0.12) 48%, transparent 72%)',
        }}
      />

      {/* DEPTH LAYER 1 (Background): Distant Snow-Capped Alpine Range */}
      <AbsoluteFill
        style={{
          transform: `scale(${aerialZoom * 0.98}) translateX(${panX * 0.3}px)`,
        }}
      >
        <svg width={2100} height={1080} viewBox="0 0 2100 1080">
          <polygon
            points="0,780 280,430 510,590 830,290 1140,560 1460,260 1790,520 2100,390 2100,1080 0,1080"
            fill="#1e3148"
          />
          {/* Snow Ridges & Glaciers */}
          <polygon
            points="830,290 745,390 815,375 860,420 935,380"
            fill="#e2e8f0"
            opacity="0.75"
          />
          <polygon
            points="1460,260 1365,375 1445,355 1510,415 1585,360"
            fill="#f8fafc"
            opacity="0.82"
          />
        </svg>
      </AbsoluteFill>

      {/* MOVING CLOUD & MIST LAYER 1 */}
      <AbsoluteFill
        style={{
          transform: `translateX(${cloudDrift1}px)`,
          opacity: 0.48,
          pointerEvents: 'none',
        }}
      >
        <svg width={2200} height={1080} viewBox="0 0 2200 1080">
          <defs>
            <linearGradient id="mistGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="750" cy="540" rx="520" ry="55" fill="url(#mistGrad1)" />
          <ellipse cx="1480" cy="490" rx="610" ry="65" fill="url(#mistGrad1)" />
        </svg>
      </AbsoluteFill>

      {/* DEPTH LAYER 2 (Midground): Jagged Granite Peaks & Glacial River Tributaries */}
      <AbsoluteFill
        style={{
          transform: `scale(${aerialZoom * 1.04}) translateX(${panX * 0.65}px)`,
        }}
      >
        <svg width={2100} height={1080} viewBox="0 0 2100 1080">
          <polygon
            points="0,840 190,560 440,680 680,410 1010,710 1280,380 1620,690 1960,490 2100,640 2100,1080 0,1080"
            fill="#101f30"
          />
          {/* Glowing Glacial Meltwater Stream Flowing Down Peak */}
          <path
            d="M1280,385 C1265,470 1310,550 1275,640 C1235,740 1130,830 1185,960"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="3.5"
            strokeDasharray="12 8"
            strokeDashoffset={-frame * 1.8}
            opacity="0.85"
          />
        </svg>
      </AbsoluteFill>

      {/* MOVING FOG LAYER 2 (Valley Mist) */}
      <AbsoluteFill
        style={{
          transform: `translateX(${cloudDrift2}px)`,
          opacity: 0.42,
          pointerEvents: 'none',
        }}
      >
        <svg width={2200} height={1080} viewBox="0 0 2200 1080">
          <ellipse cx="620" cy="740" rx="680" ry="70" fill="url(#mistGrad1)" />
          <ellipse cx="1520" cy="790" rx="590" ry="60" fill="url(#mistGrad1)" />
        </svg>
      </AbsoluteFill>

      {/* DEPTH LAYER 3 (Foreground): Dark Ridge Silhouette for 2.5D Parallax */}
      <AbsoluteFill
        style={{
          transform: `scale(${aerialZoom * 1.12}) translateX(${panX * 1.15}px)`,
        }}
      >
        <svg width={2200} height={1080} viewBox="0 0 2200 1080">
          <polygon
            points="0,1080 0,790 310,670 640,890 980,760 1390,930 1790,720 2200,880 2200,1080"
            fill="#060d16"
          />
        </svg>
      </AbsoluteFill>

      {/* High-Altitude Snow / Mist Particles */}
      <ParticleField
        count={55}
        color={COLORS.warmWhite}
        speedMultiplier={0.7}
        seedOffset={505}
        direction="drift"
      />

      {/* SCIENTIFIC DATA VISUALIZATION: Altitude & Hydrological Cycle Telemetry */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none'}}
      >
        <g opacity={dataReveal}>
          {/* Peak Elevation Marker on Right Peak */}
          <circle
            cx="1235"
            cy="390"
            r="22"
            fill="none"
            stroke={COLORS.earthTone}
            strokeWidth="1.5"
          />
          <circle cx="1235" cy="390" r="5" fill={COLORS.earthTone} />
          <polyline
            points="1255,375 1350,285 1740,285"
            fill="none"
            stroke={COLORS.earthTone}
            strokeWidth="2"
          />

          {/* Watershed Flow Indicator in Valley */}
          <circle
            cx="1195"
            cy="720"
            r="22"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="1.5"
          />
          <circle cx="1195" cy="720" r="5" fill={COLORS.cyanGlow} />
          <polyline
            points="1215,720 1350,720 1740,720"
            fill="none"
            stroke={COLORS.cyanGlow}
            strokeWidth="2"
          />
        </g>
      </svg>

      {/* Data Overlay 1: Orographic Condensation */}
      <div
        style={{
          position: 'absolute',
          top: 215,
          right: 175,
          textAlign: 'right',
          zIndex: 28,
          opacity: dataReveal,
          transform: `translateX(${interpolate(dataReveal, [0, 1], [35, 0])}px)`,
          fontFamily: FONTS.mono,
        }}
      >
        <div style={{fontSize: 13, letterSpacing: 3, color: COLORS.earthTone}}>
          KONDENSASI OROGRAFIS // ELV 4.884 M
        </div>
        <div style={{fontSize: 24, fontWeight: 700, color: COLORS.warmWhite, marginTop: 4}}>
          Menara Air Alami Penyimpan 68% Air Tawar
        </div>
      </div>

      {/* Data Overlay 2: River Basin Distribution */}
      <div
        style={{
          position: 'absolute',
          top: 650,
          right: 175,
          textAlign: 'right',
          zIndex: 28,
          opacity: dataReveal,
          transform: `translateX(${interpolate(dataReveal, [0, 1], [35, 0])}px)`,
          fontFamily: FONTS.mono,
        }}
      >
        <div style={{fontSize: 13, letterSpacing: 3, color: COLORS.cyanGlow}}>
          DISTRIBUSI HULU KE HILIR (SIKLUS AIR)
        </div>
        <div style={{fontSize: 24, fontWeight: 700, color: COLORS.warmWhite, marginTop: 4}}>
          Aliran Gletser &amp; Sungai Menuju Hutan &amp; Samudra
        </div>
      </div>

      {/* EDITORIAL TYPOGRAPHY (Left Column) */}
      <div
        style={{
          position: 'absolute',
          top: 215,
          left: 140,
          maxWidth: 860,
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            letterSpacing: 5,
            color: COLORS.earthTone,
            marginBottom: 12,
            opacity: titleReveal,
          }}
        >
          04 // ALPINE TOPOGRAPHY &amp; WATERSHED
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
              transform: `translateY(${interpolate(titleReveal, [0, 1], [130, 0])}px)`,
              textShadow: '0 20px 45px rgba(0,0,0,0.85)',
            }}
          >
            SUMBER KEHIDUPAN
          </h1>
        </div>

        <div
          style={{
            width: interpolate(titleReveal, [0, 1], [0, 260]),
            height: 4,
            backgroundColor: COLORS.earthTone,
            marginTop: 22,
            marginBottom: 22,
            boxShadow: `0 0 18px ${COLORS.earthTone}`,
          }}
        />

        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 34,
            fontWeight: 400,
            color: COLORS.warmWhite,
            margin: 0,
            opacity: subtitleReveal,
            transform: `translateY(${interpolate(subtitleReveal, [0, 1], [25, 0])}px)`,
          }}
        >
          Air menghubungkan seluruh ekosistem.
        </p>
      </div>

      <CinematicHUD
        sceneCode="SCN // 04"
        sceneLabel="HIGHLAND CRYOSPHERE & WATERSHED"
        coordinates="4.0833° S, 137.1833° E // ALT 4,884 M"
        accentColor={COLORS.earthTone}
      />
    </AbsoluteFill>
  );
};
