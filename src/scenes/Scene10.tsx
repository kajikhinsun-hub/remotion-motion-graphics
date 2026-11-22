import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {HUD} from '../components/HUD';
import {KineticText} from '../components/KineticText';
import {Waveform, useSafeAudioSpectrum} from '../components/Waveform';
import {
  FONTS,
  PALETTE,
  SCENE_TIMINGS,
  TEXT_CONTENT,
  VIDEO_CONFIG,
  secToFrame,
} from '../config';

/**
 * Scene 10 (24.4–38.23 detik / 415 frame):
 * - Karakter (`character.jpg`, 1260x2800) memenuhi frame 1080x1920 (`object-fit: cover`, `object-position: center 14%`)
 *   sehingga wajah, kepala berambut biru, dan mikrofon tampil utuh & tajam, sedangkan bagian bawah yang memudar putih menjadi area lirik.
 * - Masuk dengan scale 1.1 -> 1.0 + parallax halus, pulse kecil di tiap beat.
 * - Di belakang/sekitar karakter: waveform biru besar (`visualizeAudio`).
 * - Teks lirik navy tebal (`#1B2A6B`) muncul per kata di area bawah, aksen emas (`#D4AF6A`) pada kata kunci.
 * - HUD tipis biru-emas makin padat menuju akhir (31–38.2s).
 * - Zoom perlahan ke wajah dan mikrofon di 31–38s, lalu fade ke putih dan hitam di 37.5–38.2s.
 */
export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {beatPulse, amplitude} = useSafeAudioSpectrum(32);

  const sceneStartGlobalSec = SCENE_TIMINGS.scene10.startSec; // 24.4s
  const currentGlobalSec = sceneStartGlobalSec + frame / fps;

  // 1. Entrance scale (24.4s -> 26.5s: 1.1 -> 1.0), then slow zoom toward face & mic (31s -> 38s: 1.0 -> 1.14)
  const zoomToFaceStartFrame = secToFrame(31.0 - sceneStartGlobalSec, fps); // frame ~198
  const baseScale =
    frame < zoomToFaceStartFrame
      ? interpolate(frame, [0, 65], [1.1, 1.0], {
          easing: Easing.out(Easing.cubic),
          extrapolateRight: 'clamp',
        })
      : interpolate(
          frame,
          [zoomToFaceStartFrame, durationInFrames],
          [1.0, 1.14],
          {
            easing: Easing.inOut(Easing.quad),
            extrapolateRight: 'clamp',
          }
        );

  const beatScaleBoost = beatPulse * 0.016;
  const totalCharScale = baseScale + beatScaleBoost;

  // Parallax drift & focus shift toward face/mic in 31-38s
  const parallaxX = Math.sin(frame * 0.04) * 8;
  const parallaxY =
    frame < zoomToFaceStartFrame
      ? Math.cos(frame * 0.035) * 6
      : interpolate(frame, [zoomToFaceStartFrame, durationInFrames], [0, 42], {
          extrapolateRight: 'clamp',
        });

  const isHighDensityHUD = currentGlobalSec >= 31.0;

  // Active lyric phrase based on currentGlobalSec
  const activeLyric =
    TEXT_CONTENT.scene10.lyrics.find(
      (item) =>
        currentGlobalSec >= item.startSec && currentGlobalSec < item.endSec
    ) ?? TEXT_CONTENT.scene10.lyrics[TEXT_CONTENT.scene10.lyrics.length - 1];

  const lyricStartLocalFrame = secToFrame(
    activeLyric.startSec - sceneStartGlobalSec,
    fps
  );

  // Ending fade to white (37.5s -> 37.85s) then to black (37.85s -> 38.23s)
  const whiteFadeOpacity = interpolate(
    currentGlobalSec,
    [37.45, 37.82],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const blackFadeOpacity = interpolate(
    currentGlobalSec,
    [37.82, 38.2],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.lightBg, overflow: 'hidden'}}>
      {/* 1. Character Portrait Layer (Full Frame 1080x1920, Focused on Head & Microphone) */}
      <AbsoluteFill
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${totalCharScale})`,
          transformOrigin: '50% 24%',
        }}
      >
        <Img
          src={staticFile(VIDEO_CONFIG.characterFile)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 14%',
          }}
        />
      </AbsoluteFill>

      {/* 2. Large Blue & Gold Audio Waveform Behind/Around Character Upper Body */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'center',
          mixBlendMode: 'multiply',
          opacity: 0.78 + amplitude * 0.2,
          transform: `translate(${-parallaxX * 1.4}px, 0px)`,
          pointerEvents: 'none',
        }}
      >
        <Waveform
          mode="bars"
          color={PALETTE.electricBlue}
          secondaryColor={PALETTE.goldAccent}
          width={920}
          height={420}
          barCount={36}
          glow={false}
        />
      </div>

      {/* 3. White Fade Gradient at Lower 35% of Frame for High-Contrast Navy/Gold Lyrics */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 760,
          background: `linear-gradient(180deg, rgba(242,243,247,0) 0%, rgba(242,243,247,0.86) 34%, ${PALETTE.lightBg} 75%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 4. Thin Blue & Gold Technical HUD Overlays (Gets denser in 31-38.2s) */}
      <div
        style={{
          position: 'absolute',
          top: 145,
          left: 92,
          right: 92,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONTS.mono,
          fontSize: 16,
          letterSpacing: 3,
          color: PALETTE.deepNavy,
          pointerEvents: 'none',
        }}
      >
        <span>{TEXT_CONTENT.scene10.hudHeader}</span>
        <span style={{color: PALETTE.electricBlue, fontWeight: 700}}>
          {TEXT_CONTENT.scene10.hudSub}
        </span>
      </div>

      {isHighDensityHUD ? (
        <div
          style={{
            position: 'absolute',
            top: 1120,
            left: 92,
            right: 92,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1.5px solid ${PALETTE.goldAccent}`,
            borderBottom: `1.5px solid ${PALETTE.electricBlue}55`,
            padding: '10px 0',
            fontFamily: FONTS.mono,
            fontSize: 16,
            letterSpacing: 4,
            color: PALETTE.deepNavy,
          }}
        >
          <span>FOCUS_LOCK // MIC_CAPSULE_01</span>
          <span style={{color: PALETTE.goldAccent, fontWeight: 700}}>
            AMP {(amplitude * 100).toFixed(1)} dB
          </span>
        </div>
      ) : null}

      {/* 5. Bold Navy & Gold Word-by-Word Lyrics in Lower White Fade Area */}
      <div
        style={{
          position: 'absolute',
          bottom: 185,
          left: 80,
          right: 80,
          zIndex: 40,
        }}
      >
        <KineticText
          words={[...activeLyric.words]}
          startFrame={lyricStartLocalFrame}
          staggerFrames={4}
          fontSize={isHighDensityHUD ? 118 : 104}
          lineHeight={0.98}
          baseColor={PALETTE.deepNavy}
          accentColor={PALETTE.goldAccent}
          accentKeywords={[...activeLyric.goldKeywords]}
          glowColor={PALETTE.goldAccent}
          beatPulse={beatPulse}
          layout="wrap"
          align="center"
          chromaticAberration={false}
        />
      </div>

      <HUD
        sceneCode={TEXT_CONTENT.scene10.code}
        statusText={
          isHighDensityHUD
            ? 'OVERDRIVE // HARMONIC_CLIMAX'
            : 'VOCAL_STREAM // ACTIVE'
        }
        theme="light"
        density={isHighDensityHUD ? 'high' : 'normal'}
        beatPulse={beatPulse}
      />

      {/* 6. Ending Fade to White then Black (37.5s - 38.2s) */}
      {whiteFadeOpacity > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: PALETTE.white,
            opacity: whiteFadeOpacity,
            zIndex: 95,
          }}
        />
      ) : null}
      {blackFadeOpacity > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: '#000000',
            opacity: blackFadeOpacity,
            zIndex: 96,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
