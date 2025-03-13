import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Image, ScrollView, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {
  convertTimezone,
  convertToGMTFormat,
  isMeetingUpcoming,
  listenStatus,
} from 'app/utils/tools';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Text} from 'app/components/core/Text/Text';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import MapView from 'react-native-maps';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import UserItemRow from './Components/UseritemRow';
import {useBooking} from 'app/hooks/useBooking';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.AppointmentScreen
>;

const AppointmentScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  const rate = useAppSelector(state => state.application.exchangeRate);
  //@ts-ignore
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {canCancelBooking} = useBooking();
  const {booking, tutor, students} = route.params;
  const date = moment(booking.date).format('ll');
  const me = useAppSelector(state => state.user);
  const location = {lat: 48.8575, lng: 2.3514};
  const unitPrice = Math.ceil(booking.price * rate);
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toUpperCase()] as string;

  const other_participats = students.filter(st => st.id !== me.id);

  const isArchived = useMemo(() => {
    return (
      ['canceled', 'rejected', 'completed'].includes(booking.status) ||
      !isMeetingUpcoming(booking, me.timeZone)
    );
  }, [me.timeZone, booking]);

  useEffect(() => {
    (async () => {
      listenStatus(me?.id as string);
    })();
  }, [me.id]);

  /*


                <Touchable activeOpacity={0.8}>
                    <Flex
                        height={35}
                        backgroundColor={'background2'}
                        borderRadius={'rounded12'}
                        px={'spacing10'}
                        alignItems={'center'}
                        flexDirection={'row'}
                        justifyContent={'center'}
                        my={'spacing4'}>
                        <Text color={'textSecondary'} variant={'buttonLabelSmall'}>
                            {t('edit')}
                        </Text>
                    </Flex>
                </Touchable>
                <Touchable activeOpacity={0.8}>
                    <Flex
                        height={35}
                        px={'spacing12'}
                        backgroundColor={'accentWarningSoft'}
                        borderRadius={'rounded12'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        my={'spacing4'}>
                        <Text color={'accentCritical'} variant={'buttonLabelSmall'}>
                            {t('cancel')}
                        </Text>
                    </Flex>
                </Touchable>
    */

  const reschedule = useCallback(() => {
    navigation.navigate(Stack.RescheduleScreen, {
      booking,
      reason: 'reschedule',
      tutor,
    });
  }, [navigation, booking, tutor]);

  const onCancel = useCallback(() => {
    if (canCancelBooking(booking)) {
      navigation.navigate(Stack.RescheduleScreen, {
        booking,
        reason: 'cancel',
        tutor,
      });
    } else {
      Alert.alert(t('error'), t('cannot_cancel_booking') as string);
    }
  }, [navigation, booking, tutor, t, canCancelBooking]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopWidth={1}
        borderTopColor={'background3'}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        flexDirection={'row'}
        justifyContent={'center'}
        width="100%">
        {!me.isTutor && (
          <Flex width={SCREEN_WIDTH / 2 - 30}>
            <Button
              backgroundColor={'background3'}
              emphasis={ButtonEmphasis.Secondary}
              size={ButtonSize.Medium}
              style={{borderRadius: 15}}
              onPress={reschedule}>
              {t('edit')}
            </Button>
          </Flex>
        )}
        <Flex width={me.isTutor ? '100%' : SCREEN_WIDTH / 2 - 30}>
          <Button
            backgroundColor={'accentCritical'}
            emphasis={ButtonEmphasis.Outline}
            size={ButtonSize.Medium}
            style={{borderRadius: 15}}
            onPress={onCancel}>
            {t('cancel')}
          </Button>
        </Flex>
      </Flex>
    ),
    [reschedule, onCancel, me.isTutor, t],
  );

  const onPay = () => {};

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        showBorder
        showBackButton
        withCoin
        title={t('appointment') as string}
      />
      <Flex gap={'spacing10'} flex={1} backgroundColor={'background0'}>
        <ScrollView contentContainerStyle={{paddingBottom: 90}}>
          {!booking.isPaid && !me.isTutor && (
            <Flex
              borderWidth={1}
              backgroundColor={'accentCriticalSoft'}
              borderColor={'background3'}
              borderRadius={'rounded16'}
              py={'spacing14'}
              px={'spacing10'}
              mx={'spacing10'}
              m={'spacing10'}
              alignItems={'center'}>
              <FontAwesome5Icon
                name="exclamation-circle"
                color={theme.colors.accentCritical}
                size={40}
              />
              <Text
                textAlign={'center'}
                color={'textSecondary'}
                variant={'subheadSmall'}>
                {t('not_confirmed_booking')}
              </Text>
              <Flex px={'spacing10'} width={'100%'} height={45}>
                <Button
                  backgroundColor={'accentCritical'}
                  emphasis={ButtonEmphasis.Outline}
                  size={ButtonSize.Medium}
                  style={{borderRadius: 15}}
                  onPress={onPay}>
                  {t('pay')}
                </Button>
              </Flex>
            </Flex>
          )}
          <Flex
            justifyContent={'space-between'}
            mx={'spacing10'}
            paddingVertical={'spacing18'}
            borderBottomWidth={2}
            borderBottomColor={'background3'}
            flexDirection={'row'}>
            <Flex gap={'spacing8'}>
              <Text
                fontWeight={'bold'}
                style={{width: SCREEN_WIDTH - 140}}
                variant={'headlineSmall'}
                color={'textPrimary'}>
                {t(booking.topic) || ''} {t('with')}{' '}
                {!me.isTutor && (
                  <Text
                    variant={'headlineSmall'}
                    color={
                      'textPrimary'
                    }>{`${tutor?.firstName} ${tutor?.lastName}`}</Text>
                )}
                {me.isTutor && (
                  <Text variant={'headlineSmall'} color={'textPrimary'}>
                    {`${students[0]?.firstName} ${
                      students.length > 1
                        ? t('and') +
                          ' ' +
                          (students.length - 1) +
                          ' ' +
                          (students.length - 1 > 1
                            ? t('others_m')
                            : t('other_m'))
                        : ''
                    }`}
                  </Text>
                )}
              </Text>
            </Flex>
            {!me.isTutor && (
              <Touchable
                onPress={() =>
                  navigation.navigate(Stack.UserProfileScreen, {
                    user: tutor,
                    userId: tutor.id,
                  })
                }>
                <Image source={{uri: tutor?.avatar}} style={styles.avatar} />
              </Touchable>
            )}
            {me.isTutor && (
              <Touchable
                onPress={() =>
                  navigation.push(Stack.FollowScreen, {
                    type: 'list_participants',
                    userId: students.map(u => u.id),
                  })
                }>
                <Flex width={70} height={60} justifyContent={'center'}>
                  {students.slice(0, 3).map((st, i) => (
                    <Image
                      source={{uri: st.avatar}}
                      style={{
                        ...styles.avatar,
                        position: 'absolute',
                        width: 60 - i * 10,
                        height: 60 - i * 10,
                        left: -i * 5 + 7,
                        zIndex: -i,
                      }}
                    />
                  ))}
                </Flex>
              </Touchable>
            )}
          </Flex>
          <Flex
            borderBottomWidth={2}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            py={'spacing16'}>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('ID')}
              </Text>
              <Text variant={'bodySmall'} color={'textPrimary'}>
                #{booking.id}
              </Text>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('date')}
              </Text>
              <Text variant={'bodySmall'} color={'textPrimary'}>
                {date}
              </Text>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('chosen_slot')}
              </Text>
              <Text variant={'bodySmall'} color={'textPrimary'}>
                {
                  convertTimezone(
                    [booking.time],
                    booking.date,
                    booking.timeZone,
                    me.timeZone,
                  )[0]
                }
              </Text>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('type')}
              </Text>
              <Text variant={'bodySmall'} color={'textPrimary'}>
                {t(booking.type)}
              </Text>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('time_zone')}
              </Text>
              {!me.isTutor && (
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {`${me.timeZone} (${convertToGMTFormat(me.timeZone) || 0})`}
                </Text>
              )}
              {me.isTutor && (
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {`${me.timeZone} (${convertToGMTFormat(booking.timeZone)})`}
                </Text>
              )}
            </Flex>
            {booking.type == 'in_person' && (
              <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <Text variant={'bodySmall'} color={'textSecondary'}>
                  {t('location')}
                </Text>
                <Text
                  numberOfLines={2}
                  textAlign={'right'}
                  style={{width: SCREEN_WIDTH * 0.6}}
                  variant={'bodySmall'}
                  textDecorationLine={'underline'}
                  color={'accentActive'}>
                  {'Paris Nord Est vers le deuxime carrefour'}
                </Text>
              </Flex>
            )}
            {booking.type == 'in_person' && (
              <MapView
                region={{
                  latitude: location?.lat as number,
                  longitude: location?.lng as number,
                  latitudeDelta: 0.007,
                  longitudeDelta: 0.007,
                }}
                style={styles.map}
                scrollEnabled={false}
                zoomEnabled={false}
              />
            )}
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('price')}
              </Text>
              <Flex
                gap={'spacing8'}
                flexDirection={'row'}
                alignItems={'center'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {`${currency} ${
                    unitPrice.toString() +
                    (booking.studentId.length > 1
                      ? 'x' + booking.studentId.length.toString()
                      : '')
                  }`}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex mx={'spacing10'} py={'spacing16'}>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('total')}
              </Text>
              <Flex
                gap={'spacing8'}
                flexDirection={'row'}
                alignItems={'center'}>
                <Text
                  fontWeight={'bold'}
                  variant={'bodySmall'}
                  color={'textPrimary'}>
                  {`${currency} ${unitPrice * booking.studentId.length}`}
                </Text>
              </Flex>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('booking_state')}
              </Text>
              <Flex gap={'spacing8'} flexDirection={'row'}>
                {!booking.isPaid ? (
                  <Flex
                    height={30}
                    px={'spacing18'}
                    backgroundColor={'accentCriticalSoft'}
                    borderRadius={'roundedFull'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    my={'spacing4'}>
                    <Text color={'accentCritical'} variant={'buttonLabelMicro'}>
                      {t('not_paid')}
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    height={30}
                    px={'spacing18'}
                    backgroundColor={'accentSuccessSoft'}
                    borderRadius={'roundedFull'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    my={'spacing4'}>
                    <Text color={'accentSuccess'} variant={'buttonLabelMicro'}>
                      {t('confirmed')}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
            {!me.isTutor && (
              <Flex
                my={'spacing6'}
                p={'spacing12'}
                borderRadius={'rounded8'}
                backgroundColor={'accentActionSoft'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('booking_info')}
                </Text>
              </Flex>
            )}
            {!me.isTutor && other_participats.length > 0 && (
              <Flex
                gap={'none'}
                pt={'spacing14'}
                borderTopWidth={2}
                borderTopColor={'background3'}>
                <Text color={'textPrimary'} variant={'buttonLabelMedium'}>
                  {t('list_other_participants')}
                </Text>
                {other_participats.map((st, key) => (
                  <UserItemRow user={st} key={key} />
                ))}
              </Flex>
            )}
            {me.isTutor && (
              <Flex
                gap={'none'}
                pt={'spacing14'}
                borderTopWidth={2}
                borderTopColor={'background3'}>
                <Text color={'textPrimary'} variant={'buttonLabelMedium'}>
                  {t('list_participants')}
                </Text>
                {students.map((st, key) => (
                  <UserItemRow user={st} key={key} />
                ))}
              </Flex>
            )}
          </Flex>
        </ScrollView>
      </Flex>
      {!isArchived && footerComponent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  map: {
    width: SCREEN_WIDTH - 20,
    height: 100,
    borderRadius: 10,
  },
  flag: {
    borderRadius: 2,
    marginLeft: -10,
    marginBottom: 1,
  },
  bottomView: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    height: 100,
  },
  loadingFlex: {
    height: SCREEN_HEIGHT - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    width: '100%',
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 10,
    paddingLeft: 15,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});

export default AppointmentScreen;

/*
 {/*<Flex
                        mx={'spacing10'}
                        borderBottomWidth={1}
                        borderBottomColor={'background3'}
                        py={'spacing10'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}>
                        <Flex gap={'spacing4'}>
                            <Text variant={'subheadSmall'} color={'textSecondary'}>
                                English with
                            </Text>
                            <Flex flexDirection={'row'} alignItems={'center'}>
                                <Text
                                    variant={'buttonLabelMedium'}
                                    color={
                                        'textPrimary'
                                    }>{`${tutor.firstName} ${tutor.lastName}`}</Text>
                                <CountryFlag
                                    style={styles.flag}
                                    isoCode={tutor.country}
                                    size={14}
                                />
                            </Flex>
                            <StaticStar number={3} size={14} />
                        </Flex>
                        <FastImage source={{uri: tutor.avatar}} style={styles.avatar} />
                    </Flex>}
*/
