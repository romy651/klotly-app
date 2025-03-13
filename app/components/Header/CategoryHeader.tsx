import * as React from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import {AnimatedFlex} from '../../components/layout/Flex'
import {getStatusBarHeight} from 'react-native-safearea-height'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import {AnimatedText} from '../core/Text/AnimatedText'
import {isIos} from 'app/utils/PlatformUtils'
type Props = {
    animHeaderValue: Animated.SharedValue<number>
    title: string
}

export default function CategoryHeader({animHeaderValue, title}: Props): JSX.Element {
    const theme = useAppTheme()
    const _title = useSharedValue<string>(title)

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [80, 100], [1, 0], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        const translateY = isIos
            ? interpolate(animHeaderValue.value, [0, 230], [25, 120], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })
            : interpolate(animHeaderValue.value, [0, 230], [0, 120], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })

        return {
            opacity,
            transform: [{translateY}],
        }
    })

    const headerStyle = useAnimatedStyle(() => {
        const translateY = isIos
            ? interpolate(animHeaderValue.value, [0, 170], [0, -143], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })
            : interpolate(animHeaderValue.value, [0, 230], [0, -140], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })
        return {
            transform: [{translateY}],
            backgroundColor: theme.colors.accentActionSoft,
            opacity: 1,
        }
    })

    return (
        <AnimatedFlex style={[styles.header, headerStyle]}>
            <AnimatedText
                fontWeight="bold"
                numberOfLines={2}
                style={textStyle}
                text={_title}
                textAlign="center"
                variant="headlineSmall"
            />
        </AnimatedFlex>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        height: 200 + getStatusBarHeight(),
        paddingHorizontal: 10,
        paddingTop: 50,
        position: 'absolute',
        width: '100%',
    },
})
