/**
 * @Project Summarised
 * @File TextInput.tsx
 * @Path app/components/core/Input
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {
  backgroundColor,
  BackgroundColorProps,
  BackgroundColorShorthandProps,
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  spacingShorthand,
  SpacingShorthandProps,
  typography,
  TypographyProps,
  useRestyle,
  useTheme,
} from '@shopify/restyle';
import {Theme} from 'app/themes/Theme';
import React, {cloneElement, forwardRef, useState} from 'react';
import {I18nManager, TextInputProps as BaseTextInputProps} from 'react-native';
import {Flex} from '../../layout/Flex';
import {Text} from '../Text/Text';
import {TextInput as TextInputBase} from 'react-native';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';

const restyleFunctions = [
  layout,
  typography,
  spacing,
  spacingShorthand,
  border,
  backgroundColor,
  color,
];

type CustomTextInputProps = {
  success?: boolean;
  icon?: JSX.Element;
  error?: string;
  outline?: boolean;
};

type RestyleProps = TypographyProps<Theme> &
  SpacingProps<Theme> &
  SpacingShorthandProps<Theme> &
  LayoutProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  BackgroundColorShorthandProps<Theme> &
  ColorProps<Theme> &
  CustomTextInputProps;

export type TextInputProps = RestyleProps & BaseTextInputProps;

const TextInput = forwardRef<TextInputBase, TextInputProps>(
  (
    {
      onChangeText,
      success,
      icon,
      error,
      secureTextEntry,
      autoCapitalize,
      multiline,
      outline,
      maxLength,
      numberOfLines,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme<Theme>();
    const _theme = useAppTheme();
    const [focus, setFocus] = useState<boolean>(false);

    // Set defaults for style values
    rest.backgroundColor ??= outline ? 'none' : 'background1';
    rest.px ??= 'spacing16';
    rest.py ??= 'spacing12';
    rest.color ??= !error ? 'textPrimary' : 'accentCritical';
    rest.borderRadius ??= 'rounded12';
    rest.flex ??= 1;
    rest.height ??= '100%';
    rest.textAlign ??= I18nManager.isRTL ? 'right' : 'left';

    // restyle doesn't parse placeholderTextColorCorrectly
    rest.placeholderTextColor ??= !error
      ? theme.colors.textTertiary
      : theme.colors.accentCritical;

    // const transformedProps = useRestyle(restyleFunctions, rest);

    return (
      <Flex
        row
        grow
        minHeight={multiline ? 100 : 45}
        flexDirection={'row'}
        alignItems={multiline ? 'flex-start' : 'center'}
        backgroundColor={outline ? 'none' : 'background1'}
        borderWidth={outline ? 1.2 : 0}
        borderColor={
          error ? 'accentCritical' : focus ? 'accentActive' : 'background3'
        }
        borderRadius={'rounded8'}
        justifyContent="space-between"
        paddingVertical={multiline ? 'spacing10' : 'none'}
        width="100%">
        {icon &&
          cloneElement(icon, {
            color: success
              ? theme.colors.userThemeColor
              : theme.colors.accentCritical,
          })}
        <TextInputBase
          ref={ref}
          onFocus={() => setFocus(true)}
          autoComplete="email"
          inputMode="email"
          placeholderTextColor={'gray'}
          style={{
            width: '100%',
            marginLeft: 10,
            color: _theme.colors.textPrimary,
          }}
          selectionColor={theme.colors.textTertiary}
          onBlur={() => setFocus(false)}
          secureTextEntry={secureTextEntry}
          value={rest.value}
          onChangeText={onChangeText}
          placeholder={rest.placeholder}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          numberOfLines={numberOfLines}
          multiline={multiline}
        />
        {error && !success && (
          <Flex alignSelf="flex-start" justifyContent="flex-start">
            <Text color="accentCritical" variant="bodyMicro">
              {error}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  },
);

export default TextInput;
