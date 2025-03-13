import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {View} from 'react-native';

type loadingPostProps = {};

const CommentLoader = (props: loadingPostProps) => {
  const theme = useAppTheme();
  const {} = props;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        paddingTop: 15,
        paddingHorizontal: 15,
      }}>
      <ContentLoader
        height={500}
        speed={1.5}
        backgroundColor={theme.colors.background3}
        foregroundColor={theme.colors.background2}>
        {/* Only SVG shapes */}
        <Circle x="0" y="0" cx="16" cy="16" r="16" />
        <Rect x="50" y="0" rx="20" ry="20" width={250} height="50" />

        <Circle x="0" y="80" cx="16" cy="16" r="16" />
        <Rect x="50" y="80" rx="20" ry="20" width={160} height="50" />

        <Circle x="0" y="160" cx="16" cy="16" r="16" />
        <Rect x="50" y="160" rx="20" ry="20" width={210} height="50" />
      </ContentLoader>
    </View>
  );
};

export default CommentLoader;
