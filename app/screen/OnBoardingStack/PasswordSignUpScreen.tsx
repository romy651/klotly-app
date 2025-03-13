/**
 * @Project Summarised
 * @File PasswordSignUpScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import {useResponsiveProp} from '@shopify/restyle'
import OnboardingScreen from './components/OnboardingScreen'
import {Button, ButtonSize} from '../../components/core/Button/Button'

import {OnBoardingStackParamList} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {KeyboardAvoidingView} from 'react-native'
import {FadeInDown} from 'react-native-reanimated'
import PasswordInput from '../../components/core/Input/PasswordInput'

type Props = NativeStackScreenProps<
    OnBoardingStackParamList,
    OnBoardingScreens.PasswordSignUpScreen
>

const PasswordSignUpScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
    const {t} = useTranslation()
    const [loading] = useState(false)
    const [password, setPassword] = useState('')
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const handleGoToSelectThematic = (): void => {
        navigation.navigate(OnBoardingScreens.SelectThematicScreen)
    }

    return (
        <OnboardingScreen
            content={
                <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                    <Flex fill gap="spacing12" marginTop="spacing24">
                        <PasswordInput
                            outline
                            placeholder={'' + t('Password')}
                            onBlur={(): void => {}}
                            onChangeText={setPassword}
                        />
                    </Flex>
                </KeyboardAvoidingView>
            }
            footer={
                <AnimatedFlex
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    justifyContent="flex-end">
                    <Button loading={loading} size={buttonSize} onPress={handleGoToSelectThematic}>
                        {t('Next')}
                    </Button>
                </AnimatedFlex>
            }
            subtitle={'' + t('Onboarding.PasswordSignUp.SubTitle')}
            title={'' + t('Onboarding.PasswordSignUp.Title')}
        />
    )
}

export default PasswordSignUpScreen
