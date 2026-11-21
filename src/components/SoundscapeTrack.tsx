import React from 'react';
import {Audio, Sequence, interpolate} from 'remotion';

export interface SoundscapeUrls {
  ambientMusicUrl?: string;
  forestAmbienceUrl?: string;
  oceanAmbienceUrl?: string;
  windAmbienceUrl?: string;
  cinematicImpactUrl?: string;
  voiceovers?: {
    scene1Url?: string;
    scene2Url?: string;
    scene3Url?: string;
    scene4Url?: string;
    scene5Url?: string;
    scene6Url?: string;
  };
}

/**
 * Modular Soundscape & Narrator Voiceover Architecture synchronized to the 65-second (1950 frames @ 30fps) timeline:
 * - Cinematic ambient music bed (0-65s / frames 0-1950) with soft ducking so the narrator voice stands out clearly
 * - Natural forest ambience (Scene 2: 7-18s / frames 210-540)
 * - Ocean underwater ambience (Scene 3: 18-30s / frames 540-900)
 * - High-altitude wind ambience (Scene 4: 30-42s / frames 900-1260)
 * - Subtle cinematic impacts synchronized to every title reveal
 * - 6 Indonesian Documentary Narrator Voiceover tracks (id-ID-ArdiNeural) timed per scene
 */
export const SoundscapeTrack: React.FC<{audioUrls?: SoundscapeUrls}> = ({
  audioUrls,
}) => {
  if (!audioUrls) {
    return null;
  }

  // Exact frame cue points when main titles reveal across Scenes 1-6
  const impactFrames = [38, 228, 558, 918, 1270, 1682];

  // Narrator voiceover cue points per scene
  const voTracks = [
    {
      url: audioUrls.voiceovers?.scene1Url,
      from: 42,
      duration: 165,
      name: 'VO Scene 1: Opening',
    },
    {
      url: audioUrls.voiceovers?.scene2Url,
      from: 235,
      duration: 300,
      name: 'VO Scene 2: Hutan',
    },
    {
      url: audioUrls.voiceovers?.scene3Url,
      from: 565,
      duration: 330,
      name: 'VO Scene 3: Laut',
    },
    {
      url: audioUrls.voiceovers?.scene4Url,
      from: 925,
      duration: 330,
      name: 'VO Scene 4: Pegunungan',
    },
    {
      url: audioUrls.voiceovers?.scene5Url,
      from: 1285,
      duration: 360,
      name: 'VO Scene 5: Siklus Kehidupan',
    },
    {
      url: audioUrls.voiceovers?.scene6Url,
      from: 1680,
      duration: 240,
      name: 'VO Scene 6: Closing',
    },
  ];

  return (
    <>
      {/* 1. Continuous Cinematic Ambient Music Bed (0–65s, ducked to 0.34 so narrator VO is crystal clear) */}
      {audioUrls.ambientMusicUrl ? (
        <Sequence from={0} durationInFrames={1950} name="Audio: Cinematic Ambient Music">
          <Audio
            src={audioUrls.ambientMusicUrl}
            volume={(f) =>
              interpolate(f, [0, 60, 1860, 1950], [0, 0.34, 0.34, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        </Sequence>
      ) : null}

      {/* 2. Natural Forest Ambience (Scene 2: 7–18s) */}
      {audioUrls.forestAmbienceUrl ? (
        <Sequence from={195} durationInFrames={360} name="Audio: Natural Forest Ambience">
          <Audio
            src={audioUrls.forestAmbienceUrl}
            volume={(f) =>
              interpolate(f, [0, 30, 320, 360], [0, 0.28, 0.28, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        </Sequence>
      ) : null}

      {/* 3. Ocean Underwater Ambience (Scene 3: 18–30s) */}
      {audioUrls.oceanAmbienceUrl ? (
        <Sequence from={525} durationInFrames={390} name="Audio: Ocean Underwater Ambience">
          <Audio
            src={audioUrls.oceanAmbienceUrl}
            volume={(f) =>
              interpolate(f, [0, 30, 350, 390], [0, 0.32, 0.32, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        </Sequence>
      ) : null}

      {/* 4. Mountain Wind Ambience (Scene 4: 30–42s) */}
      {audioUrls.windAmbienceUrl ? (
        <Sequence from={885} durationInFrames={390} name="Audio: Mountain Wind Ambience">
          <Audio
            src={audioUrls.windAmbienceUrl}
            volume={(f) =>
              interpolate(f, [0, 30, 350, 390], [0, 0.28, 0.28, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        </Sequence>
      ) : null}

      {/* 5. Subtle Cinematic Impacts on Hero Title Reveals */}
      {audioUrls.cinematicImpactUrl
        ? impactFrames.map((cueFrame, idx) => (
            <Sequence
              key={`impact-${idx}`}
              from={cueFrame}
              durationInFrames={90}
              name={`Audio: Cinematic Title Impact #${idx + 1}`}
            >
              <Audio src={audioUrls.cinematicImpactUrl!} volume={0.45} />
            </Sequence>
          ))
        : null}

      {/* 6. Documentary Narrator Voiceover Tracks (Bahasa Indonesia) */}
      {voTracks.map((vo, idx) =>
        vo.url ? (
          <Sequence
            key={`vo-${idx}`}
            from={vo.from}
            durationInFrames={vo.duration}
            name={vo.name}
          >
            <Audio src={vo.url} volume={1.0} />
          </Sequence>
        ) : null
      )}
    </>
  );
};
