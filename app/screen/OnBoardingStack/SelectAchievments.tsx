/**
 * @Project Summarised
 * @File SelectCategoriesScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 02/04/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import OnboardingScreen from './components/OnboardingScreen'
import OptionCard from '../../components/Card/OptionCard'
import {FadeInUp, Layout} from 'react-native-reanimated'
import {IAchievment, ICategory, IThematic} from '../../domain/interface/IThematic'
// eslint-disable-next-line jest/no-mocks-import
import {
    achievments,
    thematicsMocks,
} from '../../../__mocks__/screens/OnBoardingScreen/OnboardingScreenMocks'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {Text} from '../../components/core/Text/Text'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {Button, ButtonEmphasis, ButtonSize} from 'app/components/core/Button/Button'
import {useResponsiveProp} from '@shopify/restyle'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {useDispatch} from 'react-redux'
import {updateOnboarding} from 'app/actions/userAction'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.SelectAchievments>

const SelectAchievments: React.FC<Props> = ({route}): JSX.Element => {
    const {t} = useTranslation()
    const navigation = useOnboardStackNavigation()
    const isDarkMode = useDarkMode()
    const userId = useAppSelector(state => state.user.id)
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [selectedAchievments, setSelectedAchievments] = useState<IAchievment[]>([])
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const handleToggleThematic = (selectedAchievment: IAchievment): void => {
        if (selectedAchievments.find(element => element.title === selectedAchievment.title))
            setSelectedAchievments(thematics =>
                thematics.filter(item => item.title !== selectedAchievment.title),
            )
        else setSelectedAchievments(thematics => [...thematics, selectedAchievment])
    }

    const onNext = () => {
        updateOnboarding(
            setLoading,
            'achievments',
            selectedAchievments.map(elt => elt.title),
            userId,
            dispatch,
            () => {
                navigation.navigate(OnBoardingScreens.NotificationSetupScreen)
            },
        )
    }

    return (
        <OnboardingScreen
            content={
                <Flex grow gap="spacing12" marginTop="spacing24">
                    {achievments?.map((item, index) => (
                        <AnimatedFlex
                            key={`option-card-${index}`}
                            entering={FadeInUp.delay(index * 50)}
                            layout={Layout.springify()}>
                            <OptionCard
                                multipleSelection
                                selected={selectedAchievments.includes(item)}
                                title={t(item.title)}
                                onPress={(): void => {
                                    handleToggleThematic(item)
                                }}
                                icon={
                                    <item.component
                                        name={item.icon_name}
                                        color={isDarkMode ? 'white' : 'black'}
                                        size={item.size}
                                    />
                                }
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
            title={'' + t('what_you_want_achieve')}
        />
    )
}

export default SelectAchievments
