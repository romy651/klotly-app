/**
 * @Project Summarised
 * @File PlanModalScreen.tsx
 * @Path app/screen/ModalStack
 * @Author BRICE ZELE
 * @Date 22/04/2023
 */

import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {OnBoardingStackParamList, useAppStackNavigation} from '../../routes/screens/Screens.types'
import {OnBoardingScreens, Stack} from '../../routes/screens/Stack'
import React from 'react'
import {StyleSheet, Platform} from 'react-native'
import {Flex} from '../../components/layout/Flex'
import {Text} from '../../components/core/Text/Text'
import {Screen} from '../../components/layout/Screen'
import {useTranslation} from 'react-i18next'
import {ScrollView} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import LinearGradient from 'react-native-linear-gradient'
import PlanItem from '../../components/List/PlanItem'
import {OfferPlan} from '../../constants/OfferPlan'
import {Button, ButtonEmphasis, ButtonSize} from '../../components/core/Button/Button'
import Ionicon from 'react-native-vector-icons/Ionicons'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {useResponsiveProp} from '@shopify/restyle'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {getCurrency} from 'app/utils/tools'

type Props = NativeStackScreenProps<OnBoardingStackParamList, OnBoardingScreens.PricingScreen>

const currentPrice = 50

const PricingScreen: React.FC<Props> = ({navigation}): JSX.Element => {
    const {t} = useTranslation()
    const theme = useAppTheme()
    const appNavigation = useAppStackNavigation()
    const isDarkMode = useDarkMode()
    const insets = useSafeAreaInsets()
    const user = useAppSelector(state => state.user)
    console.log('the user country: ', user.country)
    const currentLocal = getCurrency(user.country.toUpperCase())
    const totalPrice = currentLocal.rate * currentPrice

    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })

    const onClose = (): void => {}

    return (
        <Screen edges={['bottom', 'top', 'left', 'right']}>
            <ScrollView contentContainerStyle={{flex: 1, marginHorizontal: 10}}>
                <Button
                    CustomIcon={
                        <Ionicon color={isDarkMode ? 'white' : 'black'} name="close" size={26} />
                    }
                    backgroundColor="translucentBackground"
                    emphasis={ButtonEmphasis.Secondary}
                    size={buttonSize}
                    style={styles.centerButton}
                    onPress={onClose}
                />
                <Flex>
                    <Flex alignItems="center">
                        <Flex alignItems="center" width="100%">
                            <Text
                                color="textPrimary"
                                fontWeight="bold"
                                style={{width: '100%'}}
                                textAlign="center"
                                variant="headlineSmall">
                                {t('Plan.Title')}
                            </Text>
                            <Flex
                                flexDirection="row"
                                justifyContent="space-between"
                                mt="spacing6"
                                paddingHorizontal="spacing36"
                                pb="spacing12">
                                <LinearGradient
                                    colors={[theme.colors.userThemeColor, 'transparent']}
                                    end={{x: 1, y: 1}}
                                    start={{x: 0, y: 0}}
                                    style={{
                                        width: 25,
                                        height: '100%',
                                        borderRadius: 20,
                                        position: 'absolute',
                                        left: 54,
                                    }}
                                />
                                <Flex>
                                    {OfferPlan.map((plan, index) => (
                                        <PlanItem
                                            key={`plan-item-${index}`}
                                            description={t(plan.description)}
                                            icon={plan.icon}
                                            size={plan.size}
                                            title={t(plan.title)}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                            <Text
                                color="textPrimary"
                                style={{width: '100%'}}
                                textAlign="center"
                                variant="bodyLarge">
                                {t('days_free_then')}{' '}
                                <Text fontWeight="bold" variant="bodyLarge">
                                    {`${currentLocal.currency} ${totalPrice}/${t('year')}`}
                                </Text>
                                {'\n'}{' '}
                                {`(${t('only')} ${currentLocal.currency}${(
                                    totalPrice / 12
                                ).toPrecision(1)}/${t('month')})`}
                            </Text>
                            <Flex
                                alignItems="center"
                                backgroundColor="background2"
                                borderColor="background3"
                                borderRadius="rounded8"
                                borderWidth={1}
                                flexDirection="row"
                                justifyContent="center"
                                mt="spacing48"
                                px="spacing18"
                                py="spacing10">
                                {Platform.OS == 'ios' ? (
                                    <Ionicon color="black" name="logo-apple-appstore" size={22} />
                                ) : (
                                    <Ionicon color="black" name="logo-google-playstore" size={22} />
                                )}
                                <Text color="textOnDimPrimary" variant="bodyLarge">
                                    {Platform.OS == 'ios'
                                        ? t('secured_with_apple')
                                        : t('secured_with_google')}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex bottom={insets.bottom + 20} position="absolute" px="spacing16" width="100%">
                    <Button
                        backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                        emphasis={isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary}
                        size={buttonSize}
                        style={{borderRadius: 8}}
                        onPress={(): void => {
                            navigation.pop()
                            setTimeout(() => {
                                appNavigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: Stack.AuthStack,
                                        },
                                    ],
                                })
                            }, 100)
                        }}>
                        {t('Plan.Submit')}
                    </Button>
                </Flex>
            </ScrollView>
        </Screen>
    )
}

export default PricingScreen

const styles = StyleSheet.create({
    centerButton: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
})
