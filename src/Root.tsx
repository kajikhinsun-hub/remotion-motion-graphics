import React from 'react';
import {Composition} from 'remotion';
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
          audioUrls: {},
        } satisfies MainVideoProps}
      />
    </>
  );
};
