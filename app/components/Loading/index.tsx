import useDarkMode from 'app/hooks/theme/useDarkMode'
import React, {useEffect} from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'

type LoadingProps = {
    loading: boolean
    custom?: boolean
}
const Loading = ({loading, custom = false}: LoadingProps) => {
    const rotation = useSharedValue(0)
    const isDarkMode = useDarkMode()
    const animatedStyle = useAnimatedStyle(() => {
        const rotateZ = isDarkMode ? `-${rotation.value}deg` : `${rotation.value}deg`
        return {
            transform: [{rotateZ}],
        }
    })

    useEffect(() => {
        if (loading) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 3000,
                    easing: Easing.ease,
                }),
                -1,
            )
        } else {
            cancelAnimation(rotation)
        }
    }, [loading])

    return (
        <View style={styles.loading}>
            {custom && (
                <Animated.Image
                    style={[{width: 20, height: 20}, animatedStyle]}
                    source={require('../../assets/images/loading.png')}
                />
            )}
            {!custom && <ActivityIndicator size="small" color={'white'} />}
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    loading: {
        flexDirection: 'row',
        borderRadius: 5,
        justifyContent: 'center',
    },
})
