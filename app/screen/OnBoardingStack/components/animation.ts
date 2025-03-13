/**
 * @Project Summarised
 * @File animation.ts
 * @Path app/screen/OnBoardingStack/components
 * @Author BRICE ZELE
 * @Date 10/04/2023
 */

import {
    AnimateStyle,
    Easing,
    EntryExitAnimationFunction,
    withDelay,
    withTiming,
} from 'react-native-reanimated'
// Because the animation spec is denominated in frames, but Reanimated only works with milliseconds, this object stores all the frame values as their millisecond value equivalent. The conversion assumes 60fps, using a formula of (1000 / 60) * frames. This lets us keep the code readable according to frame numbers without recomputing these values every time.
export const FPMS = {
    29: 483.33,
    60: 1000,
    130: 2166.67,
    165: 2750,
    179: 2983.33,
    180: 3000,
    228: 3800,
    241: 4016.67,
    258: 4300,
    360: 6000,
}

export const circleProgressSlideUpAndFadeInConfig = {
    opacity: {
        startValue: 0,
        endValue: 1,
        delay: FPMS[29],
        duration: FPMS[60] - FPMS[29],
    },
    translateY: {
        startValue: 64,
        endValue: 0,
        delay: FPMS[29],
        duration: FPMS[60] - FPMS[29],
    },
}

export const flashWipeConfig = {
    scale: {
        startValue: 0.8,
        endValue: 1,
        delay: FPMS[130],
        duration: FPMS[179] - FPMS[130],
    },
    opacityIn: {
        startValue: 0,
        endValue: 1,
        delay: FPMS[165],
        duration: FPMS[180] - FPMS[165],
    },
    opacityOut: {
        startValue: 1,
        endValue: 0,
        delay: 0,
        duration: FPMS[228] - FPMS[180],
    },
}
export const realCircleProgressTopGlowFadeIn: EntryExitAnimationFunction = () => {
    'worklet'
    const animations = {
        opacity: withDelay(
            flashWipeConfig.opacityIn.delay,
            withTiming(flashWipeConfig.opacityIn.endValue, {
                duration: flashWipeConfig.opacityIn.duration,
                easing: Easing.bezierFn(0.4, 0.0, 0.68, 0.06),
            }),
        ),
    }
    const initialValues = {
        opacity: 0,
    }
    return {
        initialValues,
        animations,
    }
}

const textSlideUpAndFadeInConfig = {
    opacityIn: {
        startValue: 0,
        endValue: 1,
        delay: FPMS[241],
        duration: FPMS[241],
    },
    opacityOut: {
        startValue: 0,
        endValue: 1,
        delay: FPMS[241],
        duration: FPMS[258] - FPMS[241],
    },
    translateY: {
        startValue: 32,
        endValue: 0,
        delay: FPMS[228],
        duration: FPMS[258] - FPMS[228],
    },
}

export const textSlideUpAtEnd: EntryExitAnimationFunction = () => {
    'worklet'
    const animations: AnimateStyle<unknown> = {
        opacity: withDelay(
            textSlideUpAndFadeInConfig.opacityOut.delay,
            withTiming(textSlideUpAndFadeInConfig.opacityOut.endValue, {
                duration: textSlideUpAndFadeInConfig.opacityOut.duration,
                easing: Easing.bezierFn(0.66, 0.0, 0.34, 1.0),
            }),
        ),
        transform: [
            {
                translateY: withDelay(
                    textSlideUpAndFadeInConfig.translateY.delay,
                    withTiming(textSlideUpAndFadeInConfig.translateY.endValue, {
                        duration: textSlideUpAndFadeInConfig.translateY.duration,
                        easing: Easing.bezierFn(0.66, 0.0, 0.34, 1.0),
                    }),
                ),
            },
        ],
    }
    const initialValues: AnimateStyle<unknown> = {
        transform: [{translateY: textSlideUpAndFadeInConfig.translateY.startValue}],
        opacity: textSlideUpAndFadeInConfig.opacityOut.startValue,
    }
    return {
        initialValues,
        animations,
    }
}

export const loadingTextFadeOut: EntryExitAnimationFunction = () => {
    'worklet'
    const animations = {
        opacity: withDelay(
            flashWipeConfig.opacityIn.delay + flashWipeConfig.opacityIn.duration,
            withTiming(0, {duration: 1, easing: Easing.bezierFn(0.4, 0.0, 0.68, 0.06)}),
        ),
    }
    const initialValues = {
        opacity: 1,
    }
    return {
        initialValues,
        animations,
    }
}

// 9. Button slide up and fade in
export const letsGoButtonFadeIn: EntryExitAnimationFunction = () => {
    'worklet'
    const animations = {
        opacity: withDelay(
            textSlideUpAndFadeInConfig.opacityOut.delay,
            withTiming(textSlideUpAndFadeInConfig.opacityOut.endValue, {
                duration: textSlideUpAndFadeInConfig.opacityOut.duration,
            }),
        ),
    }
    const initialValues = {
        opacity: textSlideUpAndFadeInConfig.opacityOut.startValue,
    }
    return {
        initialValues,
        animations,
    }
}

const imageSlideUpAtEndConfig = {
    translateY: {
        startValue: 0,
        endValue: -30,
        delay: FPMS[228],
        duration: FPMS[258] - FPMS[228],
    },
}

export const circleProgressSlideUpAtEnd: EntryExitAnimationFunction = () => {
    'worklet'
    const animations: AnimateStyle<unknown> = {
        transform: [
            {
                translateY: withDelay(
                    imageSlideUpAtEndConfig.translateY.delay,
                    withTiming(imageSlideUpAtEndConfig.translateY.endValue, {
                        duration: imageSlideUpAtEndConfig.translateY.duration,
                        easing: Easing.bezierFn(0.66, 0.0, 0.34, 1.0),
                    }),
                ),
            },
        ],
    }
    const initialValues: AnimateStyle<unknown> = {
        transform: [{translateY: circleProgressSlideUpAndFadeInConfig.translateY.startValue}],
    }
    return {
        initialValues,
        animations,
    }
}
