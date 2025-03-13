import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

const PostLoader = () => {
  const theme = useAppTheme();

  return (
    <ContentLoader
      speed={1.5}
      interval={0.1}
      backgroundColor={theme.colors.background2}
      foregroundColor={theme.colors.background0}
      width={SCREEN_WIDTH}
      height={260}
      viewBox={`0 0 ${SCREEN_WIDTH} ${260}`}>
      <Circle cx="31" cy="31" r="15" />
      <Rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
      <Rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
      <Rect
        x="5"
        y="60"
        rx="2"
        ry="2"
        width={`${SCREEN_WIDTH - 10}`}
        height="10"
      />
      <Rect
        x="5"
        y="80"
        rx="2"
        ry="2"
        width={`${SCREEN_WIDTH - 10}`}
        height="10"
      />
      <Rect
        x="0"
        y="100"
        rx="2"
        ry="2"
        width={`${SCREEN_WIDTH}`}
        height="200"
      />
    </ContentLoader>
  );
};

export default PostLoader;
