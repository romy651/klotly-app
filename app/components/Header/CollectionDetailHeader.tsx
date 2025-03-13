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
import {Source} from 'react-native-fast-image'
type Props = {
    animHeaderValue: Animated.SharedValue<number>
    image: string
    title: string
    id: string
}

export default function CollectionDetailHeader({
    animHeaderValue,
    image,
    title,
}: Props): JSX.Element {
    const theme = useAppTheme()
    const _title = useSharedValue<string>(title)

    const dynamicImage = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [100, 200], [1, 0], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        const translateY = interpolate(animHeaderValue.value, [0, 230], [20, 150], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        return {
            opacity,
            transform: [{translateY}],
        }
    })

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [100, 200], [1, 0], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        const translateY = interpolate(animHeaderValue.value, [0, 230], [25, 120], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        return {
            opacity,
            transform: [{translateY}],
        }
    })

    const headerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(animHeaderValue.value, [0, 230], [0, -260], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            transform: [{translateY}],
            backgroundColor: theme.colors.accentActionSoft,
        }
    })

    return (
        <AnimatedFlex style={[styles.header, headerStyle]}>
            <Animated.Image source={image as Source} style={[dynamicImage, styles.image]} />
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
        height: 350 + getStatusBarHeight(),
        justifyContent: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    image: {
        borderRadius: 5,
        height: 180,
        width: 180,
    },
})
