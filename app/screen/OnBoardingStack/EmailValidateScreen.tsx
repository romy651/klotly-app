/**
 * @Project Summarised
 * @File EmailValidateScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 04/05/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Flex} from '../../components/layout/Flex'
import {useResponsiveProp} from '@shopify/restyle'
import OnboardingScreen from './components/OnboardingScreen'
import {Button, ButtonEmphasis} from '../../components/core/Button/Button'

import {OnBoardingStackParamList} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {KeyboardAvoidingView} from 'react-native'
import OTPInput from '../../components/core/Input/OTPInput'
import {Text} from '../../components/core/Text/Text'
import {useInterval} from '../../hooks/timing/useInterval'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.EmailValidateScreen>
const RESEND_CODE_DELAY = 30
const EmailValidateScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
    const {t} = useTranslation()
    const [otp, setOtp] = useState('')
    const [resendCodeDelay, setResendCodeDelay] = useState(RESEND_CODE_DELAY)

    const resendCodeSize = useResponsiveProp({
        phone: 'bodyMicro',
        longPhone: 'bodySmall',
    })

    const resendCodeDelaySize = useResponsiveProp({
        phone: 'bodySmall',
        longPhone: 'bodyLarge',
    })

    useEffect(() => {
        if (otp.length === 4)
            navigation.navigate(OnBoardingScreens.PasswordSignUpScreen, {email: route.params.email})
    }, [otp])

    useInterval(() => {
        if (resendCodeDelay > 0) setResendCodeDelay(delay => delay - 1)
    }, 1000)

    return (
        <OnboardingScreen
            content={
                <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                    <Flex fill gap="spacing24" marginTop="spacing24">
                        <OTPInput onTextChange={setOtp} />
                        <Text color="textSecondary" textAlign="center" variant={resendCodeSize}>
                            {t('Onboarding.ValidateEmail.CodeNotReceived')}{' '}
                            <Text
                                color="userThemeColor"
                                variant={resendCodeDelaySize}>{`${resendCodeDelay} `}</Text>
                            <Text color="textSecondary" variant={resendCodeSize}>
                                s
                            </Text>
                        </Text>
                        <Button
                            disabled={resendCodeDelay > 0}
                            emphasis={ButtonEmphasis.Outline}
                            onPress={(): void => {
                                setResendCodeDelay(RESEND_CODE_DELAY)
                            }}>
                            {t('Onboarding.ValidateEmail.Resend')}
                        </Button>
                    </Flex>
                </KeyboardAvoidingView>
            }
            subtitle={'' + t('Onboarding.ValidateEmail.SubTitle')}
            title={'' + t('Onboarding.ValidateEmail.Title')}
        />
    )
}

export default EmailValidateScreen
