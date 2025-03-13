import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {Settings} from '../../constants/Settings';
import {
  Animated,
  Dimensions,
  ImageBackground,
  ImageResizeMode,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';
import {Assets} from '../../constants/Assets';
import useDarkMode from 'app/hooks/theme/useDarkMode';

const {width, height} = Dimensions.get('screen');

interface AnimatedSplashProps {
  preload?: boolean;
  showLogo?: boolean;
  logoWidth?: number;
  logoHeight?: number;
  children?: ReactElement;
  useBackgroundImage?: boolean;
  backgroundImage?: ImageSourcePropType;
  backgroundImageResizeMode?: ImageResizeMode;
  isLoaded: boolean;
  translucent?: boolean;
  disableAppScale?: boolean;
  delay?: number;
  duration?: number;
  showStatusBar?: boolean;
}

const AnimatedSplash: React.FC<PropsWithChildren<AnimatedSplashProps>> = ({
  preload,
  logoWidth = Settings.logo.width,
  logoHeight = Settings.logo.height,
  children,
  backgroundImage = Assets.images.splashScreenBackground,
  backgroundImageResizeMode = 'cover',
  isLoaded = false,
  showLogo = true,
  useBackgroundImage = Settings.splashScreen,
  translucent,
  disableAppScale,
  delay,
  duration,
  showStatusBar = true,
}) => {
  const isDarkMode = useDarkMode();
  const logoImage = isDarkMode
    ? Assets.images.logoDarkTheme
    : Assets.images.logoLightTheme;

  const bgColor = isDarkMode ? '#000' : '#fff';

  const [animationDone, setAnimationDone] = useState(false);
  const [loadingProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isLoaded) {
      Animated.timing(loadingProgress, {
        toValue: 100,
        duration: duration || 1000,
        delay: delay || 0,
        useNativeDriver: true,
      }).start(() => {
        setAnimationDone(true);
      });
    }
  }, [isLoaded]);

  const renderChildren = (): JSX.Element | null => {
    if (preload || preload === null) {
      return <>{children}</>;
    }
    if (isLoaded) {
      return <>{children}</>;
    }
    return null;
  };

  const opacityClearToVisible = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 15, 30],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    }),
  };

  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 10, 100],
          outputRange: [1, 1, 65],
        }),
      },
    ],
  };

  const logoScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 10, 100],
          outputRange: [1, 0.8, 10],
        }),
      },
    ],
  };

  const logoOpacity: Record<
    string,
    Animated.AnimatedInterpolation<string | number>
  > = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 20, 100],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    }),
  };

  const appScale: Record<string, Record<string, any>> = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 7, 100],
          outputRange: [1.1, 1.05, 1],
        }),
      },
    ],
  };

  const staticBackgroundStyle = (
    opacity: StyleProp<ImageStyle>,
    bgColorParam: string,
  ): StyleProp<ImageStyle> | undefined => [
    opacity,
    StyleSheet.absoluteFill,
    {backgroundColor: bgColorParam},
  ];

  const dynamicImageBackgroundStyle = (
    scale: Record<string, Record<string, any>>,
    opacity: StyleProp<ViewStyle>,
  ): StyleProp<ViewStyle> => [
    scale,
    opacity,
    StyleSheet.absoluteFill,
    {
      width,
      height,
      top: 0,
      alignContent: 'center',
      justifyContent: 'center',
    },
  ];

  const dynamicLogoStyle = (
    scale: Record<string, Record<string, any>>,
    opacity: StyleProp<ImageStyle>,
    widthParam: number,
    heightParam: number,
  ): StyleProp<ImageStyle> => [
    scale,
    opacity,
    {
      width: widthParam || 150,
      height: heightParam || 150,
    },
  ];

  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
  const AnimatedBackgroundImage =
    Animated.createAnimatedComponent(ImageBackground);

  const renderContent = (
    <React.Fragment>
      <Animated.View
        style={[
          !disableAppScale && appScale,
          opacityClearToVisible,
          styles.container,
        ]}>
        {renderChildren()}
      </Animated.View>

      {!animationDone && !useBackgroundImage && (
        <Animated.View style={staticBackgroundStyle(logoOpacity, bgColor)} />
      )}

      {!animationDone && showLogo && (
        <View style={[StyleSheet.absoluteFill, styles.logoStyle]}>
          <AnimatedFastImage
            resizeMode="contain"
            source={logoImage}
            style={dynamicLogoStyle(
              logoScale,
              logoOpacity,
              logoWidth,
              logoHeight,
            )}
          />
        </View>
      )}
    </React.Fragment>
  );

  return (
    <View style={[styles.container]}>
      {showStatusBar && (
        <StatusBar
          animated
          backgroundColor={bgColor}
          translucent={translucent}
        />
      )}
      {!animationDone && <View style={StyleSheet.absoluteFill} />}
      <View style={styles.containerGlue}>
        {!animationDone && !useBackgroundImage && (
          <Animated.View style={staticBackgroundStyle(logoOpacity, bgColor)}>
            {renderContent}
          </Animated.View>
        )}
        <Animated.View
          style={[
            !disableAppScale && appScale,
            opacityClearToVisible,
            styles.container,
          ]}>
          {renderChildren()}
        </Animated.View>
        {!animationDone && useBackgroundImage && backgroundImage && (
          <AnimatedBackgroundImage
            resizeMode={backgroundImageResizeMode || 'cover'}
            source={backgroundImage}
            style={
              (staticBackgroundStyle(logoOpacity, bgColor),
              dynamicImageBackgroundStyle(imageScale, logoOpacity)) as any
            }>
            {renderContent}
          </AnimatedBackgroundImage>
        )}
      </View>
    </View>
  );
};

export default AnimatedSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGlue: {
    alignContent: 'center',
    flex: 3,
    justifyContent: 'center',
  },
  logoStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
