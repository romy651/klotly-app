import React, {useEffect} from 'react'
import {Pressable, StyleSheet} from 'react-native'
import {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import {AnimatedFlex} from '../layout/Flex'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
    handleOnPress: (value: boolean) => void
    value: boolean
    activeTrackColor?: string
    inActiveTrackColor?: string
    thumbColor?: string
}

const RNSwitch = ({
    activeTrackColor = '#042330',
    inActiveTrackColor = '#042330',
    thumbColor = '#FFF',
    value,
    handleOnPress,
}: Props): JSX.Element => {
    const switchTranslate = useSharedValue<number>(0)
    useEffect(() => {
        if (value) {
            switchTranslate.value = withSpring(55, {
                mass: 1,
                damping: 100,
                stiffness: 500,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001,
            })
        } else {
            switchTranslate.value = withSpring(5, {
                mass: 1,
                damping: 100,
                stiffness: 500,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001,
            })
        }
    }, [value, switchTranslate])
    const interpolateBackgroundColor = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            switchTranslate.value,
            [0, 22],
            [inActiveTrackColor, activeTrackColor],
        )
        return {
            backgroundColor,
        }
    })
    const memoizedOnSwitchPressCallback = React.useCallback(() => {
        handleOnPress(!value)
    }, [handleOnPress, value])

    return (
        <Pressable onPress={memoizedOnSwitchPressCallback}>
            <AnimatedFlex
                flexDirection="row"
                style={[styles.containerStyle, interpolateBackgroundColor]}>
                <AnimatedFlex
                    style={[
                        styles.circleStyle,
                        {backgroundColor: thumbColor},
                        {
                            transform: [
                                {
                                    translateX: switchTranslate,
                                },
                            ],
                        },
                        styles.shadowValue,
                    ]}
                />
                <MatComIcon
                    color={value ? 'rgba(255,255,255,0.5)' : 'black'}
                    name="earbuds"
                    size={20}
                />
                <MatComIcon
                    color={!value ? 'rgba(255,255,255,0.5)' : 'black'}
                    name="book-open-outline"
                    size={20}
                    style={{marginLeft: 10}}
                />
            </AnimatedFlex>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    circleStyle: {
        borderRadius: 24,
        height: 30,
        position: 'absolute',
        width: 30,
    },
    containerStyle: {
        alignItems: 'center',
        borderRadius: 36.5,
        height: 40,
        paddingHorizontal: 2,
        paddingVertical: 2,
        width: 90,
    },
    shadowValue: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
})

export default RNSwitch
