/**
 * @Project Summarised
 * @File SelectThematicScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 28/03/2023
 */
import {useState} from 'react'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import OnboardingScreen from './components/OnboardingScreen'
// eslint-disable-next-line jest/no-mocks-import
import {thematicsMocks} from '../../../__mocks__/screens/OnBoardingScreen/OnboardingScreenMocks'
import OptionCard from '../../components/Card/OptionCard'
import {FadeInUp, Layout} from 'react-native-reanimated'
import {ICategory, IThematic} from '../../domain/interface/IThematic'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {Button, ButtonEmphasis, ButtonSize} from 'app/components/core/Button/Button'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {useResponsiveProp} from '@shopify/restyle'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {updateOnboarding} from 'app/actions/userAction'
import {useDispatch} from 'react-redux'

type Props = NativeStackScreenProps<
    OnBoardingStackParamList,
    OnBoardingScreens.SelectThematicScreen
>

const SelectThematicScreen: React.FC<Props> = (): JSX.Element => {
    const {t} = useTranslation()
    const navigation = useOnboardStackNavigation()
    const isDarkMode = useDarkMode()
    const dispatch = useDispatch()
    const userId = useAppSelector(state => state.user.id)
    const [loading, setLoading] = useState<boolean>(false)
    const [thematicsSelected, setThematicsSelected] = useState<Array<IThematic>>([])
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const handleToggleThematic = (selectedThematic: IThematic): void => {
        'worklet'
        if (thematicsSelected.find(element => element.id === selectedThematic.id))
            setThematicsSelected(thematics =>
                thematics.filter(item => item.id !== selectedThematic.id),
            )
        else setThematicsSelected(thematics => [...thematics, selectedThematic])
    }

    const onNext = () => {
        updateOnboarding(
            setLoading,
            'thematics',
            thematicsSelected.map(elt => elt.title),
            userId,
            dispatch,
            () => {
                navigation.navigate(OnBoardingScreens.SelectCategoriesScreen, {
                    thematics: thematicsSelected,
                })
            },
        )
    }

    return (
        <OnboardingScreen
            content={
                <Flex grow gap="spacing12" marginTop="spacing24">
                    {thematicsMocks.map((item, index) => (
                        <AnimatedFlex
                            key={`option-card-${index}`}
                            entering={FadeInUp.delay(index * 50)}
                            layout={Layout.springify()}>
                            <OptionCard
                                multipleSelection
                                selected={thematicsSelected.includes(item)}
                                title={t(item.title)}
                                onPress={(): void => handleToggleThematic(item)}
                            />
                        </AnimatedFlex>
                    ))}
                </Flex>
            }
            footer={
                <AnimatedFlex mb={'spacing20'} justifyContent="flex-end">
                    <Button
                        backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                        emphasis={isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary}
                        size={buttonSize}
                        loading={loading}
                        style={{borderRadius: 8}}
                        onPress={onNext}>
                        {t('Next')}
                    </Button>
                </AnimatedFlex>
            }
            title={'' + t('Onboarding.Step1.Title')}
        />
    )
}

export default SelectThematicScreen
