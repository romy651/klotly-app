/**
 * @Project Summarised
 * @File NotificationSetupScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 10/04/2023
 */
import React from 'react'
import {Button, ButtonEmphasis, ButtonSize} from '../../components/core/Button/Button'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import OnboardingScreen from './components/OnboardingScreen'
import {useTranslation} from 'react-i18next'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import OnboardingNotificationIcon from '../../assets/svg/onboarding-notifications-bgicon.svg'
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {FadeInDown} from 'react-native-reanimated'
import {AnimatedBox} from '../../components/layout/Box'
import useDarkMode from 'app/hooks/theme/useDarkMode'

type Props = NativeStackScreenProps<
    OnBoardingStackParamList,
    OnBoardingScreens.NotificationSetupScreen
>

const NotificationsSetupScreen: React.FC<Props> = ({navigation}): JSX.Element => {
    const {t} = useTranslation()
    const isDarkMode = useDarkMode()
    const onPressNext = (): void => {
        navigateToNextScreen()
    }

    const onPressEnableNotifications = (): void => {
        navigation.navigate(OnBoardingScreens.OnboardingCompleteScreen)
    }

    const navigateToNextScreen = (): void => {
        navigation.navigate(OnBoardingScreens.OnboardingCompleteScreen)
    }

    return (
        <OnboardingScreen
            content={
                <AnimatedFlex
                    centered
                    grow
                    mb={'spacing20'}
                    entering={FadeInDown.delay(400).duration(1000).springify()}>
                    <OnboardingNotificationIcon />
                </AnimatedFlex>
            }
            footer={
                <Flex>
                    <AnimatedBox entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <Button
                            backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                            emphasis={
                                isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary
                            }
                            style={{borderRadius: 8}}
                            onPress={onPressEnableNotifications}>
                            {t('Onboarding.Step4.TurnOnNotifications')}
                        </Button>
                    </AnimatedBox>
                    <AnimatedBox
                        mb={'spacing20'}
                        entering={FadeInDown.delay(500).duration(1000).springify()}>
                        <Button
                            style={{borderRadius: 8}}
                            emphasis={ButtonEmphasis.Tertiary}
                            onPress={onPressNext}>
                            {t('Onboarding.Step4.MayBeLater')}
                        </Button>
                    </AnimatedBox>
                </Flex>
            }
            subtitle={'' + t('Onboarding.Step4.SubTitle')}
            title={'' + t('Onboarding.Step4.Title')}
        />
    )
}

export default NotificationsSetupScreen
