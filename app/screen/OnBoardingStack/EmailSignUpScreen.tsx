/**
 * @Project Summarised
 * @File EmailSignUpScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 04/05/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import {useResponsiveProp} from '@shopify/restyle'
import OnboardingScreen from './components/OnboardingScreen'
import {Button, ButtonEmphasis, ButtonSize} from '../../components/core/Button/Button'

import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {KeyboardAvoidingView} from 'react-native'
import TextInput from '../../components/core/Input/TextInput'
import {FadeInDown} from 'react-native-reanimated'
import useTimeout from '../../hooks/timing/useTimeout'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {validateEmail} from 'app/utils/tools'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.EmailSignUpScreen>

const EmailSignUpScreen: React.FC<Props> = (): JSX.Element => {
    const {t} = useTranslation()
    const isDarkMode = useDarkMode()
    const navigation = useOnboardStackNavigation()
    const [startTimeout] = useTimeout()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const handleGoToValidateEmail = (): void => {
        setLoading(true)
        navigation.navigate(OnBoardingScreens.EmailValidateScreen, {email})
    }

    const isInfoCorret = () => validateEmail(email)

    return (
        <OnboardingScreen
            content={
                <Flex gap="spacing12" marginTop="spacing24">
                    <TextInput
                        outline
                        success
                        color={isDarkMode ? 'white' : 'black'}
                        style={{width: '100%'}}
                        placeholder="Email"
                        onBlur={(): void => {}}
                        onChangeText={setEmail}
                    />
                </Flex>
            }
            footer={
                <AnimatedFlex
                    mb={'spacing20'}
                    entering={FadeInDown.delay(400).duration(200).springify()}
                    justifyContent="flex-end">
                    <Button
                        backgroundColor={
                            isDarkMode
                                ? 'translucentBackground'
                                : isInfoCorret()
                                ? 'black'
                                : 'background2'
                        }
                        emphasis={
                            isDarkMode
                                ? ButtonEmphasis.Secondary
                                : isInfoCorret()
                                ? ButtonEmphasis.Primary
                                : ButtonEmphasis.Tertiary
                        }
                        loading={loading}
                        size={buttonSize}
                        style={{borderRadius: 5}}
                        onPress={handleGoToValidateEmail}>
                        {t('Next')}
                    </Button>
                </AnimatedFlex>
            }
            subtitle={'' + t('Onboarding.EmailSignUp.SubTitle')}
            title={'' + t('Onboarding.EmailSignUp.Title')}
        />
    )
}

export default EmailSignUpScreen
