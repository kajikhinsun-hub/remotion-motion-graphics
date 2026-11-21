import React from 'react';
import {Composition, staticFile} from 'remotion';
import {MainVideo, MainVideoProps} from './MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={1950}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          audioUrls: {
            ambientMusicUrl: staticFile('audio/ambient-music.wav'),
            forestAmbienceUrl: staticFile('audio/forest-ambience.wav'),
            oceanAmbienceUrl: staticFile('audio/ocean-ambience.wav'),
            windAmbienceUrl: staticFile('audio/wind-ambience.wav'),
            cinematicImpactUrl: staticFile('audio/impact.wav'),
          },
        } satisfies MainVideoProps}
      />
    </>
  );
};
