/**
 * @Project Summarised
 * @File CircleProgressBar.tsx
 * @Path app/screen/OnBoardingStack/components
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import Svg, {Circle} from 'react-native-svg'
import {Flex} from '../../../components/layout/Flex'
import {StyleSheet} from 'react-native'
import Animated, {
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import React, {useEffect} from 'react'
import {AnimatedText} from '../../../components/core/Text/AnimatedText'
import {isAndroid} from '../../../utils/PlatformUtils'
import useDarkMode from 'app/hooks/theme/useDarkMode'

interface Props {
    backgroundFillColor: string
    strokeColor: string
    activeStrokeColor: string
    width: number
    height: number
    thickness: number
    animationDuration?: number
}

const CircleProgressBar: React.FC<Props> = ({
    strokeColor,
    backgroundFillColor,
    activeStrokeColor,
    width,
    height,
    thickness,
    animationDuration = 2000,
}): JSX.Element => {
    const CIRCLE_LENGTH = 1000
    const R = CIRCLE_LENGTH / (2 * Math.PI)
    const progress = useSharedValue(0)
    const isDarkMode = useDarkMode()

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    }))
    const progressText = useDerivedValue(() => {
        return `${Math.floor(progress.value * 100)} %`
    })
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)

    useEffect(() => {
        progress.value = withTiming(1, {duration: animationDuration})
    }, [])
    return (
        <Flex fill alignItems="center" justifyContent="center">
            <AnimatedText
                color={isDarkMode ? 'textOnBrightPrimary' : 'userThemeColor'}
                style={[styles.progressText]}
                text={progressText}
                variant="headlineLarge"
            />
            <Svg style={{position: 'absolute'}}>
                <Circle
                    cx={width / 2.2}
                    cy={height / 4}
                    fill={backgroundFillColor}
                    r={R}
                    stroke={strokeColor}
                    strokeWidth={thickness}
                />
                <AnimatedCircle
                    animatedProps={animatedProps}
                    cx={width / 2.2}
                    cy={height / 4}
                    fill={backgroundFillColor}
                    r={R}
                    stroke={activeStrokeColor}
                    strokeDasharray={CIRCLE_LENGTH}
                    strokeLinecap="round"
                    strokeWidth={thickness / 2}
                />
            </Svg>
        </Flex>
    )
}

const styles = StyleSheet.create({
    progressText: {
        position: 'absolute',
        top: isAndroid ? 165 : 200,
    },
})
export default CircleProgressBar
