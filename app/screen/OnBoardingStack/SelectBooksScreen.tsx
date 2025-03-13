/**
 * @Project Summarised
 * @File SelectBooksScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 08/04/2023
 */

import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useResponsiveProp} from '@shopify/restyle'
import {Button, ButtonEmphasis, ButtonSize} from '../../components/core/Button/Button'
import OnboardingScreen from './components/OnboardingScreen'
import {Flex} from '../../components/layout/Flex'
import Swiper from 'react-native-deck-swiper'
import SwipeCard from '../../components/Card/SwipeCard'
// eslint-disable-next-line jest/no-mocks-import
import {booksMocks} from '../../../__mocks__/screens/OnBoardingScreen/OnboardingScreenMocks'
import {IBook} from '../../domain/interface/IBook'
import {StyleSheet} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {Text} from '../../components/core/Text/Text'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {
    OnBoardingStackParamList,
    useOnboardStackNavigation,
} from '../../routes/screens/Screens.types'
import {OnBoardingScreens} from '../../routes/screens/Stack'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.SelectBooksScreen>

const OverLayText: React.FC<PropsWithChildren<{type: 'accept' | 'decline'}>> = ({
    type,
    children,
}): JSX.Element => (
    <Flex
        alignItems="center"
        backgroundColor={type === 'accept' ? 'accentSuccess' : 'accentCritical'}
        borderRadius="rounded8"
        justifyContent="center"
        p="spacing12">
        <Text color="white" variant="subheadLarge">
            {children}
        </Text>
    </Flex>
)

const SelectBooksScreen: React.FC<Props> = (): JSX.Element => {
    const {t} = useTranslation()
    const theme = useAppTheme()
    const navigation = useOnboardStackNavigation()
    const isDarkMode = useDarkMode()
    const swipeRef = useRef<Swiper<IBook>>(null)
    //const [categories] = useState(thematicsMocks.find(item => item.slug === thematic.slug)?.items)
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const [booksSelected] = useState<Array<IBook>>([])

    const handleGoToNotificationSetupScreen = (): void => {
        navigation.navigate(OnBoardingScreens.NotificationSetupScreen, {
            books: booksSelected,
        })
    }

    return (
        <OnboardingScreen
            content={
                <Flex fill>
                    <Swiper
                        ref={swipeRef}
                        animateCardOpacity
                        animateOverlayLabelsOpacity
                        showSecondCard
                        swipeBackCard
                        backgroundColor={theme.colors.background0}
                        cardHorizontalMargin={0}
                        cardIndex={0}
                        cardStyle={{maxWidth: '100%', maxHeight: '100%'}}
                        cardVerticalMargin={0}
                        cards={booksMocks}
                        onSwipedAll={() => console.log('everything is swiped now')}
                        containerStyle={styles.containerSwiper}
                        overlayLabels={{
                            left: {
                                title: t('Onboarding.Step3.Swiper.Decline').toUpperCase(),
                                element: (
                                    <OverLayText type="decline">
                                        {t('Onboarding.Step3.Swiper.Decline').toUpperCase()}
                                    </OverLayText>
                                ),
                                style: {
                                    wrapper: {
                                        ...styles.overlayWrapper,
                                        alignItems: 'flex-end',
                                        marginLeft: -60,
                                    },
                                },
                            },
                            right: {
                                title: t('Onboarding.Step3.Swiper.Accept').toUpperCase(),
                                element: (
                                    <OverLayText type="accept">
                                        {t('Onboarding.Step3.Swiper.Accept').toUpperCase()}
                                    </OverLayText>
                                ),
                                style: {
                                    wrapper: {
                                        ...styles.overlayWrapper,
                                        alignItems: 'flex-start',
                                        marginLeft: 30,
                                    },
                                },
                            },
                        }}
                        renderCard={(book): JSX.Element => (
                            <SwipeCard picture={book.picture} title={book.title} />
                        )}
                        stackSeparation={15}
                        stackSize={3}
                    />
                </Flex>
            }
            enableScroll={false}
            footer={
                <Flex mb={'spacing20'} justifyContent="flex-end">
                    <Button
                        backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                        emphasis={isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary}
                        size={buttonSize}
                        style={{borderRadius: 8}}
                        onPress={handleGoToNotificationSetupScreen}>
                        {t('Navigation.Header.Skip')}
                    </Button>
                </Flex>
            }
            subtitle={'' + t('Onboarding.StepSelectBook.SubTitle')}
            title={'' + t('Onboarding.StepSelectBook.Title')}
        />
    )
}

const styles = StyleSheet.create({
    containerSwiper: {
        alignItems: 'center',
    },
    overlayWrapper: {
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: -30,
        marginTop: 30,
    },
})

export default SelectBooksScreen
