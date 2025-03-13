/**
 * @Project Summarised
 * @File AnimatedText.tsx
 * @Path app/components/core/Text
 * @Author BRICE ZELE
 * @Date 23/03/2023
 */
import {
    color,
    ColorProps,
    createRestyleComponent,
    createVariant,
    typography,
    TypographyProps,
    VariantProps,
} from '@shopify/restyle'
import React, {ComponentProps} from 'react'
import {
    TextInput,
    TextInputProps,
    TextProps as RNTextProps,
    useWindowDimensions,
} from 'react-native'
import Animated, {useAnimatedProps} from 'react-native-reanimated'
import {Theme} from '../../../themes/Theme'
import {DEFAULT_FONT_SCALE} from './Text'

// base animated text component using a TextInput
// forked from https://github.com/wcandillon/react-native-redash/blob/master/src/ReText.tsx
Animated.addWhitelistedNativeProps({text: true})

interface TextProps extends Omit<TextInputProps, 'value' | 'style'> {
    text: Animated.SharedValue<string>
    style?: Animated.AnimateProps<RNTextProps>['style']
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
export const BaseAnimatedText = (props: TextProps): JSX.Element => {
    const {style, text, ...rest} = props
    const animatedProps = useAnimatedProps(() => {
        return {
            text: text.value,
            // Here we use any because the text prop is not available in the type
        } as any
    })
    return (
        <AnimatedTextInput
            editable={false}
            style={[style || undefined]}
            underlineColorAndroid="transparent"
            value={text.value}
            {...rest}
            {...{animatedProps}}
        />
    )
}
// end of forked from https://github.com/wcandillon/react-native-redash/blob/master/src/ReText.tsx

// exposes restyle to base animated text
const StyledBaseAnimatedText = createRestyleComponent<
    VariantProps<Theme, 'textVariants'> &
        TypographyProps<Theme> &
        ColorProps<Theme> &
        React.ComponentProps<typeof BaseAnimatedText>,
    Theme
>([createVariant({themeKey: 'textVariants'}), typography, color], BaseAnimatedText)

// wrapped around restyled animated text with convenience props
export const AnimatedText: React.FC<ComponentProps<typeof StyledBaseAnimatedText>> = (
    props,
): JSX.Element => {
    const {fontScale} = useWindowDimensions()
    const enableFontScaling = fontScale > DEFAULT_FONT_SCALE

    return <StyledBaseAnimatedText {...props} allowFontScaling={enableFontScaling} />
}
