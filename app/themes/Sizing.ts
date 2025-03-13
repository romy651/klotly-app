/**
 * @Project Summarised
 * @File Sizing.ts
 * @Path app/themes
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */
import {Dimensions} from 'react-native'

export const dimensions = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width,
}

export const spacing = {
    none: 0,
    spacing1: 1,
    spacing2: 2,
    spacing4: 4,
    spacing6: 6,
    spacing8: 8,
    spacing10: 10,
    spacing12: 12,
    spacing14: 14,
    spacing16: 16,
    spacing18: 18,
    spacing20: 20,
    spacing24: 24,
    spacing36: 36,
    spacing48: 48,
    spacing60: 60,
    spacing70: 70,
    spacing80: 80,
    spacing90: 90,
}

export const iconSizes = {
    icon8: 8,
    icon12: 12,
    icon16: 16,
    icon20: 20,
    icon24: 24,
    icon28: 28,
    icon36: 36,
    icon40: 40,
    icon64: 64,
}

export const imageSizes = {
    image12: 12,
    image16: 16,
    image20: 20,
    image24: 24,
    image32: 32,
    image36: 36,
    image40: 40,
    image48: 48,
}

export const borderRadii = {
    none: 0,
    rounded4: 4,
    rounded8: 8,
    rounded12: 12,
    rounded16: 16,
    rounded20: 20,
    rounded24: 24,
    rounded32: 32,
    roundedFull: 999999,
}

// HitSlop allows users to slightly miss button
// To work, requires some padding in parent of button
export const defaultHitslop = 5
export const defaultHitslopInset = {
    top: defaultHitslop,
    bottom: defaultHitslop,
    left: defaultHitslop,
    right: defaultHitslop,
}
