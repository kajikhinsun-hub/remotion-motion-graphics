import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const SRC_W = 736;
const SRC_H = 920;
const OUT_W = 1080;
const OUT_H = 1350;
const S = OUT_W / SRC_W;
const LOOP = 300; // 10 seconds @ 30fps
const GREEN = '#7ddc1a';
const NEON_LIME = '#a3ff12';
const CYAN_SPARK = '#38bdf8';
const POSTER = staticFile('images/poster.jpg');
const POSTER_BGM = staticFile('audio/poster-bgm.wav');

// 128 BPM beat synchronization (~14.0625 frames per beat)
const FRAMES_PER_BEAT = (30 * 60) / 128;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

const seeded = (seed: number): number => {
  const v = Math.sin(seed * 9999.91) * 10000;
  return v - Math.floor(v);
};

const breath = (frame: number, phase = 0): number =>
  0.5 - 0.5 * Math.cos(2 * Math.PI * (frame / LOOP + phase));

const wave = (frame: number, phase = 0, cycles = 1): number =>
  Math.sin(2 * Math.PI * ((cycles * frame) / LOOP + phase));

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

// Beat pump envelope (0..1 spike on every 128 BPM kick drum beat)
const getBeatPulse = (frame: number): number => {
  const beatPhase = (frame % FRAMES_PER_BEAT) / FRAMES_PER_BEAT;
  return Math.exp(-beatPhase * 5.2);
};

const shineAt = (
  frame: number,
  start: number,
  dur: number,
  period = 90
): number | null => {
  const t = (((frame - start) % period) + period) % period;
  return t < dur ? t / dur : null;
};

interface CropProps {
  box: Box;
  transform?: string;
  opacity?: number;
  feather?: number;
  shine?: number | null;
  origin?: string;
  glowIntensity?: number;
  borderRadius?: number;
}

const Crop: React.FC<CropProps> = ({
  box,
  transform,
  opacity = 1,
  feather = 0,
  shine = null,
  origin = '50% 50%',
  glowIntensity = 0,
  borderRadius = 0,
}) => {
  const f = feather;
  const maskX = `linear-gradient(to right, transparent 0, #000 ${f}px, #000 calc(100% - ${f}px), transparent 100%)`;
  const maskY = `linear-gradient(to bottom, transparent 0, #000 ${f}px, #000 calc(100% - ${f}px), transparent 100%)`;
  const mask = f > 0 ? `${maskX}, ${maskY}` : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x * S,
        top: box.y * S,
        width: box.w * S,
        height: box.h * S,
        overflow: 'hidden',
        opacity,
        transform,
        transformOrigin: origin,
        borderRadius,
        boxShadow:
          glowIntensity > 0
            ? `0 12px 34px rgba(125, 220, 26, ${0.45 * glowIntensity}), 0 0 ${24 * glowIntensity}px ${NEON_LIME}`
            : undefined,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskComposite: mask ? 'source-in' : undefined,
        maskComposite: mask ? 'intersect' : undefined,
      }}
    >
      <Img
        src={POSTER}
        style={{
          position: 'absolute',
          left: -box.x * S,
          top: -box.y * S,
          width: SRC_W * S,
          height: SRC_H * S,
          maxWidth: 'none',
        }}
      />
      {shine !== null ? (
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            bottom: '-15%',
            width: '48%',
            left: `${interpolate(shine, [0, 1], [-60, 130])}%`,
            background:
              'linear-gradient(100deg, transparent, rgba(163,255,18,0.45), rgba(255,255,255,0.92), rgba(163,255,18,0.45), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      ) : null}
    </div>
  );
};

// High-Energy Radial Speed Lines & Rotating Cyber Aura behind Character
const CyberHeroAura: React.FC<{intro: number; beat: number}> = ({
  intro,
  beat,
}) => {
  const frame = useCurrentFrame();
  const cx = 530;
  const cy = 595;

  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id="handMagic" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={NEON_LIME} stopOpacity="0.68" />
          <stop offset="45%" stopColor={GREEN} stopOpacity="0.24" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rotating Outer Cyber-Tech Compass Ring behind Character */}
      <g transform={`translate(${cx}, ${cy}) rotate(${frame * 0.9})`}>
        <circle
          cx="0"
          cy="0"
          r={380 + beat * 16}
          fill="none"
          stroke={GREEN}
          strokeWidth="2.5"
          strokeDasharray="18 24 6 24"
          opacity="0.38"
        />
        <circle
          cx="0"
          cy="0"
          r={435 - beat * 10}
          fill="none"
          stroke={NEON_LIME}
          strokeWidth="1.5"
          strokeDasharray="40 80"
          opacity="0.32"
        />
      </g>

      {/* Counter-Rotating Hexagon / Energy Ring */}
      <g transform={`translate(${cx}, ${cy}) rotate(${-frame * 1.35})`}>
        <circle
          cx="0"
          cy="0"
          r={310}
          fill="none"
          stroke={GREEN}
          strokeWidth="3"
          strokeDasharray="8 32"
          opacity="0.45"
        />
      </g>

      {/* High-Speed Anime Action Lines radiating from Center */}
      {Array.from({length: 24}).map((_, i) => {
        const angle = (i * 360) / 24 + frame * 0.35;
        const rad = (angle * Math.PI) / 180;
        const pulseOffset = ((frame * 14 + i * 37) % 260);
        const r1 = 290 + pulseOffset;
        const r2 = r1 + 65 + beat * 35;
        const x1 = cx + Math.cos(rad) * r1;
        const y1 = cy + Math.sin(rad) * r1;
        const x2 = cx + Math.cos(rad) * r2;
        const y2 = cy + Math.sin(rad) * r2;
        const alpha = interpolate(pulseOffset, [0, 130, 260], [0, 0.5, 0]);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 3 === 0 ? NEON_LIME : GREEN}
            strokeWidth={i % 2 === 0 ? 3.5 : 2}
            strokeLinecap="round"
            opacity={alpha}
          />
        );
      })}
    </svg>
  );
};

// Neon Energy Circuit Arcs connecting Character's Outstretched Hand to all 6 Cards & Controller
const NeonEnergyCircuits: React.FC<{intro: number; beat: number}> = ({
  intro,
  beat,
}) => {
  const frame = useCurrentFrame();
  // Character's outstretched hand & chest emblem coordinates (scaled to 1080x1350)
  const handX = 455;
  const handY = 748;
  const emblemX = 620;
  const emblemY = 742;

  // Centers of the 6 floating cards
  const targets = [
    {x: 268, y: 425}, // 3D Character
    {x: 918, y: 648}, // Cinematic
    {x: 176, y: 625}, // Environment
    {x: 842, y: 888}, // 3D Modeling
    {x: 227, y: 851}, // Motion Graphics
    {x: 858, y: 436}, // Game Asset
  ];

  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        pointerEvents: 'none',
      }}
    >
      {/* Glowing Power Orb on Character's Outstretched Hand */}
      <circle
        cx={handX}
        cy={handY}
        r={58 + beat * 28}
        fill="url(#handMagic)"
      />
      <circle
        cx={handX}
        cy={handY}
        r={24 + beat * 12}
        fill="none"
        stroke={NEON_LIME}
        strokeWidth="3"
        strokeDasharray="10 8"
        transform={`rotate(${frame * 5} ${handX} ${handY})`}
        opacity="0.85"
      />

      {/* Glowing Pulse on Character's 'G' Chest Logo */}
      <circle
        cx={emblemX}
        cy={emblemY}
        r={22 + beat * 16}
        fill={NEON_LIME}
        opacity={0.35 + beat * 0.45}
      />
      <circle
        cx={emblemX}
        cy={emblemY}
        r={32 + ((frame * 2) % 38)}
        fill="none"
        stroke={NEON_LIME}
        strokeWidth="2.5"
        opacity={interpolate((frame * 2) % 38, [0, 38], [0.85, 0])}
      />

      {/* Electric Data Beams shooting from Hand to each of the 6 Service Cards */}
      {targets.map((t, i) => {
        const ctrlX = (handX + t.x) / 2 + (i % 2 === 0 ? -45 : 45);
        const ctrlY = (handY + t.y) / 2 - 55;
        const pathD = `M ${handX} ${handY} Q ${ctrlX} ${ctrlY} ${t.x} ${t.y}`;
        return (
          <g key={i}>
            <path
              d={pathD}
              fill="none"
              stroke={GREEN}
              strokeWidth="2.5"
              opacity="0.35"
            />
            <path
              d={pathD}
              fill="none"
              stroke={NEON_LIME}
              strokeWidth={3.5 + beat * 2}
              strokeDasharray="22 110"
              strokeDashoffset={-frame * 9 - i * 25}
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>
        );
      })}
    </svg>
  );
};

// Controller Portal Shockwaves + 32-Bar Audio Visualizer Spectrum
const ControllerPortalAndEqualizer: React.FC<{intro: number; beat: number}> = ({
  intro,
  beat,
}) => {
  const frame = useCurrentFrame();
  const cx = 530;
  const cy = 1018;

  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        pointerEvents: 'none',
      }}
    >
      {/* Multi-Layer Expanding Shockwave Rings under Gamepad */}
      {[0, 1, 2, 3, 4].map((i) => {
        const p = ((frame * 1.8 + i * 20) % 100) / 100;
        const rx = interpolate(p, [0, 1], [150, 490]);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={rx * 0.19}
            fill="none"
            stroke={i % 2 === 0 ? NEON_LIME : GREEN}
            strokeWidth={interpolate(p, [0, 1], [6.5, 1.5]) + beat * 2}
            opacity={interpolate(p, [0, 0.12, 1], [0, 0.9, 0])}
          />
        );
      })}

      {/* Glowing LED Grips on Gamepad Controller */}
      <ellipse
        cx={415}
        cy={995}
        rx={42 + beat * 12}
        ry={16 + beat * 6}
        fill={NEON_LIME}
        opacity={0.4 + beat * 0.45}
        transform="rotate(-24 415 995)"
      />
      <ellipse
        cx={635}
        cy={995}
        rx={42 + beat * 12}
        ry={16 + beat * 6}
        fill={NEON_LIME}
        opacity={0.4 + beat * 0.45}
        transform="rotate(24 635 995)"
      />

      {/* 36-Bar Esports Audio Visualizer Equalizer behind Controller Portal */}
      {Array.from({length: 36}).map((_, i) => {
        const barX = 215 + i * 18;
        const distCenter = 1 - Math.abs(i - 17.5) / 18;
        const wave1 = Math.abs(Math.sin(frame * 0.28 + i * 0.45));
        const wave2 = Math.abs(Math.cos(frame * 0.19 - i * 0.3));
        const barH =
          (10 + (wave1 * 34 + wave2 * 22 + beat * 38) * distCenter) * intro;
        return (
          <rect
            key={i}
            x={barX}
            y={1048 - barH}
            width={10}
            height={barH}
            rx={5}
            fill={i % 3 === 0 ? NEON_LIME : GREEN}
            opacity={0.55 + distCenter * 0.35}
          />
        );
      })}
    </svg>
  );
};

// High-Density Multi-Size Glowing Particles & Rising Cyber Embers (110 particles)
const DynamicParticles: React.FC<{intro: number; beat: number}> = ({
  intro,
  beat,
}) => {
  const frame = useCurrentFrame();
  const items = React.useMemo(
    () =>
      Array.from({length: 110}).map((_, i) => {
        const s = 500 + i * 19;
        return {
          x: 40 + seeded(s) * 1000,
          y: seeded(s + 1) * OUT_H,
          r: 2.2 + seeded(s + 2) * 6.5,
          laps: 1 + Math.floor(seeded(s + 3) * 3),
          wob: 14 + seeded(s + 4) * 36,
          cyc: 1 + Math.floor(seeded(s + 5) * 4),
          ph: seeded(s + 6) * Math.PI * 2,
          a: 0.35 + seeded(s + 7) * 0.6,
          isDiamond: i % 4 === 0,
          color: i % 7 === 0 ? CYAN_SPARK : i % 2 === 0 ? NEON_LIME : GREEN,
        };
      }),
    []
  );

  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        pointerEvents: 'none',
      }}
    >
      {items.map((p, i) => {
        const y =
          (((p.y - (OUT_H * p.laps * frame) / LOOP) % OUT_H) + OUT_H) % OUT_H;
        const x =
          p.x + Math.sin(2 * Math.PI * p.cyc * (frame / LOOP) + p.ph) * p.wob;
        const tw =
          0.55 + 0.45 * Math.sin(2 * Math.PI * 3 * (frame / LOOP) + p.ph);
        const radius = p.r * (1 + beat * 0.35);

        if (p.isDiamond) {
          return (
            <polygon
              key={i}
              points={`${x},${y - radius * 1.4} ${x + radius * 1.4},${y} ${x},${y + radius * 1.4} ${x - radius * 1.4},${y}`}
              fill={p.color}
              opacity={p.a * tw}
            />
          );
        }
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={radius}
            fill={p.color}
            opacity={p.a * tw}
          />
        );
      })}
    </svg>
  );
};

// Neon Cyber Corner HUD Brackets & Animated Laser Scanline
const CyberHUDOverlay: React.FC<{beat: number}> = ({beat}) => {
  const frame = useCurrentFrame();
  const scanY = ((frame * 9) % (OUT_H + 200)) - 100;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Subtle Horizontal Laser Light Sweep */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 90,
          background:
            'linear-gradient(180deg, transparent, rgba(163, 255, 18, 0.14), transparent)',
        }}
      />

      {/* Glowing Corner Framing Brackets */}
      {[
        {top: 22, left: 22},
        {top: 22, right: 22},
        {bottom: 22, left: 22},
        {bottom: 22, right: 22},
      ].map((pos, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            ...pos,
            width: 38 + beat * 8,
            height: 38 + beat * 8,
            borderTop:
              pos.top !== undefined ? `4px solid ${GREEN}` : undefined,
            borderBottom:
              pos.bottom !== undefined ? `4px solid ${GREEN}` : undefined,
            borderLeft:
              pos.left !== undefined ? `4px solid ${GREEN}` : undefined,
            borderRight:
              pos.right !== undefined ? `4px solid ${GREEN}` : undefined,
            boxShadow: `0 0 ${12 + beat * 10}px ${NEON_LIME}`,
            opacity: 0.78,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const CARDS: Box[] = [
  {x: 94, y: 228, w: 178, h: 124}, // 0: 3D Character Animation
  {x: 534, y: 368, w: 182, h: 148}, // 1: Cinematic Animation
  {x: 40, y: 346, w: 160, h: 160}, // 2: Environment Animation
  {x: 482, y: 526, w: 184, h: 158}, // 3: 3D Modeling
  {x: 60, y: 514, w: 190, h: 132}, // 4: Motion Graphics
  {x: 494, y: 224, w: 182, h: 146}, // 5: Game Asset Animation
];

const ICONS: Box[] = [
  {x: 64, y: 728, w: 118, h: 68},
  {x: 246, y: 728, w: 116, h: 68},
  {x: 410, y: 728, w: 116, h: 68},
  {x: 574, y: 728, w: 116, h: 68},
];

const LOGO_BOX: Box = {x: 24, y: 12, w: 205, h: 40};
const HEADER_TEXT: Box = {x: 30, y: 56, w: 690, h: 112};
const CONTROLLER_BOX: Box = {x: 215, y: 585, w: 295, h: 125};
const CTA: Box = {x: 112, y: 802, w: 514, h: 56};
const WEBSITE: Box = {x: 252, y: 862, w: 232, h: 44};

export const PosterAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const beat = getBeatPulse(frame);

  const reveal = (delay: number) =>
    spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 115}});

  const pHeader = reveal(0);
  const pMid = reveal(6);
  const pBottom = reveal(14);

  const effects = clamp01((frame - 18) / 18);

  // Dynamic camera: smooth orbital sway + subtle beat punch
  const camScale = 1 + 0.028 * breath(frame) + beat * 0.008;
  const camX = wave(frame, 0, 2) * 7;
  const camY = wave(frame, 0.25, 2) * 5;
  const camRot = wave(frame, 0.5, 1) * 0.45;

  // Cycle spotlight across the 6 cards every 25 frames after frame 90
  const activeCardIndex = frame > 85 ? Math.floor((frame - 85) / 22) % 6 : -1;

  const headerShine =
    shineAt(frame, 25, 32, 75) ?? shineAt(frame, 62, 32, 75);

  return (
    <AbsoluteFill style={{backgroundColor: '#f7f8f6', overflow: 'hidden'}}>
      {/* 128 BPM Gaming Synthwave BGM + Frame-Synced SFX */}
      <Audio src={POSTER_BGM} volume={0.95} />

      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, ${camY}px) rotate(${camRot}deg) scale(${camScale})`,
          transformOrigin: '50% 48%',
        }}
      >
        {/* Base Poster Sections with Energetic Entrance */}
        <Crop
          box={{x: 0, y: 0, w: SRC_W, h: 216}}
          opacity={clamp01(pHeader)}
          transform={`translateY(${(1 - pHeader) * -75}px)`}
        />
        <Crop
          box={{x: 0, y: 215, w: SRC_W, h: 546}}
          opacity={clamp01(pMid)}
          transform={`translateY(${(1 - pMid) * 65}px) scale(${0.92 + 0.08 * pMid})`}
        />
        <Crop
          box={{x: 0, y: 760, w: SRC_W, h: 160}}
          opacity={clamp01(pBottom)}
          transform={`translateY(${(1 - pBottom) * 85}px)`}
        />

        {/* Layer 1: Rotating Cyber Aura & Anime Speed Lines */}
        <CyberHeroAura intro={effects} beat={beat} />

        {/* Layer 2: Controller Portal Shockwaves & 36-Bar Equalizer */}
        <ControllerPortalAndEqualizer intro={effects} beat={beat} />

        {/* Layer 3: Neon Energy Beams from Hand to all 6 Cards */}
        <NeonEnergyCircuits intro={effects} beat={beat} />

        {/* Layer 4: 110 Multi-Color Rising Sparks & Diamonds */}
        <DynamicParticles intro={effects} beat={beat} />

        {/* Top-Left GAMESDAPP Logo with Beat Bounce & Shine */}
        <Crop
          box={LOGO_BOX}
          feather={6}
          opacity={clamp01(pHeader)}
          transform={`scale(${1 + beat * 0.045})`}
          shine={shineAt(frame, 10, 25, 60)}
        />

        {/* Hero Headline "YOUR VISION. OUR ANIMATION EXPERTISE." with Beat Pump & Dual Shine */}
        <Crop
          box={HEADER_TEXT}
          feather={10}
          opacity={clamp01(pHeader)}
          transform={`scale(${1 + 0.018 * breath(frame) + beat * 0.016})`}
          shine={headerShine}
        />

        {/* 6 Floating Service Cards: High-Amplitude Hover + Spotlight Pop + Continuous Hologram Shine */}
        {CARDS.map((box, i) => {
          const pop = spring({
            frame: frame - (32 + i * 7),
            fps,
            config: {damping: 11, stiffness: 135},
          });
          const isSpotlight = activeCardIndex === i;
          const spotSpring = spring({
            frame: isSpotlight ? (frame - 85) % 22 : 0,
            fps,
            config: {damping: 12, stiffness: 160},
          });
          const spotBoost = isSpotlight
            ? Math.sin((spotSpring * Math.PI)) * 0.085
            : 0;

          const entranceScale = interpolate(pop, [0, 1], [1.32, 1]);
          const ph = i / 6;
          const dir = i % 2 === 0 ? 1 : -1;
          const dy = wave(frame, ph, 2) * 11 * dir;
          const dx = wave(frame, ph + 0.25, 2) * 6;
          const rot = wave(frame, ph + 0.5, 2) * 2.2 * dir;
          const sc =
            entranceScale *
            (1 + 0.025 * breath(frame, ph) + beat * 0.02 + spotBoost);

          return (
            <Crop
              key={i}
              box={box}
              feather={10}
              borderRadius={22}
              glowIntensity={isSpotlight ? 1 : 0.35 + beat * 0.4}
              opacity={clamp01(pop)}
              transform={`translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sc})`}
              shine={shineAt(frame, 38 + i * 14, 28, 75)}
            />
          );
        })}

        {/* Floating Levitating Gamepad Controller in Foreground */}
        <Crop
          box={CONTROLLER_BOX}
          feather={14}
          opacity={clamp01(pMid)}
          transform={`translateY(${wave(frame, 0.15, 2) * -9}px) rotate(${wave(frame, 0.4, 2) * 1.4}deg) scale(${1 + beat * 0.028})`}
          shine={shineAt(frame, 45, 30, 90)}
        />

        {/* CTA Button: Energetic Beat Pump + Triple Neon Shockwave Rings */}
        {(() => {
          return (
            <>
              {[0, 1].map((ringIdx) => {
                const r = ((frame * 1.6 + ringIdx * 50) % 100) / 100;
                return (
                  <div
                    key={ringIdx}
                    style={{
                      position: 'absolute',
                      left: CTA.x * S,
                      top: CTA.y * S,
                      width: CTA.w * S,
                      height: CTA.h * S,
                      borderRadius: 999,
                      border: `4px solid ${ringIdx === 0 ? NEON_LIME : GREEN}`,
                      boxShadow: `0 0 22px ${NEON_LIME}`,
                      opacity: effects * (1 - r) * 0.85,
                      transform: `scale(${1 + 0.18 * r}, ${1 + 0.65 * r})`,
                    }}
                  />
                );
              })}
              <Crop
                box={CTA}
                feather={9}
                borderRadius={999}
                glowIntensity={0.6 + beat * 0.4}
                opacity={clamp01(pBottom)}
                transform={`scale(${1 + 0.038 * beat + 0.02 * wave(frame, 0, 3)})`}
                shine={shineAt(frame, 15, 24, 60)}
              />
            </>
          );
        })()}

        {/* 4 Bottom Feature Icons: Energetic Wave Bounce + Beat Sync */}
        {ICONS.map((box, i) => {
          const pop = spring({
            frame: frame - (78 + i * 7),
            fps,
            config: {damping: 11, stiffness: 140},
          });
          const entranceScale = interpolate(pop, [0, 1], [1.35, 1]);
          const dy = wave(frame, i / 4, 3) * -7;
          const sc =
            entranceScale * (1 + 0.05 * breath(frame, i / 4) + beat * 0.03);
          return (
            <Crop
              key={i}
              box={box}
              feather={7}
              opacity={clamp01(pop)}
              transform={`translateY(${dy}px) scale(${sc})`}
              shine={shineAt(frame, 85 + i * 15, 22, 80)}
            />
          );
        })}

        {/* Website Pill with Neon Pulse */}
        <Crop
          box={WEBSITE}
          feather={7}
          borderRadius={20}
          glowIntensity={0.4 + beat * 0.4}
          opacity={clamp01(pBottom)}
          transform={`scale(${1 + 0.035 * breath(frame, 0.5) + beat * 0.025})`}
          shine={shineAt(frame, 40, 26, 75)}
        />
      </AbsoluteFill>

      {/* Top Layer: Cyber HUD Corner Brackets & Laser Scanline */}
      <CyberHUDOverlay beat={beat} />
    </AbsoluteFill>
  );
};
