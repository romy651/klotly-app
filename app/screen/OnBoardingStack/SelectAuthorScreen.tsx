/**
 * @Project Summarised
 * @File SelectAuthorScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 08/04/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import {useResponsiveProp} from '@shopify/restyle'
import OnboardingScreen from './components/OnboardingScreen'
import {Button, ButtonSize} from '../../components/core/Button/Button'
// eslint-disable-next-line jest/no-mocks-import
import {authorMocks} from '../../../__mocks__/screens/OnBoardingScreen/OnboardingScreenMocks'
import {Text} from '../../components/core/Text/Text'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {IAuthor} from '../../domain/interface/IAuthor'
import AuthorButton from '../../components/AuthorButton'
import {FadeInDown} from 'react-native-reanimated'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'
import {chunk} from 'lodash'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.SelectAuthorScreen>

const SelectAuthorScreen: React.FC<Props> = (): JSX.Element => {
    const {t} = useTranslation()
    const isDarkMode = useDarkMode()
    //const {categories} = route.params
    const navigation = useOnboardStackNavigation()

    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const authorColumn = useResponsiveProp({
        phone: 2,
        longPhone: 3,
    })
    const [authors] = useState(chunk(authorMocks, authorColumn))

    const [authorsSelected, setAuthorsSelected] = useState<Array<IAuthor>>([])

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
                <Text
                    color={isDarkMode ? 'accentActive' : 'accentAction'}
                    variant="bodySmall"
                    onPress={handleGoToBookScreen}>
                    {t('Navigation.Header.Skip')}
                </Text>
            ),
        })
    }, [navigation])

    const handleToggleAuthor = (selectedThematic: IAuthor): void => {
        if (authorsSelected.find(element => element.id === selectedThematic.id))
            setAuthorsSelected(thematics =>
                thematics.filter(item => item.id !== selectedThematic.id),
            )
        else setAuthorsSelected(thematics => [...thematics, selectedThematic])
    }

    const handleGoToBookScreen = (): void => {
        navigation.navigate(OnBoardingScreens.SelectBooksScreen, {
            authors: authorsSelected,
        })
    }

    return (
        <OnboardingScreen
            content={
                <Flex fill gap="spacing12" marginTop="spacing24">
                    {authors.map((authors, i) => (
                        <AnimatedFlex
                            key={`authors-${i}`}
                            grow
                            entering={FadeInDown.delay(i * 100)}
                            flexDirection="row">
                            {authors.map((author: IAuthor, index) => (
                                <AuthorButton
                                    key={`author-${index}`}
                                    name={author.name}
                                    picture={author.picture}
                                    selected={authorsSelected.includes(author)}
                                    onPress={(): void => {
                                        handleToggleAuthor(author)
                                    }}
                                />
                            ))}
                        </AnimatedFlex>
                    ))}
                </Flex>
            }
            footer={
                <Flex justifyContent="flex-end">
                    <Button size={buttonSize} onPress={handleGoToBookScreen}>
                        {t('Next')}
                    </Button>
                </Flex>
            }
            subtitle={'' + t('Onboarding.Step3.SubTitle')}
            title={'' + t('Onboarding.Step3.Title')}
        />
    )
}

export default SelectAuthorScreen
