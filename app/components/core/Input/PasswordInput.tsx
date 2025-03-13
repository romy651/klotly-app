/**
 * @Project Summarised
 * @File PasswordInput.tsx
 * @Path app/components/core/Input
 * @Author BRICE ZELE
 * @Date 24/04/2023
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
} from '@shopify/restyle'
import {Theme} from 'app/themes/Theme'
import React, {cloneElement, forwardRef, useState} from 'react'
import {
    I18nManager,
    TextInput as TextInputBase,
    TextInputProps as BaseTextInputProps,
} from 'react-native'
import {Flex} from '../../layout/Flex'
import useDarkMode from '../../../hooks/theme/useDarkMode'
import {Text} from '../Text/Text'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const restyleFunctions = [
    layout,
    typography,
    spacing,
    spacingShorthand,
    border,
    backgroundColor,
    color,
]

type CustomTextInputProps = {
    success?: boolean
    icon?: JSX.Element
    error?: string
    outline?: boolean
}

type RestyleProps = TypographyProps<Theme> &
    SpacingProps<Theme> &
    SpacingShorthandProps<Theme> &
    LayoutProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    BackgroundColorShorthandProps<Theme> &
    ColorProps<Theme> &
    CustomTextInputProps

export type TextInputProps = RestyleProps & BaseTextInputProps

// eslint-disable-next-line react/display-name
const PasswordInput = forwardRef<TextInputBase, TextInputProps>(
    ({onChangeText, onBlur, success, icon, error, outline, ...rest}, ref) => {
        const theme = useTheme<Theme>()
        const isDarkMode = useDarkMode()
        const [secure, setSecure] = useState(true)

        // Set defaults for style values
        rest.backgroundColor ??= outline ? 'none' : 'background1'
        rest.px ??= 'spacing16'
        rest.py ??= 'spacing12'
        rest.color ??= !error ? 'textPrimary' : 'accentCritical'
        rest.borderRadius ??= 'rounded12'
        rest.flex ??= 1
        rest.height ??= '100%'
        rest.textAlign ??= I18nManager.isRTL ? 'right' : 'left'

        // restyle doesn't parse placeholderTextColorCorrectly
        rest.placeholderTextColor ??= !error
            ? theme.colors.textTertiary
            : theme.colors.accentCritical

        const transformedProps = useRestyle(restyleFunctions, rest)

        return (
            <Flex grow width="100%">
                <Flex
                    row
                    alignItems={rest.multiline ? 'flex-start' : 'center'}
                    backgroundColor={outline ? 'none' : 'background1'}
                    borderWidth={outline ? 1.2 : 0}
                    borderColor={error ? 'accentCritical' : 'backgroundScrim'}
                    borderRadius={'rounded4'}
                    justifyContent="space-between"
                    minHeight={56}
                    paddingHorizontal={'spacing10'}
                    paddingVertical={rest.multiline ? 'spacing12' : 'none'}
                    width="100%">
                    {icon &&
                        cloneElement(icon, {
                            color: success
                                ? theme.colors.userThemeColor
                                : theme.colors.accentCritical,
                        })}
                    <TextInputBase
                        ref={ref}
                        autoComplete="off"
                        keyboardAppearance={isDarkMode ? 'dark' : 'light'}
                        placeholderTextColor={
                            success ? theme.colors.textSecondary : theme.colors.accentCritical
                        }
                        secureTextEntry={secure}
                        selectionColor={theme.colors.textTertiary}
                        onBlur={onBlur}
                        onChangeText={onChangeText}
                        {...transformedProps}
                    />
                    <MatComIcon
                        color={!secure ? '#5065FD' : 'gray'}
                        style={{position: 'absolute', right: 10}}
                        name={!secure ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        onPress={(): void => setSecure(!secure)}
                    />
                </Flex>
                {error && !success && (
                    <Flex alignSelf="flex-start" justifyContent="flex-start" marginTop="spacing4">
                        <Text color="accentCritical" variant="bodySmall">
                            {error}
                        </Text>
                    </Flex>
                )}
            </Flex>
        )
    },
)

export default PasswordInput
