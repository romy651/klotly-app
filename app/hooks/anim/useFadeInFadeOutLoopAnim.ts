import {useEffect, useRef} from 'react'
import {Animated} from 'react-native'

/**
 * @Project Summarised
 * @File useFadeInFadeOutLoopAnim.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 26/03/2023
 */

const useFadeInFadeOutLoopAnim = (delay: number, duration: number, size = 1): Animated.Value => {
    const fadeAnimation = useRef<Animated.Value>(new Animated.Value(0)).current

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnimation, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.delay(duration * 2),
                    Animated.timing(fadeAnimation, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.delay(duration * (size === 1 ? 1 : size * 1.5)),
                ]),
            ),
        ]).start()
    }, [fadeAnimation])

    return fadeAnimation
}

export default useFadeInFadeOutLoopAnim
