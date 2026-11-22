import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONTS, PALETTE, VIDEO_CONFIG} from '../config';

/**
 * Minimalist Wireframe Grid & Corner HUD Decorations (`src/components/HUD.tsx`)
 * Menjaga margin aman 80px untuk layout vertikal 1080x1920.
 */
export const HUD: React.FC<{
  sceneCode: string;
  statusText?: string;
  theme?: 'dark' | 'light';
  density?: 'normal' | 'high';
  beatPulse?: number;
}> = ({
  sceneCode,
  statusText = 'SYNC // ACTIVE',
  theme = 'dark',
  density = 'normal',
  beatPulse = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 110},
  });

  const primaryColor =
    theme === 'dark' ? PALETTE.neonOrange : PALETTE.electricBlue;
  const secondaryColor =
    theme === 'dark' ? PALETTE.gray : PALETTE.deepNavy;
  const accentColor =
    theme === 'dark' ? PALETTE.white : PALETTE.goldAccent;

  const m = VIDEO_CONFIG.safeMargin; // 80px safe margin
  const timecodeSec = (frame / fps).toFixed(2).padStart(5, '0');

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 70}}>
      {/* Thin Wireframe Guide Lines at 80px Safe Margins */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* Top & Bottom Horizontal Hairlines */}
        <line
          x1={m}
          y1={m + 44}
          x2={1080 - m}
          y2={m + 44}
          stroke={primaryColor}
          strokeWidth={1}
          opacity={0.32}
        />
        <line
          x1={m}
          y1={1920 - m - 44}
          x2={1080 - m}
          y2={1920 - m - 44}
          stroke={primaryColor}
          strokeWidth={1}
          opacity={0.32}
        />

        {/* Corner Brackets (80px Safe Margin) */}
        {[
          {x: m, y: m, dx: 28, dy: 28},
          {x: 1080 - m, y: m, dx: -28, dy: 28},
          {x: m, y: 1920 - m, dx: 28, dy: -28},
          {x: 1080 - m, y: 1920 - m, dx: -28, dy: -28},
        ].map((c, idx) => (
          <g key={idx}>
            <line
              x1={c.x}
              y1={c.y}
              x2={c.x + c.dx}
              y2={c.y}
              stroke={accentColor}
              strokeWidth={2.5}
              opacity={0.85}
            />
            <line
              x1={c.x}
              y1={c.y}
              x2={c.x}
              y2={c.y + c.dy}
              stroke={accentColor}
              strokeWidth={2.5}
              opacity={0.85}
            />
          </g>
        ))}

        {/* Extra Dense HUD Telemetry Reticles & Side Ticks (for Scene 10 climax) */}
        {density === 'high' ? (
          <g opacity={0.75}>
            {Array.from({length: 14}).map((_, i) => {
              const ty = 320 + i * 90;
              const active = (Math.floor(frame / 3) + i) % 4 === 0;
              return (
                <g key={i}>
                  <line
                    x1={m}
                    y1={ty}
                    x2={m + (active ? 22 : 10)}
                    y2={ty}
                    stroke={active ? PALETTE.goldAccent : primaryColor}
                    strokeWidth={active ? 2.5 : 1.2}
                  />
                  <line
                    x1={1080 - m}
                    y1={ty}
                    x2={1080 - m - (active ? 22 : 10)}
                    y2={ty}
                    stroke={active ? PALETTE.goldAccent : primaryColor}
                    strokeWidth={active ? 2.5 : 1.2}
                  />
                </g>
              );
            })}
            {/* Target Reticle Box near Microphone / Upper Center */}
            <rect
              x={m + 24}
              y={170}
              width={1080 - (m + 24) * 2}
              height={980}
              fill="none"
              stroke={PALETTE.goldAccent}
              strokeWidth={1.2}
              strokeDasharray="12 18"
              opacity={0.55 + beatPulse * 0.4}
            />
          </g>
        ) : null}
      </svg>

      {/* Top HUD Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: m + 10,
          left: m + 12,
          right: m + 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: FONTS.mono,
          fontSize: 18,
          letterSpacing: 3,
          color: secondaryColor,
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [-10, 0])}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: primaryColor,
              boxShadow: `0 0 ${10 + beatPulse * 14}px ${primaryColor}`,
              display: 'inline-block',
            }}
          />
          <span style={{color: primaryColor, fontWeight: 700}}>{sceneCode}</span>
        </div>
        <div style={{color: accentColor, fontWeight: 600}}>
          FRM {String(frame).padStart(4, '0')} // {timecodeSec}S
        </div>
      </div>

      {/* Bottom HUD Telemetry Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: m + 10,
          left: m + 12,
          right: m + 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: FONTS.mono,
          fontSize: 16,
          letterSpacing: 3,
          color: secondaryColor,
          opacity: 0.85,
        }}
      >
        <span>{statusText}</span>
        <span style={{color: primaryColor}}>
          BPM_PULSE [{Math.round(beatPulse * 100)}%]
        </span>
      </div>
    </AbsoluteFill>
  );
};
