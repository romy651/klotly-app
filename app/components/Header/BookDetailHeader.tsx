import * as React from 'react'
import {StyleSheet} from 'react-native'
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import {getStatusBarHeight} from 'react-native-safearea-height'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import {isIos} from 'app/utils/PlatformUtils'
type Props = {
    animHeaderValue: Animated.SharedValue<number>
    image: string
    color: string
    title: string
}

export default function BookDetailHeader({animHeaderValue, image, color}: Props): JSX.Element {
    const theme = useAppTheme()
    const backgroundColor = theme.colors.accentActionSoft

    const dynamicImage = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [100, 200], [1, 0], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        const translateY = isIos
            ? interpolate(animHeaderValue.value, [0, 230], [25, 150], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })
            : interpolate(animHeaderValue.value, [0, 230], [0, 150], {
                  extrapolateLeft: Extrapolate.CLAMP,
                  extrapolateRight: Extrapolate.CLAMP,
              })

        return {
            opacity,
            transform: [{translateY}],
            backgroundColor,
        }
    })

    const headerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(animHeaderValue.value, [0, 230], [0, -230], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            transform: [{translateY}],
            backgroundColor: 'blue',
        }
    })

    return (
        <AnimatedFlex style={[styles.header, headerStyle]}>
            <Flex
                backgroundColor="background0"
                height="100%"
                opacity={0.9}
                position="absolute"
                width="100%"
            />
            <Animated.Image source={{uri: image}} style={[dynamicImage, styles.image]} />
        </AnimatedFlex>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 290 + getStatusBarHeight(),
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
    },
    image: {
        borderRadius: 5,
        height: 115 * 1.4816,
        width: 115,
    },
})
