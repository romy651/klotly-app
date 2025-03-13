import * as React from 'react'
import {StyleSheet, useWindowDimensions} from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import {getDefaultHeaderHeight} from '@react-navigation/elements'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import TouchableIcon from '../core/Button/TouchableIcon'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {Text} from '../../components/core/Text/Text'
import {AnimatedText} from '../core/Text/AnimatedText'
import {getStatusBarHeight} from 'react-native-safearea-height'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {TextInput} from 'react-native-gesture-handler'

const Header_Max_Height = 120
const Header_Min_Height = 70

type Props = {
    animHeaderValue: Animated.SharedValue<number>
}

export default function SearchHeader({animHeaderValue}: Props) {
    const defaultHeaderHeight = getStatusBarHeight()
    const title = useSharedValue<string>('For you')
    const theme = useAppTheme()
    const isDarkMode = useDarkMode()

    const dynamicStyle = useAnimatedStyle(() => {
        //console.log('the y: ', animHeaderValue.value)
        const height = interpolate(animHeaderValue.value, [0, 80], [Header_Max_Height, 60], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        const backgroundColor = interpolateColor(
            animHeaderValue.value,
            [0, Header_Max_Height - Header_Min_Height],
            [theme.colors.background0, theme.colors.accentActionSoft],
        )

        const borderBottomWidth = interpolate(animHeaderValue.value, [0, 80], [0, 1], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        return {
            height: height,
            borderBottomWidth,
            borderBottomColor: theme.colors.backgroundScrim,
            backgroundColor,
        }
    })

    const tabBarStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animHeaderValue.value,
            [0, Header_Max_Height - Header_Min_Height],
            [theme.colors.background0, theme.colors.accentActionSoft],
        )
        return {
            height: defaultHeaderHeight,
            width: '100%',
            backgroundColor,
        }
    })

    const textStyle = useAnimatedStyle(() => {
        const fontSize = interpolate(animHeaderValue.value, [0, 40], [32, 24], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            fontSize,
        }
    })

    const barOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [0, 10], [1, 0], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            opacity,
        }
    })

    const animatedSearch = useAnimatedStyle(() => {
        const translateY = interpolate(animHeaderValue.value, [0, 80], [0, -60], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            transform: [
                {
                    translateY,
                },
            ],
        }
    })

    return (
        <>
            <AnimatedFlex style={tabBarStyle} />
            <AnimatedFlex style={[styles.header, dynamicStyle]}>
                <AnimatedFlex>
                    <AnimatedText
                        style={[textStyle, styles.headerText]}
                        text={title}
                        variant={'bodyLarge'}
                        color={'textPrimary'}
                        fontWeight={'bold'}
                    />
                    <AnimatedFlex
                        borderBottomColor={'accentSuccess'}
                        width={60}
                        height={5}
                        position={'absolute'}
                        backgroundColor={'accentSuccess'}
                        style={[barOpacity]}
                        bottom={0}
                        left={5}
                        opacity={1}
                    />
                </AnimatedFlex>
            </AnimatedFlex>
            <Flex
                backgroundColor={'translucentBackground'}
                py={'spacing12'}
                width={'100%'}
                px={'spacing10'}>
                <Flex
                    width={'100%'}
                    height={50}
                    flexDirection={'row'}
                    alignItems={'center'}
                    paddingHorizontal={'spacing10'}
                    borderRadius={'rounded4'}
                    backgroundColor={'accentActionSoft'}>
                    <AntDesign
                        name="search1"
                        color={isDarkMode ? 'white' : theme.colors.userThemeSlate}
                        size={22}
                    />
                    <Flex style={{width: '90%'}} borderStartColor={'accentSuccess'}>
                        <TextInput
                            placeholder="Title, author or topic"
                            style={{
                                width: '100%',
                                height: '100%',
                                marginRight: 16,
                            }}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
    },
    headerText: {
        marginBottom: -16,
    },
})

/*
const animatedSearch = useAnimatedStyle(() => {
        const translateY = interpolate(animHeaderValue.value, [0, 80], [0, -60], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            transform: [
                {
                    translateY,
                },
            ],
        }
    })
 <AnimatedFlex style={animatedSearch} my={'spacing12'} width={'100%'} px={'spacing10'}>
                <Flex
                    width={'100%'}
                    height={50}
                    flexDirection={'row'}
                    alignItems={'center'}
                    paddingHorizontal={'spacing10'}
                    borderRadius={'rounded4'}
                    backgroundColor={'accentActionSoft'}>
                    <AntDesign
                        name="search1"
                        color={isDarkMode ? 'white' : theme.colors.userThemeSlate}
                        size={22}
                    />
                    <Flex style={{width: '90%'}} borderStartColor={'accentSuccess'}>
                        <TextInput
                            placeholder="Title, author or topic"
                            style={{
                                width: '100%',
                                height: '100%',
                                marginRight: 16,
                            }}
                        />
                    </Flex>
                </Flex>
            </AnimatedFlex>
            */
