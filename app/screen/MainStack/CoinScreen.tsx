import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useBackHandler} from '@react-native-community/hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {fetchPaymentSheetParams} from 'app/utils/tools';
import {
  initPaymentSheet,
  PaymentSheet,
  presentPaymentSheet,
  StripeProvider,
} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import {useUser} from 'app/hooks/useUser';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';
//import FontIcon from 'react-native-vector-icons/Foundation'

type Props = NativeStackScreenProps<AppStackParamList, Stack.CoinScreen>;

const CoinScreen: React.FC<Props> = ({navigation}) => {
  const theme = useAppTheme();
  const inset = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const bottomSheetRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {user, updateInfo} = useUser();
  const snapPoints = useMemo(() => [450], []);
  const [choice, setChoice] = useState<30 | 50 | 100 | 150 | 200 | 250>(100);
  const rate = useAppSelector(state => state.application.exchangeRate);
  //@ts-ignore
  const currency = countryCurrencyMap[user.country.toUpperCase()] as string;
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
  );
  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  const initializePaymentSheet = useCallback(async () => {
    const obj = {
      amount: Math.ceil(choice * 100 * rate),
      currency: currency.toLowerCase(),
      customer: user.stripeId,
      products: `Credits ${user.id}`,
    };
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
        mode: {
          amount: Math.ceil(choice * 100 * rate),
          currencyCode: currency.toLowerCase(),
        },
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
      setLoading(false);
    }
  }, [
    choice,
    currency,
    rate,
    user.country,
    user.email,
    user.firstName,
    user.id,
    user.lastName,
    user.stripeId,
  ]);

  const onDone = async () => {
    setLoading(true);
    await initializePaymentSheet();
    const {error, paymentOption} = await presentPaymentSheet();
    if (error) {
      console.log('there is an error: ', error.code, error.message);
    } else {
      console.log('it was successufl: ');
      updateInfo({...user, coins: choice + user.coins});
      Toast.show({
        text1: t('thank_you') as string,
        text2: t('add_coin_success') as string,
      });
      navigation.goBack();
    }
  };

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        paddingVertical={'spacing10'}
        alignItems={currency === 'USD' ? 'stretch' : 'center'}
        justifyContent={'space-between'}
        flexDirection={currency === 'USD' ? 'column' : 'row'}
        px={'spacing20'}
        width="100%">
        {currency !== 'USD' && (
          <Flex gap={'none'}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelLarge'}
              color={'textPrimary'}>
              ${choice} USD
            </Text>
            <Text variant={'bodySmall'} color={'textPrimary'}>
              {`${t('estimation')}: ${currency} ${Math.ceil(rate * choice)}`}
            </Text>
          </Flex>
        )}
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          loading={loading}
          onPress={onDone}>
          {t('confirm')}
        </Button>
      </Flex>
    );
  };

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );
  return (
    <StripeProvider
      publishableKey="pk_test_51Ow9TtRtLLsGzDAPjk7cIrKqz2LP1iGTzBzmWcNVWVsLNVy6BlbDB1wtMucDYi4D205CNYpc4KLqzpSHectkuJL400oXu1DmX1"
      merchantIdentifier="merchant.com.{{Klotly}}" // required for Apple Pay
    >
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
        <Flex
          backgroundColor={'background2'}
          height={45}
          justifyContent={'center'}
          alignItems={'center'}>
          <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
            {t('buy_credit')}
          </Text>
        </Flex>
        <BottomSheetScrollView
          contentContainerStyle={{
            ...styles.contentContainer,
            backgroundColor: theme.colors.background0,
          }}>
          <Flex
            alignItems={'flex-start'}
            px={'spacing10'}
            width={'100%'}
            py={'spacing18'}>
            <Text
              mx={'spacing10'}
              color={'textPrimary'}
              fontWeight={'bold'}
              variant={'bodyLarge'}>
              {t('my_balance')}:{' '}
              <Text color={'accentWarning'} variant={'bodyLarge'}>
                ${user.coins}
              </Text>
            </Text>
            <Text
              mx={'spacing10'}
              color={'textPrimary'}
              fontWeight={'bold'}
              variant={'bodyMicro'}>
              {t('select_amount_buy')}
            </Text>
          </Flex>
          <Flex
            alignItems={'center'}
            width={'100%'}
            overflow={'hidden'}
            px={'spacing16'}
            justifyContent={'center'}
            flexDirection={'row'}>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(30)}>
                <Flex
                  backgroundColor={
                    choice === 30 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 30
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(50)}>
                <Flex
                  backgroundColor={
                    choice === 50 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 50
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(100)}>
                <Flex
                  backgroundColor={
                    choice === 100 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 100
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
          </Flex>
          <Flex
            justifyContent={'center'}
            mt={'spacing20'}
            alignItems={'center'}
            width={'100%'}
            px={'spacing16'}
            flexDirection={'row'}>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(150)}>
                <Flex
                  backgroundColor={
                    choice === 150 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 150
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(200)}>
                <Flex
                  backgroundColor={
                    choice == 200 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 200
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
            <Flex
              overflow={'hidden'}
              height={55}
              borderRadius={'rounded16'}
              width={(SCREEN_WIDTH - 70) / 3}>
              <Touchable onPress={() => setChoice(250)}>
                <Flex
                  backgroundColor={
                    choice === 250 ? 'accentSuccessSoft' : 'background2'
                  }
                  flexDirection={'row'}
                  borderRadius={'rounded16'}
                  height={55}
                  width={(SCREEN_WIDTH - 70) / 3}
                  justifyContent={'center'}
                  px={'spacing16'}
                  alignItems={'center'}>
                  <Flex flexDirection={'row'}>
                    <Text
                      fontWeight={'bold'}
                      color={'textPrimary'}
                      variant={'bodySmall'}>
                      $ 250
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
          </Flex>
        </BottomSheetScrollView>
        {footerComponent()}
      </BottomSheet>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
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
});

export default CoinScreen;
