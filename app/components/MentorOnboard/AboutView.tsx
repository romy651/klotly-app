import {Image, Keyboard, Text, TextInput, View} from 'react-native'
import React, {useEffect} from 'react'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {useTranslation} from 'react-i18next'
import {onBoardMentorStyle} from './styles'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'

type Prop = {
    direction: 'left' | 'right'
    onNext: () => void
    setValue: (val: string) => void
}

const AboutView = (prop: Prop) => {
    const dir = prop.direction
    const {t} = useTranslation()
    const styles = onBoardMentorStyle()
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
            disappear()
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
        translateX.value = withTiming(dir == 'right' ? -100 : 100)
        opacity.value = withTiming(0)
    }

    const setValue = (val: string) => {
        prop.setValue(val)
        /*disappear();
    setTimeout(() => {
      prop.onNext();
    }, 200);*/
    }

    return (
        <Animated.ScrollView
            style={bioInputStyle}
            onLayout={() => appear()}
            contentContainerStyle={{width: SCREEN_WIDTH}}>
            <Text style={styles.title}>{t('first_name_quest')}</Text>
            <View style={styles.textInputView}>
                <TextInput
                    value={'helo here'}
                    autoFocus
                    onChangeText={val => setValue(val)}
                    placeholder={'Ex: Romuald...'}
                    style={styles.textInput}
                    maxLength={20}
                />
            </View>
        </Animated.ScrollView>
    )
}

export default AboutView
