/**
 * @Project Summarised
 * @File TouchableArea.tsx
 * @Path app/components/core/Button
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import Animated, {
    AnimateProps,
    cancelAnimation,
    Easing,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import {withAnimated} from '../../../hooks/anim/withAnimated'
import React, {ComponentProps, PropsWithChildren, useCallback, useMemo, useRef} from 'react'
import {
    GestureResponderEvent,
    processColor,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native'
import {defaultHitslopInset} from '../../../themes/Sizing'
import {createBox} from '@shopify/restyle'
import {Theme} from '../../../themes/Theme'
import {HapticFeedbackTypes, trigger} from 'react-native-haptic-feedback'
import useLongPressEvents from '../../../hooks/events/useLongPressEvents'
import {
    createNativeWrapper,
    NativeViewGestureHandlerGestureEvent,
    RawButtonProps,
} from 'react-native-gesture-handler'
import {PureNativeButton} from 'react-native-gesture-handler/src/components/GestureButtons'
import ConditionalWrap from '../ConditionWrap'

const TouchableBox = createBox<Theme, TouchableOpacityProps>(TouchableOpacity)
const AnimatedTouchableBox = withAnimated(TouchableBox)

const ScaleTimingConfigIn = {duration: 50, easing: Easing.ease}
const ScaleTimingConfigOut = {duration: 75, easing: Easing.ease}

export type BaseButtonProps = PropsWithChildren<
    ComponentProps<typeof TouchableBox> & {
        hapticFeedback?: boolean
        hapticTypes?: HapticFeedbackTypes
        scaleTo?: number
        minLongPressDuration?: number
        scale?: boolean
    }
>

/**
 * This component wraps children in a TouchableBox and adds tracking. If you are trying to implement a standard button DO NOT USE this component. Use the Button component instead with the desired size and emphasis.
 * Examples of when to use this are:
 *  - clickable text
 *  - clickable icons (different from an icon button which has a bg color, border radius, and a border)
 *  - custom elements that are clickable (e.g. rows, cards, headers)
 */
export function TouchableArea({
    hapticFeedback = false,
    hapticTypes,
    scaleTo = 0.86,
    minLongPressDuration = 500,
    scale = false,
    onPress,
    onLongPress,
    children,
    activeOpacity = 0.75,
    style,
    ...rest
}: BaseButtonProps): JSX.Element {
    const touchActivationPositionRef = useRef<Pick<
        GestureResponderEvent['nativeEvent'],
        'pageX' | 'pageY'
    > | null>(null)

    const AnimatedRawButton = createNativeWrapper<AnimateProps<PropsWithChildren<RawButtonProps>>>(
        Animated.createAnimatedComponent(PureNativeButton),
        {
            shouldActivateOnStart: true,
            shouldCancelWhenOutside: true,
        },
    )

    const transparentColor = processColor('transparent')

    const scaleValue = useSharedValue(1)

    const onPressHandler = useCallback(
        async (event: GestureResponderEvent) => {
            if (!onPress) return

            const {pageX, pageY} = event.nativeEvent

            const isDragEvent =
                touchActivationPositionRef.current &&
                isDrag(
                    touchActivationPositionRef.current.pageX,
                    touchActivationPositionRef.current.pageY,
                    pageX,
                    pageY,
                )

            if (isDragEvent) {
                return
            }

            if (hapticFeedback) {
                const options = {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                }
                trigger(hapticTypes ?? 'impactLight', options)
            }

            onPress(event)
        },
        [onPress, hapticFeedback, hapticTypes],
    )

    const onPressInHandler = useMemo(() => {
        return ({nativeEvent: {pageX, pageY}}: GestureResponderEvent) => {
            touchActivationPositionRef.current = {pageX, pageY}

            if (!scaleTo) return
            scaleValue.value = withTiming(scaleTo, ScaleTimingConfigIn)
        }
    }, [scaleValue, scaleTo])

    const onPressOutHandler = useMemo(() => {
        if (!scaleTo) return
        return () => {
            scaleValue.value = withDelay(50, withTiming(1, ScaleTimingConfigOut))
        }
    }, [scaleValue, scaleTo])

    const hasScaledDown = useSharedValue(0)

    const {handleCancel, handlePress, handleStartPress} = useLongPressEvents({
        minLongPressDuration,
        onLongPress,
        onPress,
    })

    const gestureHandler = useAnimatedGestureHandler<NativeViewGestureHandlerGestureEvent>({
        onActive: () => {
            runOnJS(handleStartPress)()
            if (hasScaledDown.value === 0) {
                scaleValue.value = withSpring(scaleTo)
            }
            hasScaledDown.value = 0.95
        },
        onCancel: () => {
            scaleValue.value = withSpring(1)
            hasScaledDown.value = 0
            runOnJS(handleCancel)()
        },
        onEnd: () => {
            hasScaledDown.value = 0
            scaleValue.value = withSpring(1)
            runOnJS(handlePress)()
        },
        onFinish: () => {
            scaleValue.value = withSpring(1)
        },
        onFail: () => {
            runOnJS(handleCancel)()
        },
        onStart: () => {
            cancelAnimation(scaleValue)
            scaleValue.value = withSpring(0.95)
        },
    })

    const baseProps: ComponentProps<typeof TouchableBox> | any = {
        onPress: onPressHandler,
        onPressIn: onPressInHandler,
        onPressOut: onPressOutHandler,
        activeOpacity,
        hitSlop: defaultHitslopInset,
        testID: '',
        ...rest,
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: 1 / scaleValue.value}],
        }
    }, [scaleValue])

    return (
        <ConditionalWrap
            condition={scale}
            wrap={(children: React.ReactNode): JSX.Element => (
                <AnimatedRawButton rippleColor={transparentColor} onGestureEvent={gestureHandler}>
                    {children}
                </AnimatedRawButton>
            )}>
            <AnimatedTouchableBox style={[scale ? animatedStyle : undefined, style]} {...baseProps}>
                {children}
            </AnimatedTouchableBox>
        </ConditionalWrap>
    )
}

export const AnimatedTouchableArea = withAnimated(TouchableArea)

/**
 * @link https://github.com/satya164/react-native-tab-view/issues/1241#issuecomment-1022400366
 * @returns true if press was after a drag gesture
 */
function isDrag(
    activationX: number,
    activationY: number,
    releaseX: number,
    releaseY: number,
    threshold = 2,
): boolean {
    const absX = Math.abs(activationX - releaseX)
    const absY = Math.abs(activationY - releaseY)

    return absX > threshold || absY > threshold
}
