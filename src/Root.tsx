import React from 'react';
import {Composition} from 'remotion';
import {MainVideo, MainVideoProps} from './MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Motion Graphics Otomatis',
          subtitleText: 'Dirender dengan Remotion & GitHub Actions',
          accentColor: '#38bdf8',
        } satisfies MainVideoProps}
      />
    </>
  );
};
