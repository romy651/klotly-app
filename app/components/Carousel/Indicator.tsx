/**
 * @Project Summarised
 * @File Indicator.tsx
 * @Path app/components/Carousel
 * @Author BRICE ZELE
 * @Date 28/03/2023
 */
import {dimensions} from '../../themes/Sizing'
import React from 'react'
import {Flex} from '../layout/Flex'
import {AnimatedBox, Box} from '../layout/Box'
import {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from 'react-native-reanimated'

const {fullWidth} = dimensions
const INDICATOR_WIDTH = (200 / 375) * fullWidth

export const Indicator: React.FC<{stepCount: number; currentStep: number}> = ({
    stepCount,
    currentStep,
}): JSX.Element => {
    return (
        <Flex
            row
            alignItems="center"
            gap="spacing12"
            justifyContent="center"
            width={INDICATOR_WIDTH}>
            {[...Array(stepCount)].map((_, i) => (
                <Box
                    key={`indicator-${i}`}
                    bg="textPrimary"
                    borderRadius="rounded16"
                    flex={1}
                    height={4}
                    opacity={i <= currentStep ? 1 : 0.2}
                />
            ))}
        </Flex>
    )
}

export const AnimatedIndicator: React.FC<{scroll: SharedValue<number>; stepCount: number}> = ({
    scroll,
    stepCount,
}): JSX.Element => {
    return (
        <Flex centered row gap="spacing12" px="spacing24">
            {[...Array(stepCount)].map((_, i) => (
                <AnimatedIndicatorPill key={`animatedindicator-${i}`} index={i} scroll={scroll} />
            ))}
        </Flex>
    )
}

const AnimatedIndicatorPill: React.FC<{index: number; scroll: SharedValue<number>}> = ({
    index,
    scroll,
}): JSX.Element => {
    const style = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth]
        return {
            opacity: interpolate(scroll.value, inputRange, [0.2, 1, 0.2], Extrapolation.CLAMP),
        }
    })

    return (
        <AnimatedBox
            key={`indicator-${index}`}
            bg="textPrimary"
            borderRadius="rounded16"
            flex={1}
            height={10}
            style={style}
        />
    )
}
