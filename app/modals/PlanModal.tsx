/**
 * @Project Summarised
 * @File PlanModal.tsx
 * @Path app/ModalStack
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import React, {useCallback} from 'react'
import {useAppTheme} from '../hooks/theme/useAppTheme'
import {useAppDispatch} from '../hooks/state/useAppDispatch'
import {closeModal} from '../redux/modals/modal.reducer'
import {ModalName} from '../routes/modals/Modals'
import {BottomSheetModal} from './components/BottomSheetModal'
import {Screen} from '../components/layout/Screen'
import {Flex} from '../components/layout/Flex'
import {useTranslation} from 'react-i18next'
import {Box} from '../components/layout/Box'
import {Text} from '../components/core/Text/Text'

import PlanItem from '../components/List/PlanItem'
import LinearGradient from 'react-native-linear-gradient'
import {OfferPlan} from '../constants/OfferPlan'
import {Button} from '../components/core/Button/Button'
import {ScrollView, StyleSheet} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {Stack} from '../routes/screens/Stack'
import {useAppStackNavigation} from '../routes/screens/Screens.types'

const PlanModal: React.FC = (): JSX.Element => {
    const theme = useAppTheme()
    const appDispatch = useAppDispatch()
    const {t} = useTranslation()
    const navigation = useAppStackNavigation()

    const onClose = useCallback((): void => {
        appDispatch(closeModal({name: ModalName.Plan}))
    }, [appDispatch])

    const goToHomeScreen = async (): Promise<void> => {
        const routes = [
            {
                name: Stack.BottomTabsStack,
            },
        ]
        navigation.reset({
            index: 0,
            routes,
        })

        onClose()
    }

    return (
        <BottomSheetModal
            hideKeyboardOnDismiss
            backgroundColor={theme.colors.background1}
            disableSwipe={false}
            name={ModalName.Plan}
            renderBehindInset={true}
            onClose={onClose}>
            <Screen edges={['bottom', 'top']} mb="spacing24" pt="spacing16" px="spacing24">
                <ScrollView contentContainerStyle={{flex: 1}}>
                    <Flex gap="spacing24">
                        <Flex alignItems="center" gap="spacing24">
                            <Flex alignItems="center" gap="spacing12">
                                <Text
                                    color="textPrimary"
                                    textAlign="center"
                                    variant="headlineLarge">
                                    {t('Plan.Title')}
                                </Text>
                                <Box alignItems="center">
                                    <Text
                                        color="textSecondary"
                                        textAlign="center"
                                        variant="bodySmall">
                                        {t('Plan.Description')}
                                    </Text>
                                </Box>
                                <Flex
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    pb="spacing12">
                                    <LinearGradient
                                        colors={[theme.colors.userThemeColor, 'transparent']}
                                        end={{x: 1, y: 1}}
                                        start={{x: 0, y: 0}}
                                        style={styles.linearGradient}
                                    />
                                    <Flex>
                                        {OfferPlan.map((plan, index) => (
                                            <PlanItem
                                                key={`plan-item-${index}`}
                                                description={t(plan.description)}
                                                icon={
                                                    <FontAwesome
                                                        color={theme.colors.textPrimary}
                                                        name="lock"
                                                        size={24}
                                                    />
                                                }
                                                title={t(plan.title)}
                                            />
                                        ))}
                                    </Flex>
                                </Flex>
                                <Flex gap="spacing8">
                                    <Text variant="buttonLabelMedium">{t('Plan.Cancel')}</Text>
                                    <Text variant="bodyMicro">{t('Plan.Cancel.Description')}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex>
                            <Button onPress={goToHomeScreen}>{t('Plan.Submit')}</Button>
                        </Flex>
                    </Flex>
                </ScrollView>
            </Screen>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        borderRadius: 20,
        height: '100%',
        left: 38,
        position: 'absolute',
        top: 15,
        width: 10,
    },
})

export default PlanModal
