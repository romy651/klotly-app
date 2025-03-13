import React, {useCallback, useMemo, useRef} from 'react'
import {StyleSheet} from 'react-native'
import {useTranslation} from 'react-i18next'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
} from '@gorhom/bottom-sheet'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {AppStackParamList} from 'app/routes/screens/Screens.types'
import {Stack} from 'app/routes/screens/Stack'
import {Flex} from 'app/components/layout/Flex'
import {Text} from 'app/components/core/Text/Text'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {useBackHandler} from '@react-native-community/hooks'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import FastImage from 'react-native-fast-image'
import Octicon from 'react-native-vector-icons/Octicons'
import moment from 'moment'

type Props = NativeStackScreenProps<AppStackParamList, Stack.BookingMenuScreen>

const BookingMenuScreen: React.FC<Props> = ({navigation, route}) => {
    const {t} = useTranslation()
    const {booking, other} = route.params
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => [100 + 110 + 50 * 3], [])
    const theme = useAppTheme()
    const date = moment(booking.date).format('ll')

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                style={styles.backdrop}
                pressBehavior="close"
                disappearsOnIndex={-1}
            />
        ),
        [],
    )
    useBackHandler(() => {
        navigation.goBack()
        return true
    })

    const handleSheetChanges = useCallback(
        (ind: number) => {
            if (ind === -1) {
                navigation.goBack()
            }
        },
        [navigation],
    )

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            enablePanDownToClose
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor: theme.colors.background2}}
            handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
            style={styles.bsheet}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={styles.contentContainer}>
                <Flex
                    borderBottomWidth={1}
                    alignItems={'center'}
                    borderBottomColor={'background3'}
                    pb={'spacing14'}
                    pt={'spacing2'}
                    flexDirection={'row'}>
                    <FastImage source={{uri: other.avatar}} style={styles.avatar} />
                    <Flex gap={'spacing8'}>
                        <Text
                            style={{width: SCREEN_WIDTH - 160}}
                            variant={'buttonLabelSmall'}
                            color={'textSecondary'}>
                            {booking.topic || ''} {t('with')}{' '}
                            <Text
                                variant={'buttonLabelSmall'}
                                color={
                                    'textPrimary'
                                }>{`${other.firstName} ${other.lastName}`}</Text>
                        </Text>
                        <Flex flexDirection={'row'} alignItems={'center'}>
                            <Octicon color={theme.colors.textSecondary} name="id-badge" size={16} />
                            <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                                #{booking.id}
                            </Text>
                        </Flex>
                        <Flex
                            width={SCREEN_WIDTH - 140}
                            justifyContent={'space-between'}
                            flexDirection={'row'}
                            style={{marginTop: -5}}
                            alignItems={'center'}>
                            <Flex flexDirection={'row'} alignItems={'center'}>
                                <Ionicon
                                    color={theme.colors.textSecondary}
                                    name="calendar-outline"
                                    size={16}
                                />
                                <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                                    {date} - {booking.time}
                                </Text>
                            </Flex>
                            <Flex
                                height={30}
                                px={'spacing10'}
                                backgroundColor={'background2'}
                                borderRadius={'rounded4'}
                                alignItems={'center'}
                                justifyContent={'center'}>
                                <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                                    {t(booking.type)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </BottomSheetView>
        </BottomSheet>
    )
}

export default BookingMenuScreen

const styles = StyleSheet.create({
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    bottomSheet: {
        alignItems: 'center',
        elevation: 5,
        left: 0,
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        width: '100%',
        zIndex: 1,
    },
    backdrop: {
        backgroundColor: 'black',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: 'absolute',
    },
    bsheet: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})
