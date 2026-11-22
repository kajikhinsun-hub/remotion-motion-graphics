import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {VIDEO_CONFIG} from './config';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO_CONFIG.id}
        component={Video}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
