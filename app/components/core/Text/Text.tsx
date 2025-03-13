/**
 * @Project Summarised
 * @File Text.tsx
 * @Path app/components/core
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import {createText} from '@shopify/restyle';
import React, {ComponentProps} from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from '../../../themes/Theme';

export const DEFAULT_FONT_SCALE = 1;

const ThemedText = createText<Theme>();

export type TextProps = ComponentProps<typeof ThemedText> & {
  allowFontScaling?: boolean;
};

export const Text: React.FC<TextProps> = ({
  allowFontScaling,
  ...rest
}): JSX.Element => {
  const {fontScale} = useWindowDimensions();
  const enableFontScaling = allowFontScaling ?? fontScale > DEFAULT_FONT_SCALE;

  return <ThemedText allowFontScaling={enableFontScaling} {...rest} />;
};
