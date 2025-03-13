/**
 * @Project Summarised
 * @File Tag.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 21/06/2023
 */
import {Text, TextProps} from './Text/Text'
import React, {PropsWithChildren} from 'react'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {StyleSheet} from 'react-native'
import {BaseButtonProps, TouchableArea} from './Button/TouchableArea'
import {FontWeight, TextVariants} from '../../themes/Font'
import {theme} from '../../themes/Theme'

type TagBaseProps = {
    textProps?: TextProps
    icon?: JSX.Element
    iconRight?: JSX.Element
    primary?: boolean
    primaryIcon?: boolean
    outline?: boolean
    outlineIcon?: boolean
    outlineSecondary?: boolean
    outlineSecondaryIcon?: boolean
    small?: boolean
    light?: boolean
    gray?: boolean
    chip?: boolean
    rate?: boolean
    rateSmall?: boolean
    status?: boolean
    sale?: boolean
}

export type TagProps = BaseButtonProps & TagBaseProps

const Tag: React.FC<PropsWithChildren<TagProps>> = ({
    style = {},
    textProps,
    icon = null,
    iconRight = null,
    primary = false,
    primaryIcon = false,
    outline = false,
    outlineIcon = false,
    outlineSecondary = false,
    outlineSecondaryIcon = false,
    small = false,
    light = false,
    gray = false,
    chip = false,
    status = false,
    rate = false,
    rateSmall = false,
    sale = false,
    children,
    ...props
}): JSX.Element => {
    const theme = useAppTheme()

    return (
        <TouchableArea
            {...props}
            scale={false}
            style={StyleSheet.flatten([
                styles.default,
                primary && [styles.primary, {backgroundColor: theme.colors.translucentBackground}],
                primaryIcon && styles.primary,
                outline && [
                    styles.outline,
                    {
                        borderColor: theme.colors.userThemeColor,
                        backgroundColor: theme.colors.translucentBackgroundBackdrop,
                    },
                ],
                outlineIcon && styles.outline,
                outlineSecondary && styles.outlineSecondary,
                outlineSecondaryIcon && [
                    styles.outlineSecondary,
                    {borderColor: theme.colors.accentAction},
                ],
                small && [styles.small, {backgroundColor: theme.colors.userThemeColor}],
                light && [styles.light, {backgroundColor: theme.colors.userThemeColor}],
                gray && styles.gray,
                chip && [
                    styles.chip,
                    {
                        backgroundColor: theme.colors.translucentBackgroundBackdrop,
                        borderColor: theme.colors.accentAction,
                    },
                ],
                status && [styles.status, {backgroundColor: theme.colors.userThemeColor}],
                rate && [styles.rate, {backgroundColor: theme.colors.userThemeColor}],
                rateSmall && [styles.rateSmall, {backgroundColor: theme.colors.accentAction}],
                sale && [styles.sale, {backgroundColor: theme.colors.accentAction}],
                iconRight && [styles.iconRight, {borderColor: theme.colors.textPrimary}],
                style,
            ])}>
            {icon ? icon : null}
            <Text
                style={StyleSheet.flatten([
                    primary && styles.textPrimary,
                    primaryIcon && styles.textPrimary,
                    outline && [styles.textOutline, {color: theme.colors.userThemeColor}],
                    outlineIcon && [styles.textOutline, {color: theme.colors.userThemeColor}],
                    outlineSecondary && [
                        styles.textOutlineSecondary,
                        {color: theme.colors.accentActive},
                    ],
                    outlineSecondaryIcon && [
                        styles.textOutlineSecondary,
                        {color: theme.colors.accentActive},
                    ],
                    small && styles.textSmall,
                    light && [styles.textLight, {color: theme.colors.accentAction}],
                    gray && styles.textGray,
                    chip && [styles.textChip, {color: theme.colors.accentActive}],
                    status && styles.textStatus,
                    rate && styles.textRate,
                    rateSmall && styles.textRateSmall,
                    sale && styles.textSale,
                    iconRight && styles.textIconRight,
                ])}
                variant="bodyMicro"
                {...textProps}>
                {children}
            </Text>
        </TouchableArea>
    )
}

export default Tag
const styles = StyleSheet.create({
    chip: {
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    default: {
        flexDirection: 'row',
    },
    gray: {
        alignItems: 'center',
        backgroundColor: theme.colors.background2,
        borderColor: theme.colors.background2,
        justifyContent: 'center',
        padding: 5,
    },
    iconRight: {
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    light: {
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        padding: 5,
    },
    outline: {
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 17,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    outlineSecondary: {
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 17,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    primary: {
        alignItems: 'center',
        borderRadius: 16,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    rate: {
        alignItems: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    rateSmall: {
        alignItems: 'center',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 4,
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    sale: {
        alignItems: 'center',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        width: 50,
    },
    small: {
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    status: {
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    textChip: TextVariants.bodyMicro,
    textGray: StyleSheet.flatten([TextVariants.bodyMicro]),
    textIconRight: StyleSheet.flatten([TextVariants.bodyMicro]),
    textLight: TextVariants.bodyMicro,
    textOutline: TextVariants.bodyMicro,

    textOutlineSecondary: TextVariants.bodyMicro,
    textPrimary: StyleSheet.flatten([TextVariants.bodyMicro, {color: theme.colors.white}]),
    textRate: StyleSheet.flatten([
        TextVariants.bodyLarge,
        {color: theme.colors.white, fontWeight: FontWeight.bold},
    ]),
    textRateSmall: StyleSheet.flatten([
        TextVariants.bodyMicro,
        {color: theme.colors.white, fontWeight: FontWeight.bold},
    ]),
    textSale: StyleSheet.flatten([
        TextVariants.bodyLarge,
        {color: theme.colors.white, fontWeight: FontWeight.bold},
    ]),
    textSmall: StyleSheet.flatten([TextVariants.bodyMicro, {color: theme.colors.white}]),
    textStatus: StyleSheet.flatten([
        TextVariants.bodyMicro,
        {color: theme.colors.white, fontWeight: FontWeight.bold},
    ]),
})
