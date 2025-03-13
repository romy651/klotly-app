/**
 * @Project Summarised
 * @File Button.tsx
 * @Path app/components/core/Button
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import {Flex} from 'app/components/layout/Flex';
import React, {memo, PropsWithChildren} from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
  SvgProps,
} from 'react-native-svg';
import {useAppTheme} from '../../../hooks/theme/useAppTheme';
import {withAnimated} from '../../../hooks/anim/withAnimated';
import {getButtonProperties} from './utils';
import {TouchableArea} from './TouchableArea';
import {opacify} from '../../../utils/colorsUtils';
import {Text} from '../Text/Text';
import {ActivityIndicator, TouchableOpacityProps} from 'react-native';
import {Theme} from '../../../themes/Theme';
import {trigger} from 'react-native-haptic-feedback';
import {HapticFeedbackTypes} from 'react-native-haptic-feedback/src/types';

export enum ButtonSize {
  Small = 'small',

  Medium = 'medium',

  Large = 'large',
}

// ts-ignore
export enum ButtonEmphasis {
  Primary = 'primary',

  Secondary = 'secondary',

  Tertiary = 'tertiary',

  Detrimental = 'detrimental',

  Outline = 'outline',

  Warning = 'warning',

  Background = 'background',
}

interface ButtonProps extends TouchableOpacityProps {
  size?: ButtonSize;
  /** this is the preferred way of passing in an icon. It is just the name of the SVG file */
  IconName?: React.FC<SvgProps>;
  /** in the event that a custom icon is necessary this prop can be used instead of the IconName */
  CustomIcon?: JSX.Element;
  backgroundColor?: keyof Theme['colors'];
  loading?: boolean;
  emphasis?: ButtonEmphasis;
  disabled?: boolean;
  scale?: boolean;
  fill?: boolean; // flex=1
  allowFontScaling?: boolean;
  hapticFeedback?: boolean;
  hapticTypes?: HapticFeedbackTypes;
  onPress?: () => void;
  onPressIn?: () => void;
  onLongPress?: () => void;
}

const _Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  CustomIcon,
  IconName,
  allowFontScaling,
  disabled = false,
  backgroundColor,
  scale = true,
  emphasis = ButtonEmphasis.Primary,
  children,
  fill,
  hapticFeedback = true,
  hapticTypes,
  loading,
  onLongPress,
  onPress,
  onPressIn,
  size = ButtonSize.Medium,
  ...rest
}): JSX.Element => {
  const theme = useAppTheme();

  const {
    textColor,
    textVariant,
    paddingX,
    paddingY,
    borderRadius,
    borderColor,
    iconPadding,
    iconSize,
  } = getButtonProperties(emphasis, size);
  const bgColor =
    backgroundColor ?? getButtonProperties(emphasis, size).backgroundColor;

  const onPressHandler = async (): Promise<void> => {
    if (!onPress) {
      return;
    }

    if (hapticFeedback) {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      trigger(hapticTypes ?? 'impactLight', options);
    }
    onPress();
  };

  const icon = IconName ? (
    <IconName
      color={theme.colors[textColor]}
      height={theme.iconSizes[iconSize]}
      strokeWidth={2}
      width={theme.iconSizes[iconSize]}
    />
  ) : (
    CustomIcon ?? null
  );

  return (
    <TouchableArea
      alignItems="center"
      backgroundColor={bgColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
      borderWidth={1}
      disabled={disabled || loading}
      flex={fill ? 1 : undefined}
      flexGrow={1}
      opacity={!disabled ? 1 : 0.4}
      scale={scale}
      scaleTo={1.05}
      onLongPress={onLongPress}
      onPress={onPressHandler}
      onPressIn={onPressIn}
      {...rest}>
      {/* Absolutely positioned at -1 so because the button has 1 px border that needs to be covered by the gradient. */}
      {emphasis === ButtonEmphasis.Primary ? (
        <Flex
          borderRadius={borderRadius}
          height="100%"
          overflow="hidden"
          position="absolute"
          width="100%">
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="background" x1="0%" x2="0%" y1="0%" y2="100%">
                <Stop offset="0" stopColor={bgColor} stopOpacity="1" />
                <Stop
                  offset="1"
                  stopColor={opacify(12, bgColor)}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
            <Rect
              fill="url(#background)"
              height="150%"
              opacity={1}
              width="100%"
              x="0"
              y="0"
            />
          </Svg>
        </Flex>
      ) : null}
      <Flex centered row gap={iconPadding} px={paddingX} py={paddingY}>
        {loading && <ActivityIndicator color={'white'} size="small" />}
        {icon}
        {!loading && (
          <Text
            allowFontScaling={allowFontScaling}
            color={textColor}
            textAlign="center"
            variant={textVariant}>
            {children}
          </Text>
        )}
      </Flex>
    </TouchableArea>
  );
};

/**
 * Standard design system Button. By default emphasis is Primary and size is Medium.
 * The Figma designs will have the emphasis and size as part of the component properties.
 * If the Figma design has a button that looks similar to one of the variants but is not exactly the same please flag to designers before creating a button different from this one.
 *
 * This button handles Label + Icon, Label only, and Icon only. Pass the relevant props and it will handle the rendering for each case.
 */
export const Button = memo(_Button);

export const AnimatedButton = withAnimated(Button);
