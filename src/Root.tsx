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
            voiceovers: {
              scene1Url: staticFile('audio/vo/vo-scene1.mp3'),
              scene2Url: staticFile('audio/vo/vo-scene2.mp3'),
              scene3Url: staticFile('audio/vo/vo-scene3.mp3'),
              scene4Url: staticFile('audio/vo/vo-scene4.mp3'),
              scene5Url: staticFile('audio/vo/vo-scene5.mp3'),
              scene6Url: staticFile('audio/vo/vo-scene6.mp3'),
            },
          },
        } satisfies MainVideoProps}
      />
    </>
  );
};
