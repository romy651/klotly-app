import {AnimatedFlex} from 'app/components/layout/Flex';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import * as React from 'react';
import {ColorValue, StyleProp, ViewStyle} from 'react-native';

import {StyleSheet} from 'react-native';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export interface CircularActivityIndicatorProps {
  color: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const CircularActivityIndicator = ({
  color,
  size = 24,
  style,
}: CircularActivityIndicatorProps) => {
  const _spinValue = useSharedValue<number>(0);
  const {circle} = styles({color});
  const theme = useAppTheme();

  React.useEffect(() => {
    'worklet';
    _spinValue.value = withRepeat(
      withTiming(1, {duration: 600, easing: Easing.linear}),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _styles = useAnimatedStyle(() => {
    const rotate = interpolate(_spinValue.value, [0, 1], [0, 360]);
    return {
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  return (
    <AnimatedFlex
      style={[
        _styles,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderBottomColor: theme.colors.background2,
        },
        circle,
        style,
      ]}
      testID="CircularActivityIndicator"
    />
  );
};

const styles = ({color}: {color: ColorValue}) =>
  StyleSheet.create({
    circle: {
      borderLeftColor: color,
      borderRightColor: color,
      borderTopColor: color,
      borderWidth: 1.5,
    },
  });
