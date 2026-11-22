import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {HUD} from '../components/HUD';
import {KineticText} from '../components/KineticText';
import {Waveform, useSafeAudioSpectrum} from '../components/Waveform';
import {FONTS, PALETTE, TEXT_CONTENT} from '../config';

/**
 * Scene 04 (9–12 detik): Garis oranye bergelombang seperti waveform bersinar,
 * teks kecil di atasnya + tipografi kinetik.
 */
export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {beatPulse} = useSafeAudioSpectrum(32);

  const exitGlitch =
    frame >= durationInFrames - 3
      ? (random(`s4-g-${frame}`) - 0.5) * 36
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.darkBg,
        transform: `translateX(${exitGlitch}px)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      {/* Small Monospace Label Above Glowing Waveform */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: 7,
          color: PALETTE.gray,
          marginBottom: 28,
        }}
      >
        {TEXT_CONTENT.scene04.smallTopText}
      </div>

      {/* Glowing Orange Wavy Waveform */}
      <Waveform
        mode="line"
        color={PALETTE.neonOrange}
        secondaryColor={PALETTE.orangeSoft}
        width={920}
        height={320}
        barCount={32}
        glow
      />

      {/* Kinetic Typography Below Waveform */}
      <div style={{marginTop: 72, width: '100%'}}>
        <KineticText
          words={[...TEXT_CONTENT.scene04.words]}
          startFrame={10}
          staggerFrames={6}
          fontSize={124}
          baseColor={PALETTE.white}
          accentColor={PALETTE.neonOrange}
          accentKeywords={['PULSE', 'MACHINE']}
          glowColor={PALETTE.neonOrange}
          beatPulse={beatPulse}
          layout="stack"
        />
      </div>

      <HUD
        sceneCode={TEXT_CONTENT.scene04.code}
        statusText="OSCILLATOR // HARMONIC_SYNC"
        beatPulse={beatPulse}
      />
    </AbsoluteFill>
  );
};
