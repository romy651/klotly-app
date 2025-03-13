/**
 * @Project Summarised
 * @File OnboardingCompleteScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 11/04/2023
 */

import {NativeStackScreenProps} from '@react-navigation/native-stack'
import Animated, {
    AnimateStyle,
    Easing,
    EntryExitAnimationFunction,
    withDelay,
    withTiming,
} from 'react-native-reanimated'
import React, {useState} from 'react'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {Screen} from '../../components/layout/Screen'
import {Flex} from '../../components/layout/Flex'
import {
    circleProgressSlideUpAndFadeInConfig,
    circleProgressSlideUpAtEnd,
    letsGoButtonFadeIn,
    realCircleProgressTopGlowFadeIn,
    textSlideUpAtEnd,
} from './components/animation'
import {useTranslation} from 'react-i18next'
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import GradientBackground from '../../components/gradients/GradientBackground'
import {ThemedGradient} from '../../components/gradients/ThemedGradient'
import {StyleSheet, useWindowDimensions} from 'react-native'
import {Text} from '../../components/core/Text/Text'
import CircleProgressBar from './components/CircleProgressBar'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {Button, ButtonEmphasis} from '../../components/core/Button/Button'
import {useResponsiveProp} from '@shopify/restyle'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {useInterval} from '../../hooks/timing/useInterval'
import {useAppDispatch} from '../../hooks/state/useAppDispatch'
import {openModal} from '../../redux/modals/modal.reducer'
import {ModalName} from '../../routes/modals/Modals'

type Props = NativeStackScreenProps<
    OnBoardingStackParamList,
    OnBoardingScreens.OnboardingCompleteScreen
>

const ANIMATION_DURATION = 3000

const OnboardingCompleteScreen: React.FC<Props> = (): JSX.Element => {
    const isDarkMode = useDarkMode()
    const {t} = useTranslation()
    const theme = useAppTheme()
    const {width, height} = useWindowDimensions()
    //const dispatch = useAppDispatch()
    const navigation = useOnboardStackNavigation()

    const subheadSize = useResponsiveProp({
        phone: 'bodySmall',
        longPhone: 'bodyLarge',
    })
    const circleProgressSlideUpAndFadeIn: EntryExitAnimationFunction = () => {
        'worklet'
        const animations: AnimateStyle<StyleProp<ViewStyle>> = {
            opacity: withDelay(
                circleProgressSlideUpAndFadeInConfig.opacity.delay,
                withTiming(circleProgressSlideUpAndFadeInConfig.opacity.endValue, {
                    duration: circleProgressSlideUpAndFadeInConfig.opacity.duration,
                    easing: Easing.bezierFn(0.22, 1.0, 0.36, 1.0),
                }),
            ),
            transform: [
                {
                    translateY: withDelay(
                        circleProgressSlideUpAndFadeInConfig.translateY.delay,
                        withTiming(circleProgressSlideUpAndFadeInConfig.translateY.endValue, {
                            duration: circleProgressSlideUpAndFadeInConfig.translateY.duration,
                            easing: Easing.bezierFn(0.22, 1.0, 0.36, 1.0),
                        }),
                    ),
                },
            ],
        }

        const initialValues: AnimateStyle<any> = {
            opacity: circleProgressSlideUpAndFadeInConfig.opacity.startValue,
            transform: [{translateY: circleProgressSlideUpAndFadeInConfig.translateY.startValue}],
        }

        return {
            initialValues,
            animations,
        }
    }

    const onPressNext = (): void => {
        navigation.navigate(OnBoardingScreens.PricingScreen)
        //dispatch(openModal({name: ModalName.Plan}))
    }

    const [loadingState] = useState<Array<string>>([
        t('Onboarding.Step5.CreatingYourFeed'),
        t('Onboarding.Step5.AddingSelectedTitle'),
        t('Onboarding.Step5.SelectingCollections'),
        t('Onboarding.Step5.GetReady'),
    ])
    const [loadingIndex, setLoadingIndex] = useState<number>(0)

    useInterval(() => {
        if (loadingIndex < loadingState.length - 1) setLoadingIndex(index => index + 1)
    }, ANIMATION_DURATION / loadingState.length)

    return (
        <Screen>
            <Animated.View entering={realCircleProgressTopGlowFadeIn} style={[styles.circleGlow]}>
                <GradientBackground>
                    <ThemedGradient
                        borderRadius="rounded16"
                        gradientEndColor={theme.colors.accentAction}
                        gradientStartColor={theme.colors.background0}
                        opacity={isDarkMode ? 0.3 : 0.2}
                    />
                </GradientBackground>
            </Animated.View>
            <Flex grow justifyContent="space-between" px="spacing16" py="spacing24">
                <Flex centered grow mb="spacing12" mt="spacing12">
                    <Animated.View
                        entering={circleProgressSlideUpAndFadeIn}
                        style={[
                            styles.circleProgressContainer,
                            {
                                maxHeight: height / 1.8,
                            },
                        ]}>
                        <Animated.View
                            entering={circleProgressSlideUpAtEnd}
                            style={[styles.fullContent]}>
                            <CircleProgressBar
                                activeStrokeColor={theme.colors.userThemeColor}
                                animationDuration={ANIMATION_DURATION}
                                backgroundFillColor="transparent"
                                height={height}
                                strokeColor={theme.colors.background2}
                                thickness={30}
                                width={width}
                            />
                            <Animated.View style={[styles.textContainer, {marginHorizontal: 0}]}>
                                <Text pb="spacing12" variant="buttonLabelLarge">
                                    {loadingState[loadingIndex]}
                                </Text>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                    <Animated.View entering={textSlideUpAtEnd} style={[styles.textContainer]}>
                        <Text color="textSecondary" textAlign="center" variant={subheadSize}>
                            {t('Onboarding.Step5.GetReady.Description')}
                        </Text>
                    </Animated.View>
                </Flex>
                <Animated.View entering={letsGoButtonFadeIn}>
                    <Button
                        backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                        emphasis={isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary}
                        style={{borderRadius: 8}}
                        onPress={onPressNext}>
                        {t('Next')}
                    </Button>
                </Animated.View>
            </Flex>
        </Screen>
    )
}

export default OnboardingCompleteScreen

const styles = StyleSheet.create({
    circleGlow: {
        borderRadius: 18,
        bottom: 0,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: -1,
        // to make the glow appear behind the QR code
    },
    circleProgressContainer: {
        marginBottom: -30,
        width: '100%',
    },
    fullContent: {
        height: '100%',
        width: '100%',
    },
    textContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 28,
        width: '100%',
    },
})
