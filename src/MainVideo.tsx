import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface MainVideoProps {
  titleText: string;
  subtitleText: string;
  accentColor: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({
  titleText,
  subtitleText,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Animasi masuk dengan spring physics
  const titleScale = spring({
    frame,
    fps,
    config: {damping: 12, stiffness: 120},
  });

  const subtitleSpring = spring({
    frame: frame - 18,
    fps,
    config: {damping: 14, stiffness: 100},
  });

  const lineProgress = spring({
    frame: frame - 10,
    fps,
    config: {damping: 20, stiffness: 80},
  });

  // Animasi rotasi bentuk geometris di background
  const rotation = interpolate(frame, [0, 150], [0, 180]);

  // Animasi fade out di akhir video (20 frame terakhir)
  const outroOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090d16',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#ffffff',
        opacity: outroOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Background Glow & Geometric Ring */}
      <div
        style={{
          position: 'absolute',
          width: 680,
          height: 680,
          borderRadius: 120,
          border: `3px solid ${accentColor}33`,
          transform: `rotate(${rotation}deg) scale(${titleScale})`,
          boxShadow: `0 0 120px ${accentColor}22`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: 90,
          border: `2px dashed ${accentColor}44`,
          transform: `rotate(${-rotation * 0.8}deg) scale(${titleScale})`,
        }}
      />

      {/* Konten Utama */}
      <div
        style={{
          zIndex: 1,
          textAlign: 'center',
          padding: '0 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 20,
            opacity: titleScale,
            transform: `translateY(${interpolate(titleScale, [0, 1], [-20, 0])}px)`,
          }}
        >
          REMOTION + GITHUB ACTIONS
        </div>

        <h1
          style={{
            fontSize: 88,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            transform: `scale(${titleScale})`,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          {titleText}
        </h1>

        {/* Garis Aksen Animasi */}
        <div
          style={{
            width: interpolate(lineProgress, [0, 1], [0, 360]),
            height: 6,
            backgroundColor: accentColor,
            borderRadius: 3,
            marginTop: 32,
            marginBottom: 32,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />

        <p
          style={{
            fontSize: 38,
            fontWeight: 500,
            color: '#94a3b8',
            margin: 0,
            opacity: interpolate(subtitleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          {subtitleText}
        </p>
      </div>
    </AbsoluteFill>
  );
};
