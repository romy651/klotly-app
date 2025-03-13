/**
 * @Project Summarised
 * @File ThemedGradient.tsx
 * @Path app/components/gradients
 * @Author BRICE ZELE
 * @Date 11/04/2023
 */

import React, {memo} from 'react'
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {Theme} from '../../themes/Theme'

interface Props {
    gradientStartColor: string
    gradientEndColor: string
    borderRadius?: keyof Theme['borderRadii']
    middleOut?: boolean
    opacity?: number
}

const _ThemedGradient: React.FC<Props> = ({
    gradientStartColor,
    gradientEndColor,
    borderRadius = 'none',
    middleOut = false,
    opacity = 0.25,
}): JSX.Element => {
    const theme = useAppTheme()
    const id = `background${middleOut ? 'MiddleOut' : ''}}`

    return (
        <Svg height="100%" width="100%">
            <Defs>
                {middleOut ? (
                    // Creates a gradient with the start color in the middle, and the end color at the top and bottom
                    <LinearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                        <Stop offset="0" stopColor={gradientEndColor} stopOpacity="0" />
                        <Stop offset="0.3" stopColor={gradientStartColor} stopOpacity="1" />
                        <Stop offset="0.4" stopColor={gradientStartColor} stopOpacity="1" />
                        <Stop offset="1" stopColor={gradientEndColor} stopOpacity="0" />
                    </LinearGradient>
                ) : (
                    // Creates a gradient with the start color at the top, and the end color at the bottom
                    <LinearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                        <Stop offset="0" stopColor={gradientEndColor} stopOpacity="1" />
                        <Stop offset="1" stopColor={gradientStartColor} stopOpacity="0" />
                    </LinearGradient>
                )}
            </Defs>
            <Rect
                fill={`url(#${id})`}
                height="100%"
                opacity={opacity}
                rx={theme.borderRadii[borderRadius]}
                width="100%"
                x="0"
                y="0"
            />
        </Svg>
    )
}

export const ThemedGradient = memo(_ThemedGradient)
