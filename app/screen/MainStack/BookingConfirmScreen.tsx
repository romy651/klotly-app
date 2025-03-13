import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from 'app/components/layout/Flex';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import FastImage from 'react-native-fast-image';
import CountryFlag from 'react-native-country-flag';
import StaticStar from 'app/components/rating/StaticStar';
import moment from 'moment';
import MapView from 'react-native-maps';
import Toast from 'react-native-toast-message';
import {Booking, useBooking} from 'app/hooks/useBooking';
import {store} from 'app/store';
import {Screen} from 'app/components/layout/Screen';
import {
  calculateAverageReview,
  convertTimezone,
  convertToGMTFormat,
  fetchPaymentSheetParams,
  getRate,
} from 'app/utils/tools';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {
  PaymentSheet,
  StripeProvider,
  usePaymentSheet,
} from '@stripe/stripe-react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useUser} from 'app/hooks/useUser';
import {useEmail} from 'app/hooks/useEmail';
import {useNotif} from 'app/hooks/useNotif';
import {isAndroid} from 'app/utils/PlatformUtils';

moment.locale(store.getState().application.language || 'en');

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.BookingConfirmationScreen
>;

const BookingConfirmationScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const {updateBooking} = useBooking();
  const {notifyBookingCreation} = useEmail();
  const {sendBookingConfirmationNotice} = useNotif();
  const {user, updateInfo} = useUser();
  //const user = useAppSelector(state => state.user)
  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
  const [fetching, setFetching] = useState<boolean>(false);
  const e_rate = useAppSelector(state => state.application.exchangeRate);
  //@ts-ignore
  const currency = countryCurrencyMap[user.country.toUpperCase()] as string;
  const inset = useSafeAreaInsets();
  const topic = useAppSelector(state => state.application.topic);
  const {createBooking, deleteBooking} = useBooking();
  const {date, slot, tutor, type, location, booking, id} = route.params;
  const rate =
    (tutor && (tutor.tutorObj?.reviews || []).map(r => r.rate)) || [];
  const t_date = moment(date).format('ll');
  const theme = useAppTheme();
  const price = Math.ceil((tutor.tutorObj?.rate || 20) * e_rate);
  const [withWallet, setWithWallet] = useState<boolean>(
    user.coins >= (tutor.tutorObj?.rate || 0),
  );
  const convertedSlot = convertTimezone(
    [slot],
    date,
    tutor.timeZone,
    user.timeZone,
  )[0] as string;

  const temp: Booking = {
    id,
    studentId: [user.id],
    tutorId: tutor.id,
    date: date,
    timeZone: tutor.timeZone || '',
    price: tutor.tutorObj?.rate || 20,
    isPaid: true,
    status: 'completed',
    time: slot,
    //@ts-ignore
    type,
    whopaidId: user.id,
    optedOutList: [],
    topic: topic as string,
    ...(location && {location}),
  };

  const onSubmit = async () => {
    console.log('WE START WITH THE ID: ', id);
    setFetching(true);
    console.log('WE NEED TO CREATE ONE: ', temp);
    await createBooking(tutor, {
      ...temp,
      isPaid: withWallet,
      status: 'confirmed',
    });
    Toast.show({
      text1: t('thanks_paiement') as string,
      text2: t('booking_confinment') as string,
      visibilityTime: 6000,
    });
    console.log('NO WE SEND NOTIF');
    notifyBookingCreation(user, tutor, temp);
    sendBookingConfirmationNotice(user, tutor);
    route.params.callback && route.params.callback();
    const routes = [
      {
        name: Stack.BottomTabsStack,
      },
    ];
    navigation.reset({
      index: 0,
      routes,
    });
    setFetching(false);
  };

  const onBuy = async () => {
    setFetching(true);
    console.log('WE INIT THE PAYMENT SHEET');
    await initializePaymentSheet();
    console.log('now we have finished');
    if (booking) {
      //@ts-ignore
      updateBooking({
        ...booking,
        date,
        time: slot,
        type,
        ...(location && {location}),
      });
      Toast.show({
        text1: t('booking_update_success') as string,
        type: 'info',
        visibilityTime: 6000,
      });
      setFetching(false);
      route.params.callback && route.params.callback();
      return;
    } else {
      if (withWallet) {
        onSubmit();
        updateInfo({...user, coins: user.coins - (tutor.tutorObj?.rate || 0)});
      } else {
        await createBooking(tutor, temp);
        const {error, paymentOption} = await presentPaymentSheet();
        if (error) {
          console.log('there is an error: ', error.code, error.message);
          await deleteBooking(id);
        } else {
          console.log('it was successufl: ');
          Toast.show({
            text1: t('thanks_paiement') as string,
            text2: t('booking_confinment') as string,
            visibilityTime: 6000,
          });
          notifyBookingCreation(user, tutor, temp);
          sendBookingConfirmationNotice(user, tutor);
          route.params.callback && route.params.callback();
          const routes = [
            {
              name: Stack.BottomTabsStack,
            },
          ];
          navigation.reset({
            index: 0,
            routes,
          });
          setFetching(false);
        }
      }
    }
  };

  const initializePaymentSheet = useCallback(async () => {
    const rate = await getRate(currency);
    const obj = {
      amount: Math.ceil((tutor.tutorObj?.rate || 20) * rate) * 100,
      currency: currency.toLowerCase(),
      customer: user.stripeId,
      products: id,
    };
    console.log('the obj: ', obj);
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams(obj);
    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        email: user?.email,
        name: `${user.firstName} ${user.lastName}` || '',
      },
      allowsDelayedPaymentMethods: true,
      returnURL: 'klotly://somepath',
      merchantDisplayName: 'Klotly',
      intentConfiguration: {
        confirmHandler: (paymentMethod, shouldSave, callBack) => {
          console.log('now it was successful: ', paymentMethod);
          console.log('the should save: ', shouldSave);
        },
        mode: {amount: price * 100, currencyCode: currency.toLowerCase()},
      },
      billingDetailsCollectionConfiguration: {
        name: PaymentSheet.CollectionMode.ALWAYS,
        phone: PaymentSheet.CollectionMode.ALWAYS,
        address: PaymentSheet.AddressCollectionMode.FULL,
        email: PaymentSheet.CollectionMode.ALWAYS,
      },
      applePay: {
        merchantCountryCode: user.country,
      },
      googlePay: {
        merchantCountryCode: user.country,
        testEnv: true,
        currencyCode: currency,
      },
    });
    if (error) {
      console.log('there is an error: ', error.message);
      Toast.show({type: 'error', text1: 'Error: '});
    } else {
      console.log('the payment option: ', paymentOption);
      setFetching(false);
    }
  }, []);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        bottom={0}
        borderTopColor={'background3'}
        borderTopWidth={1}
        style={{
          paddingBottom: isAndroid ? 10 : inset.bottom,
        }}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          loading={loading || fetching}
          onPress={() => !fetching && onBuy()}>
          {booking ? t('update') : t('pay')}
        </Button>
      </Flex>
    ),
    [loading, fetching],
  );

  useEffect(() => {
    //initializePaymentSheet()
  }, []);

  return (
    <StripeProvider
      publishableKey="pk_test_51Ow9TtRtLLsGzDAPjk7cIrKqz2LP1iGTzBzmWcNVWVsLNVy6BlbDB1wtMucDYi4D205CNYpc4KLqzpSHectkuJL400oXu1DmX1"
      merchantIdentifier="merchant.com.{{Klotly}}" // required for Apple Pay
    >
      <Screen edges={['top']} backgroundColor={'background2'}>
        <ViewHeader title={t('confirm') as string} showBorder showBackButton />
        <Flex flex={1} backgroundColor={'background0'}>
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <Flex
              mx={'spacing10'}
              borderBottomWidth={1}
              borderBottomColor={'background3'}
              py={'spacing10'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Flex gap={'spacing4'}>
                <Text variant={'subheadSmall'} color={'textSecondary'}>
                  {`${t(topic as string)} ${t('with')}`}
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
                <StaticStar number={calculateAverageReview(rate)} />
              </Flex>
              <FastImage source={{uri: tutor.avatar}} style={styles.avatar} />
            </Flex>
            <Flex
              borderBottomWidth={1}
              borderBottomColor={'background3'}
              mx={'spacing10'}
              py={'spacing16'}>
              <Flex
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text variant={'bodySmall'} color={'textSecondary'}>
                  {t('type')}
                </Text>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t(type)}
                </Text>
              </Flex>
              {type == 'in_person' && (
                <Flex flexDirection={'row'} justifyContent={'space-between'}>
                  <Text variant={'bodySmall'} color={'textSecondary'}>
                    {t('location')}
                  </Text>
                  <Text
                    numberOfLines={2}
                    textAlign={'right'}
                    style={{width: SCREEN_WIDTH * 0.6}}
                    variant={'bodySmall'}
                    color={'textPrimary'}>
                    {route.params.location?.description || ''}
                  </Text>
                </Flex>
              )}
              {type == 'in_person' && (
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
                  {t('date')}
                </Text>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t_date}
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
                  {`${convertedSlot} (${
                    convertToGMTFormat(user.timeZone) || 0
                  })`}
                </Text>
              </Flex>
              <Flex
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text variant={'bodySmall'} color={'textSecondary'}>
                  {t('price_per_slot')}
                </Text>
                <Flex
                  gap={'spacing8'}
                  flexDirection={'row'}
                  alignItems={'center'}>
                  <Text variant={'bodySmall'} color={'textPrimary'}>
                    {`${currency} ${price}`}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              borderBottomWidth={1}
              borderBottomColor={'background3'}
              mx={'spacing10'}
              py={'spacing16'}>
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
                    {`${currency} ${price}`}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                my={'spacing6'}
                p={'spacing12'}
                borderRadius={'rounded8'}
                backgroundColor={'accentCriticalSoft'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('booking_info')}
                </Text>
              </Flex>
            </Flex>
            <Touchable
              onPress={() => {
                user.coins >= (tutor.tutorObj?.rate || 0) &&
                  setWithWallet(!withWallet);
              }}>
              <>
                <Flex
                  px={'spacing10'}
                  mt={'spacing10'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}>
                  <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                    {t('pay_with_wallet')}
                  </Text>
                  <Flex
                    gap={'spacing8'}
                    flexDirection={'row'}
                    alignItems={'center'}>
                    <Ionicon
                      name={withWallet ? 'checkbox' : 'square-outline'}
                      color={theme.colors.textPrimary}
                      size={22}
                    />
                  </Flex>
                </Flex>
                <Flex
                  px={'spacing10'}
                  mt={'spacing6'}
                  gap={'spacing8'}
                  flexDirection={'row'}
                  alignItems={'center'}>
                  <Text
                    fontWeight={'bold'}
                    variant={'buttonLabelMedium'}
                    color={'textSecondary'}>
                    {`${currency} ${Math.floor(user.coins * e_rate)}`}
                  </Text>
                </Flex>
              </>
            </Touchable>
          </ScrollView>
        </Flex>
        {footerComponent()}
      </Screen>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  list: {
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bsheet: {
    width: '100%',
    height: '100%',
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  containStyle: {
    paddingLeft: 10,
  },
});

export default BookingConfirmationScreen;

/*

<Flex
                            flexDirection={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}>
                            <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                                {t('available_coins')}
                            </Text>
                            <Flex gap={'spacing8'} flexDirection={'row'} alignItems={'center'}>
                                <Text variant={'bodySmall'} color={'textPrimary'}>
                                    {coins}
                                </Text>
                            </Flex>
                        </Flex>
                        {coins < total_price && (
                            <Flex
                                gap={'spacing8'}
                                style={{marginTop: -10}}
                                flexDirection={'row'}
                                alignItems={'center'}>
                                <AntDesign
                                    name="infocirlce"
                                    size={14}
                                    color={theme.colors.accentActive}
                                />
                                <Text variant={'bodyMicro'} color={'textSecondary'}>
                                    {t('insufficient_coins')}
                                </Text>
                            </Flex>
                        )}

*/
