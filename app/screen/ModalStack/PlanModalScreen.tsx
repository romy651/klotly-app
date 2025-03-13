/**
 * @Project Summarised
 * @File PlanModalScreen.tsx
 * @Path app/screen/ModalStack
 * @Author BRICE ZELE
 * @Date 22/04/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ModalStackParamList, useAppStackNavigation} from '../../routes/screens/Screens.types'
import {ModalScreens, Stack} from '../../routes/screens/Stack'
import React from 'react'
import {Flex} from '../../components/layout/Flex'
import {Text} from '../../components/core/Text/Text'
import {Box} from '../../components/layout/Box'
import {Screen} from '../../components/layout/Screen'
import {useTranslation} from 'react-i18next'
import {ScrollView} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import LinearGradient from 'react-native-linear-gradient'
import PlanItem from '../../components/List/PlanItem'
import {OfferPlan} from '../../constants/OfferPlan'
import {Button} from '../../components/core/Button/Button'

type Props = NativeStackScreenProps<ModalStackParamList, ModalScreens.Plan>

const PlanModalScreen: React.FC<Props> = ({navigation}): JSX.Element => {
    const {t} = useTranslation()
    const theme = useAppTheme()
    const appNavigation = useAppStackNavigation()

    return (
        <Screen edges={['bottom', 'top', 'left', 'right']}>
            {/*            {isIos && (
                <BlurView
                    intensity={99}
                    style={[BlurViewStyle.base]}
                    tint={isDarkMode ? 'dark' : 'light'}
                />
            )}*/}
            <ScrollView contentContainerStyle={{flex: 1}}>
                <Flex gap="spacing24">
                    <Flex alignItems="center" gap="spacing24">
                        <Flex alignItems="center" gap="spacing12">
                            <Text color="textPrimary" textAlign="center" variant="headlineLarge">
                                {t('Plan.Title')}
                            </Text>
                            <Box alignItems="center">
                                <Text color="textSecondary" textAlign="center" variant="bodySmall">
                                    {t('Plan.Description')}
                                </Text>
                            </Box>
                            <Flex
                                flexDirection="row"
                                justifyContent="space-between"
                                paddingHorizontal="spacing36"
                                pb="spacing12">
                                <LinearGradient
                                    colors={[theme.colors.userThemeColor, 'transparent']}
                                    end={{x: 1, y: 1}}
                                    start={{x: 0, y: 0}}
                                    style={{width: 30, height: '100%', borderRadius: 20}}
                                />
                                <Flex>
                                    {OfferPlan.map((plan, index) => (
                                        <PlanItem
                                            key={`plan-item-${index}`}
                                            description={t(plan.description)}
                                            title={t(plan.title)}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                            <Flex gap="spacing8" paddingHorizontal="spacing36">
                                <Text variant="buttonLabelMedium">{t('Plan.Cancel')}</Text>
                                <Text variant="bodyMicro">{t('Plan.Cancel.Description')}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex paddingHorizontal="spacing36">
                        <Button
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
                </Flex>
            </ScrollView>
        </Screen>
    )
}

export default PlanModalScreen
