/**
 * @Project Summarised
 * @File Screen.tsx
 * @Path app/components/layout
 * @Author BRICE ZELE
 * @Date 16/03/2023
 */

import {BackgroundColorShorthandProps, createBox} from '@shopify/restyle';
import React, {useMemo} from 'react';
import {
  NativeSafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Theme} from '../../themes/Theme';
import {BoxProps} from './Box';
import {StatusBar, View} from 'react-native';

const SafeAreaBox = createBox<Theme>(View);

type ScreenProps = BackgroundColorShorthandProps<Theme> &
  Omit<NativeSafeAreaViewProps, 'mode'> &
  BoxProps;

function SafeAreaWithInsets({
  children,
  edges,
  ...rest
}: ScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const safeAreaStyles = useMemo(() => {
    const style: {[key: string]: number} = {};
    // Default to all edges, use empty array for no edges.
    if (!edges) {
      return {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      };
    }
    if (edges?.includes('top')) {
      style.paddingTop = insets.top + 10;
    }
    if (edges?.includes('bottom')) {
      style.paddingBottom = insets.bottom;
    }
    if (edges?.includes('left')) {
      style.paddingLeft = insets.left;
    }
    if (edges?.includes('right')) {
      style.paddingRight = insets.right;
    }
    return style;
  }, [edges, insets]);

  return (
    <SafeAreaBox style={safeAreaStyles} {...rest}>
      <StatusBar backgroundColor={'transparent'} />
      {children}
    </SafeAreaBox>
  );
}

export function Screen({children, ...rest}: ScreenProps): JSX.Element {
  /* const darkMode = useDarkMode()

const progress = useDerivedValue(() => {
return withTiming(darkMode ? 1 : 0)
}, [darkMode])

const rStyle = useAnimatedStyle(() => {
const backgroundColor = interpolateColor(
   progress.value,
   [0, 1],
   [
       darkMode ? lightTheme.colors.background0 : darkTheme.colors.background0,
       !darkMode ? darkTheme.colors.background0 : lightTheme.colors.background0,
   ],
)

return {
   backgroundColor,
}
})*/

  return (
    <SafeAreaWithInsets flex={1} {...rest}>
      {/*<Animated.View style={[{flex: 1}, rStyle]}>{children}</Animated.View>*/}
      {children}
    </SafeAreaWithInsets>
  );
}
