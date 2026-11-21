import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Ukuran poster asli (px) dan ukuran output video (4:5 portrait)
const SRC_W = 736;
const SRC_H = 920;
const OUT_W = 1080;
const OUT_H = 1350;
const S = OUT_W / SRC_W;
const LOOP = 300; // 10 detik @30fps — semua gerakan berulang mulus tiap LOOP frame
const GREEN = '#7ddc1a';
const POSTER = staticFile('images/poster.jpg');

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const seeded = (seed: number): number => {
  const v = Math.sin(seed * 9999.91) * 10000;
  return v - Math.floor(v);
};

// 0..1..0 sepanjang satu LOOP (loop mulus)
const breath = (frame: number, phase = 0): number =>
  0.5 - 0.5 * Math.cos(2 * Math.PI * (frame / LOOP + phase));

// -1..1, `cycles` harus bilangan bulat agar loop mulus
const wave = (frame: number, phase = 0, cycles = 1): number =>
  Math.sin(2 * Math.PI * (cycles * frame / LOOP + phase));

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

// Progres kilau (0..1) jika sedang aktif, selain itu null
const shineAt = (
  frame: number,
  start: number,
  dur: number,
  period = LOOP
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
}

// Menampilkan potongan poster asli pada posisi aslinya; tepinya dibuat lembut
// agar bisa digerakkan di atas poster dasar tanpa garis sambungan.
const Crop: React.FC<CropProps> = ({
  box,
  transform,
  opacity = 1,
  feather = 0,
  shine = null,
  origin = '50% 50%',
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
            top: '-10%',
            bottom: '-10%',
            width: '40%',
            left: `${interpolate(shine, [0, 1], [-50, 120])}%`,
            background:
              'linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)',
            transform: 'skewX(-18deg)',
          }}
        />
      ) : null}
    </div>
  );
};

// Cincin energi hijau yang memancar dari area controller
const EnergyRings: React.FC<{intro: number}> = ({intro}) => {
  const frame = useCurrentFrame();
  const cx = 543;
  const cy = 1022;
  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{position: 'absolute', inset: 0, opacity: intro}}
    >
      {[0, 1, 2].map((i) => {
        const p = ((frame + i * 33) % 100) / 100;
        const rx = interpolate(p, [0, 1], [170, 440]);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={rx * 0.19}
            fill="none"
            stroke={GREEN}
            strokeWidth={interpolate(p, [0, 1], [5, 1.5])}
            opacity={interpolate(p, [0, 0.15, 1], [0, 0.7, 0])}
          />
        );
      })}
    </svg>
  );
};

// Partikel hijau melayang (deterministik, loop mulus)
const Sparks: React.FC<{intro: number}> = ({intro}) => {
  const frame = useCurrentFrame();
  const items = React.useMemo(
    () =>
      Array.from({length: 46}).map((_, i) => {
        const s = 300 + i * 13;
        return {
          x: 80 + seeded(s) * 920,
          y: seeded(s + 1) * OUT_H,
          r: 2 + seeded(s + 2) * 4.5,
          laps: 1 + Math.floor(seeded(s + 3) * 2),
          wob: 8 + seeded(s + 4) * 22,
          cyc: 1 + Math.floor(seeded(s + 5) * 3),
          ph: seeded(s + 6) * Math.PI * 2,
          a: 0.22 + seeded(s + 7) * 0.45,
        };
      }),
    []
  );

  return (
    <svg
      width={OUT_W}
      height={OUT_H}
      style={{position: 'absolute', inset: 0, opacity: intro}}
    >
      {items.map((p, i) => {
        const y =
          (((p.y - (OUT_H * p.laps * frame) / LOOP) % OUT_H) + OUT_H) % OUT_H;
        const x =
          p.x + Math.sin(2 * Math.PI * p.cyc * (frame / LOOP) + p.ph) * p.wob;
        const tw =
          0.6 + 0.4 * Math.sin(2 * Math.PI * 2 * (frame / LOOP) + p.ph);
        return (
          <circle key={i} cx={x} cy={y} r={p.r} fill={GREEN} opacity={p.a * tw} />
        );
      })}
    </svg>
  );
};

const CARDS: Box[] = [
  {x: 94, y: 228, w: 178, h: 124}, // 3D Character Animation
  {x: 534, y: 368, w: 182, h: 148}, // Cinematic Animation
  {x: 40, y: 346, w: 160, h: 160}, // Environment Animation
  {x: 482, y: 526, w: 184, h: 158}, // 3D Modeling
  {x: 60, y: 514, w: 190, h: 132}, // Motion Graphics
  {x: 494, y: 224, w: 182, h: 146}, // Game Asset Animation
];

const ICONS: Box[] = [
  {x: 64, y: 728, w: 118, h: 68},
  {x: 246, y: 728, w: 116, h: 68},
  {x: 410, y: 728, w: 116, h: 68},
  {x: 574, y: 728, w: 116, h: 68},
];

const HEADER_TEXT: Box = {x: 30, y: 56, w: 690, h: 112};
const CTA: Box = {x: 112, y: 802, w: 514, h: 56};
const WEBSITE: Box = {x: 252, y: 862, w: 232, h: 44};

export const PosterAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = (delay: number) =>
    spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 90}});

  const pHeader = reveal(0);
  const pMid = reveal(8);
  const pBottom = reveal(20);

  const effects = clamp01((frame - 45) / 25);

  // Napas kamera: zoom halus ke arah karakter + geser tipis
  const camScale = 1 + 0.022 * breath(frame);
  const camX = wave(frame, 0, 1) * 4;

  const headerShine = shineAt(frame, 70, 45) ?? shineAt(frame, 200, 45);

  return (
    <AbsoluteFill style={{backgroundColor: '#f7f8f6', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translateX(${camX}px) scale(${camScale})`,
          transformOrigin: '50% 48%',
        }}
      >
        {/* Poster dasar, masuk bertahap per bagian */}
        <Crop
          box={{x: 0, y: 0, w: SRC_W, h: 216}}
          opacity={clamp01(pHeader)}
          transform={`translateY(${(1 - pHeader) * -60}px)`}
        />
        <Crop
          box={{x: 0, y: 215, w: SRC_W, h: 546}}
          opacity={clamp01(pMid)}
          transform={`translateY(${(1 - pMid) * 60}px)`}
        />
        <Crop
          box={{x: 0, y: 760, w: SRC_W, h: 160}}
          opacity={clamp01(pBottom)}
          transform={`translateY(${(1 - pBottom) * 80}px)`}
        />

        <EnergyRings intro={effects} />
        <Sparks intro={effects} />

        {/* Kartu layanan: mendarat, melayang, dan berkilau bergantian */}
        {CARDS.map((box, i) => {
          const pop = spring({
            frame: frame - (40 + i * 7),
            fps,
            config: {damping: 14, stiffness: 110},
          });
          const entranceScale = Math.max(1, interpolate(pop, [0, 1], [1.18, 1]));
          const ph = i / 6;
          const dir = i % 2 === 0 ? 1 : -1;
          const dy = wave(frame, ph, 1) * 5 * dir;
          const dx = wave(frame, ph + 0.25, 1) * 2.5;
          const rot = wave(frame, ph + 0.5, 1) * 0.7;
          const sc = entranceScale * (1 + 0.015 * breath(frame, ph));
          return (
            <Crop
              key={i}
              box={box}
              feather={12}
              opacity={clamp01(pop)}
              transform={`translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sc})`}
              shine={shineAt(frame, 70 + i * 22, 40)}
            />
          );
        })}

        {/* Teks judul: kilau menyapu */}
        <Crop
          box={HEADER_TEXT}
          feather={10}
          opacity={clamp01(pHeader)}
          transform={`scale(${1 + 0.012 * breath(frame)})`}
          shine={headerShine}
        />

        {/* Tombol CTA: denyut + gelombang hijau */}
        {(() => {
          const r = (frame % 100) / 100;
          const pulse = 0.5 - 0.5 * Math.cos(2 * Math.PI * 3 * (frame / LOOP));
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: CTA.x * S,
                  top: CTA.y * S,
                  width: CTA.w * S,
                  height: CTA.h * S,
                  borderRadius: 999,
                  border: `3px solid ${GREEN}`,
                  opacity: effects * (1 - r) * 0.7,
                  transform: `scale(${1 + 0.14 * r}, ${1 + 0.45 * r})`,
                }}
              />
              <Crop
                box={CTA}
                feather={10}
                opacity={clamp01(pBottom)}
                transform={`scale(${1 + 0.028 * pulse})`}
                shine={shineAt(frame, 20, 30, 100)}
              />
            </>
          );
        })()}

        {/* Empat ikon keunggulan: muncul bergantian lalu mengambang */}
        {ICONS.map((box, i) => {
          const pop = spring({
            frame: frame - (85 + i * 8),
            fps,
            config: {damping: 14, stiffness: 120},
          });
          const entranceScale = Math.max(1, interpolate(pop, [0, 1], [1.2, 1]));
          const dy = wave(frame, i / 4, 1) * 3;
          const sc = entranceScale * (1 + 0.04 * breath(frame, i / 4));
          return (
            <Crop
              key={i}
              box={box}
              feather={8}
              opacity={clamp01(pop)}
              transform={`translateY(${dy}px) scale(${sc})`}
            />
          );
        })}

        {/* Pil website */}
        <Crop
          box={WEBSITE}
          feather={8}
          opacity={clamp01(pBottom)}
          transform={`scale(${1 + 0.03 * breath(frame, 0.5)})`}
          shine={shineAt(frame, 60, 30, 150)}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
