import {Appearance, Keyboard} from 'react-native'
import React, {useEffect} from 'react'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {useTranslation} from 'react-i18next'
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import {theme} from 'app/themes/Theme'
import {CircularActivityIndicator} from '../ChatUI'

type Prop = {
    direction: 'left' | 'right'
    onNext: () => void
}

const _size = 80
const _border = Math.round(_size / 15)

const LoadingView = (prop: Prop) => {
    const dir = prop.direction
    const {t} = useTranslation()
    const bioTop = useSharedValue<number>(0)
    const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100)
    const opacity = useSharedValue<number>(0)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
            bioTop.value = withTiming(-150)
        })
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            bioTop.value = withTiming(0)
        })

        return () => {
            //disappear()
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])

    const bioInputStyle = useAnimatedStyle(() => {
        return {
            marginTop: bioTop.value,
            opacity: opacity.value,
            transform: [{translateX: translateX.value}],
        }
    })

    const appear = () => {
        translateX.value = withTiming(0)
        opacity.value = withTiming(1)
    }

    const disappear = () => {
        //translateX.value = withTiming(dir == 'right' ? -100 : 100)
        opacity.value = withTiming(0)
    }

    return (
        <Animated.ScrollView
            bounces={false}
            style={bioInputStyle}
            onLayout={() => appear()}
            contentContainerStyle={{width: SCREEN_WIDTH, marginTop: 25, paddingHorizontal: 15}}>
            <Flex>
                <Flex
                    position={'absolute'}
                    top={(SCREEN_HEIGHT - 280) / 2 - _size / 2}
                    width={'100%'}
                    alignItems={'center'}>
                    <CircularActivityIndicator size={_size} color={theme.colors.violetDark} />
                    <Text
                        numberOfLines={2}
                        textAlign={'center'}
                        mt={'spacing20'}
                        fontWeight={'bold'}
                        color={'textPrimary'}
                        variant={'subheadLarge'}>
                        {`${t('updating_information')}...`}
                    </Text>
                </Flex>
            </Flex>
        </Animated.ScrollView>
    )
}

export default LoadingView
