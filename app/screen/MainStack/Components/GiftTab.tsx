import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {Flex} from 'app/components/layout/Flex'
import React, {useCallback} from 'react'
import {StyleSheet} from 'react-native'
import {Tabs} from 'react-native-collapsible-tab-view'
import {UserInfo} from 'app/redux/user/userReducer'
import {Text} from 'app/components/core/Text/Text'
import FastImage from 'react-native-fast-image'
import {useTranslation} from 'react-i18next'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {giftsObjects} from 'app/constants'

type GiftTabProps = {
    user: UserInfo
}

const GiftTab: React.FC<GiftTabProps> = ({user}): JSX.Element => {
    const gifts: any = user.gifts || []
    const {t} = useTranslation()
    const theme = useAppTheme()
    console.log('gifts keys', Object.keys(gifts))

    const renderEmtpyGift = useCallback(() => {
        return (
            <Flex
                justifyContent={'center'}
                alignItems={'center'}
                pt={'spacing60'}
                backgroundColor={'background0'}>
                <Ionicon name={'gift'} size={50} color={theme.colors.textSecondary} />
                <Text variant={'bodyLarge'} color={'textSecondary'}>
                    {t('gift_empty')}
                </Text>
            </Flex>
        )
    }, [])

    const renderItem = useCallback(
        ({item}: {item: any}) => (
            <Flex
                key={item}
                borderRadius={'rounded4'}
                alignItems={'center'}
                width={SCREEN_WIDTH / 4}
                marginVertical={'spacing10'}
                justifyContent={'center'}
                borderColor={'violetVibrant'}>
                <FastImage source={giftsObjects[item]?.image as any} style={styles.image} />
                <Text
                    style={{marginTop: -10}}
                    textAlign={'center'}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {t((giftsObjects[item] as any)?.title)}
                </Text>
                <Flex style={{marginTop: -15}} alignItems={'center'} flexDirection={'row'}>
                    <Text fontWeight={'bold'} variant={'bodyMicro'} color={'accentCritical'}>
                        x{gifts[item]}
                    </Text>
                </Flex>
            </Flex>
        ),
        [],
    )

    return (
        <Flex paddingHorizontal={'spacing4'}>
            <Tabs.FlatList
                data={Object.keys(gifts)}
                numColumns={4}
                renderItem={renderItem}
                ListEmptyComponent={renderEmtpyGift}
            />
        </Flex>
    )
}

export default GiftTab

const styles = StyleSheet.create({
    itemView: {
        width: (SCREEN_WIDTH - 12) / 2,
        height: (2 * SCREEN_WIDTH) / 3,
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 4,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
})
