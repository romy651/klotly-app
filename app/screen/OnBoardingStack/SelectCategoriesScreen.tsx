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
import {ICategory, IThematic} from '../../domain/interface/IThematic'
// eslint-disable-next-line jest/no-mocks-import
import {thematicsMocks} from '../../../__mocks__/screens/OnBoardingScreen/OnboardingScreenMocks'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {Text} from '../../components/core/Text/Text'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {Button, ButtonEmphasis, ButtonSize} from 'app/components/core/Button/Button'
import {useResponsiveProp} from '@shopify/restyle'
import {updateOnboarding} from 'app/actions/userAction'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {useDispatch} from 'react-redux'

type Props = NativeStackScreenProps<
    OnBoardingStackParamList,
    OnBoardingScreens.SelectCategoriesScreen
>

const extractCategories = (thematics: IThematic[]) => {
    let res: ICategory[] = []
    thematics.map(items => {
        res = [...res, ...items.items]
    })
    return res
}

const filterCategories = (thematics: IThematic[]) => {
    const categories = extractCategories(thematics)
    const res = categories.reduce((accumulator: ICategory[], current: ICategory) => {
        if (!accumulator.find(item => item.title === current.title)) {
            accumulator.push(current)
        }
        return accumulator
    }, [])
    console.log('the res: ', res)
    return res
}

const SelectCategoriesScreen: React.FC<Props> = ({route}): JSX.Element => {
    const {t} = useTranslation()
    const {thematics} = route.params
    const navigation = useOnboardStackNavigation()
    const isDarkMode = useDarkMode()
    const categories = filterCategories(thematics)
    const [loading, setLoading] = useState<boolean>(false)
    const userId = useAppSelector(state => state.user.id)
    const dispatch = useDispatch()
    const [thematicsSelected, setThematicsSelected] = useState<Array<ICategory>>([])
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const handleToggleThematic = (selectedThematic: ICategory): void => {
        if (thematicsSelected.find(element => element.id === selectedThematic.id))
            setThematicsSelected(thematics =>
                thematics.filter(item => item.id !== selectedThematic.id),
            )
        else setThematicsSelected(thematics => [...thematics, selectedThematic])
    }

    const onNext = () => {
        updateOnboarding(
            setLoading,
            'categories',
            thematicsSelected.map(elt => elt.title),
            userId,
            dispatch,
            () => {
                navigation.navigate(OnBoardingScreens.SelectAchievments)
            },
        )
    }

    return (
        <OnboardingScreen
            content={
                <Flex grow gap="spacing12" marginTop="spacing24">
                    {categories?.map((item: ICategory, index: number) => (
                        <AnimatedFlex
                            key={`option-card-${index}`}
                            entering={FadeInUp.delay(index * 50)}
                            layout={Layout.springify()}>
                            <OptionCard
                                multipleSelection
                                selected={thematicsSelected.includes(item)}
                                title={t(item.title)}
                                onPress={(): void => {
                                    handleToggleThematic(item)
                                }}
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
            title={'' + t('Onboarding.Step2.Title')}
        />
    )
}

export default SelectCategoriesScreen
