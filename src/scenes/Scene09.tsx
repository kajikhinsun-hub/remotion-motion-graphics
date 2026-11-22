import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONTS, PALETTE, TEXT_CONTENT, VIDEO_CONFIG} from '../config';

/**
 * Scene 09 (23.89–24.4 detik / ~15 frame):
 * Flash putih penuh tepat di beat 23.89, lalu karakter mulai muncul dari putih.
 */
export const Scene09: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Character emerges from pure white in the second half of the flash
  const charOpacity = interpolate(
    frame,
    [4, durationInFrames],
    [0, 0.85],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const flashOverlayOpacity = interpolate(
    frame,
    [0, 5, durationInFrames],
    [1, 0.95, 0.15],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.white, overflow: 'hidden'}}>
      {/* Character Emerging from White */}
      <Img
        src={staticFile(VIDEO_CONFIG.characterFile)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 15%',
          opacity: charOpacity,
          transform: `scale(${interpolate(frame, [0, durationInFrames], [1.14, 1.1])})`,
        }}
      />

      {/* Blinding White Beat Flash Layer */}
      <AbsoluteFill
        style={{
          backgroundColor: PALETTE.white,
          opacity: flashOverlayOpacity,
        }}
      />

      {/* Brief Technical Flash Stamp */}
      <div
        style={{
          position: 'absolute',
          top: 920,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONTS.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 10,
          color: PALETTE.electricBlue,
          opacity: interpolate(frame, [2, durationInFrames], [0.9, 0]),
        }}
      >
        {TEXT_CONTENT.scene09.label}
      </div>
    </AbsoluteFill>
  );
};
