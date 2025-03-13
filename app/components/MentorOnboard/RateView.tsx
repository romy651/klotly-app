import {Appearance, Keyboard} from 'react-native'
import React, {useEffect} from 'react'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {useTranslation} from 'react-i18next'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {Flex} from '../layout/Flex'
import {theme} from 'app/themes/Theme'
import {Text} from '../core/Text/Text'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {TextInput} from 'react-native-gesture-handler'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'

type Prop = {
    direction: 'left' | 'right'
    value: number
    setValue: (val: number) => void
}

const RateView = (prop: Prop) => {
    const dir = prop.direction
    const {t} = useTranslation()
    const inset = useSafeAreaInsets()
    const bioTop = useSharedValue<number>(0)
    const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100)
    const opacity = useSharedValue<number>(0)
    const {value, setValue} = prop
    const isdark = Appearance.getColorScheme() == 'dark'

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
            bioTop.value = withTiming(-150)
        })
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            bioTop.value = withTiming(0)
        })

        return () => {
            //disappear()
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])

    const bioInputStyle = useAnimatedStyle(() => {
        return {
            marginTop: bioTop.value,
            opacity: opacity.value,
            transform: [{translateX: translateX.value}],
        }
    })

    const appear = () => {
        translateX.value = withTiming(0)
        opacity.value = withTiming(1)
    }

    const disappear = () => {
        //translateX.value = withTiming(dir == 'right' ? -100 : 100)
        opacity.value = withTiming(0)
    }

    return (
        <>
            <Animated.ScrollView
                bounces
                style={bioInputStyle}
                onLayout={() => appear()}
                contentContainerStyle={{
                    width: SCREEN_WIDTH,
                    marginTop: 25,
                    paddingHorizontal: 15,
                    paddingBottom: inset.bottom + 200,
                }}>
                <Flex gap={'spacing10'}>
                    <Text fontWeight={'bold'} color={'textPrimary'} variant={'subheadLarge'}>
                        {t('set_hour_base_rate')}
                    </Text>
                    <Flex
                        borderRadius={'rounded8'}
                        mt={'spacing14'}
                        borderWidth={2}
                        flexDirection={'row'}
                        borderColor={'background3'}
                        justifyContent={'center'}
                        py={'spacing14'}
                        px={'spacing10'}>
                        <TextInput
                            value={(value || 0).toString()}
                            inputMode="numeric"
                            onChangeText={val => setValue(parseInt(val))}
                            style={{
                                width: SCREEN_WIDTH - 90,
                                color: isdark ? 'white' : theme.colors.textPrimary,
                            }}
                            placeholderTextColor={theme.colors.textSecondary}
                            maxLength={4}
                        />
                        <FontIcon name="coins" color={theme.colors.accentWarning} size={18} />
                    </Flex>
                    <Text
                        style={{marginTop: -5}}
                        variant={'buttonLabelMicro'}
                        color={'textSecondary'}>
                        {t('coin_to_usd')}
                    </Text>
                    <Flex
                        marginVertical={'spacing14'}
                        borderRadius={'rounded4'}
                        gap={'spacing10'}
                        px={'spacing10'}
                        py={'spacing14'}
                        flexDirection={'row'}
                        backgroundColor={'accentActionSoft'}>
                        <Feather
                            name="info"
                            color={isdark ? 'white' : theme.colors.textPrimary}
                            size={22}
                        />
                        <Text
                            style={{width: SCREEN_WIDTH - 70}}
                            variant={'bodyMicro'}
                            color={'textPrimary'}>
                            {t('can_change_after')}
                        </Text>
                    </Flex>
                    <Text variant={'subheadSmall'} fontWeight={'bold'} color={'textPrimary'}>
                        {t('our_commission')}
                    </Text>
                    <Text variant={'bodySmall'} color={'textPrimary'}>
                        {t('our_commission_desc')}
                    </Text>

                    <Flex gap={'spacing6'} mt={'spacing10'} flexDirection={'row'}>
                        <Entypo name="check" color={theme.colors.textSecondary} size={22} />
                        <Text
                            style={{width: SCREEN_WIDTH - 70}}
                            color={'textPrimary'}
                            variant={'bodySmall'}>
                            {t('our_commission1')}
                        </Text>
                    </Flex>

                    <Flex gap={'spacing6'} mt={'spacing10'} flexDirection={'row'}>
                        <Entypo name="check" color={theme.colors.textSecondary} size={22} />
                        <Text
                            style={{width: SCREEN_WIDTH - 70}}
                            color={'textPrimary'}
                            variant={'bodySmall'}>
                            {t('our_commission2')}
                        </Text>
                    </Flex>

                    <Flex gap={'spacing6'} mt={'spacing10'} flexDirection={'row'}>
                        <Entypo name="check" color={theme.colors.textSecondary} size={22} />
                        <Text
                            style={{width: SCREEN_WIDTH - 70}}
                            color={'textPrimary'}
                            variant={'bodySmall'}>
                            {t('our_commission3')}
                        </Text>
                    </Flex>

                    <Flex
                        flexDirection={'row'}
                        p={'spacing16'}
                        justifyContent={'space-between'}
                        mt={'spacing20'}
                        borderRadius={'rounded8'}
                        backgroundColor={'accentActiveSoft'}>
                        <Flex>
                            <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                                {t('completed_hours')}
                            </Text>
                            <Text variant={'bodySmall'} color={'textPrimary'}>
                                {`0 - 20 ${t('hours')}`}
                            </Text>
                            <Text variant={'bodySmall'} color={'textPrimary'}>
                                {`21 - 50 ${t('hours')}`}
                            </Text>
                            <Text variant={'bodySmall'} color={'textPrimary'}>
                                {`51 - 200 ${t('hours')}`}
                            </Text>
                            <Text variant={'bodySmall'} color={'textPrimary'}>
                                {`201 - 400 ${t('hours')}`}
                            </Text>
                            <Text variant={'bodySmall'} color={'textPrimary'}>
                                {`400+ ${t('hours')}`}
                            </Text>
                        </Flex>
                        <Flex>
                            <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                                {t('commission_rate')}
                            </Text>
                            <Text
                                fontWeight={'bold'}
                                textAlign={'right'}
                                variant={'bodySmall'}
                                color={'textPrimary'}>
                                33%
                            </Text>
                            <Text
                                fontWeight={'bold'}
                                textAlign={'right'}
                                variant={'bodySmall'}
                                color={'textPrimary'}>
                                28%
                            </Text>
                            <Text
                                fontWeight={'bold'}
                                textAlign={'right'}
                                variant={'bodySmall'}
                                color={'textPrimary'}>
                                25%
                            </Text>
                            <Text
                                fontWeight={'bold'}
                                textAlign={'right'}
                                variant={'bodySmall'}
                                color={'textPrimary'}>
                                22%
                            </Text>
                            <Text
                                fontWeight={'bold'}
                                textAlign={'right'}
                                variant={'bodySmall'}
                                color={'textPrimary'}>
                                18%
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        marginVertical={'spacing14'}
                        borderRadius={'rounded4'}
                        gap={'spacing10'}
                        px={'spacing10'}
                        py={'spacing14'}
                        flexDirection={'row'}
                        backgroundColor={'accentActionSoft'}>
                        <Feather
                            name="info"
                            color={isdark ? 'white' : theme.colors.textPrimary}
                            size={22}
                        />
                        <Text
                            style={{width: SCREEN_WIDTH - 80}}
                            variant={'bodyMicro'}
                            color={'textPrimary'}>
                            {t('recurrent_payment_students')}
                        </Text>
                    </Flex>
                </Flex>
            </Animated.ScrollView>
        </>
    )
}

export default RateView
