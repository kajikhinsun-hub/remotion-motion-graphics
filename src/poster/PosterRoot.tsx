import React from 'react';
import {Composition} from 'remotion';
import {PosterAnimation} from './PosterAnimation';

export const PosterRoot: React.FC = () => {
  return (
    <Composition
      id="PosterAnimation"
      component={PosterAnimation}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1350}
    />
  );
};
