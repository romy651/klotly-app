import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Image from 'app/components/core/Image/Image';
import {giftsObjects, GiftType} from 'app/constants';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import BottomCoinIndicator from 'app/components/Coin/BottomCoinIndicator';
import {useNotif} from 'app/hooks/useNotif';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import Toast from 'react-native-toast-message';
import {updateUserInfo} from 'app/actions/userAction';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {countryCurrencyMap} from 'app/constants/currency-map';

type Props = NativeStackScreenProps<AppStackParamList, Stack.GiftScreen>;

const GiftScreen: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {addGiftNotif} = useNotif();
  const me = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const snapPoints = useMemo(() => [(2 * SCREEN_HEIGHT) / 3], []);
  const userId = route.params?.userId;
  const theme = useAppTheme();
  const coins = me.coins || 0;
  const rate = useAppSelector(state => state.application.exchangeRate);
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toUpperCase()] as string;

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

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const onSendGift = useCallback(async (gift: GiftType) => {
    setLoading(true);
    if (coins < gift.price) {
      navigation.push(Stack.CoinScreen);
    } else {
      await addGiftNotif(userId, gift);
      Toast.show({
        type: 'success',
        text1: t('gift_sent') as string,
        text2: t('gift_sent_desc') as string,
      });
      updateUserInfo({...me, coins: coins - gift.price}, dispatch, setLoading);
      navigation.goBack();
    }
    setLoading(false);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: GiftType}) => (
      <Touchable onPress={() => onSendGift(item)}>
        <Flex
          borderRadius={'rounded4'}
          alignItems={'center'}
          width={SCREEN_WIDTH / 4}
          marginVertical={'spacing10'}
          justifyContent={'center'}
          borderColor={'violetVibrant'}>
          <Image source={item.image as any} style={styles.image} />
          <Text
            style={{marginTop: -5}}
            textAlign={'center'}
            variant={'bodyMicro'}
            color={'textPrimary'}>
            {t(item.title)}
          </Text>
          <Flex
            style={{marginTop: -15}}
            alignItems={'center'}
            flexDirection={'row'}>
            <Text
              variant={'bodyMicro'}
              textAlign={'center'}
              color={'accentAction'}>
              {`${currency} ${Math.ceil(item.price * rate)}`}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    ),
    [],
  );

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
      <Text
        textAlign={'center'}
        mt={'spacing10'}
        variant={'bodyMicro'}
        fontWeight={'bold'}
        color={'textPrimary'}>
        {t('gift_desc')}
      </Text>
      <Flex
        width={SCREEN_WIDTH}
        height={1}
        backgroundColor={'background3'}
        mt={'spacing16'}
      />
      <BottomSheetFlatList
        data={giftsObjects}
        renderItem={renderItem}
        contentContainerStyle={{backgroundColor: theme.colors.background0}}
        keyExtractor={item => item.title}
        showsVerticalScrollIndicator={false}
        numColumns={4}
      />
      <BottomCoinIndicator />
      {loading && (
        <Flex
          top={0}
          position={'absolute'}
          alignItems={'center'}
          justifyContent={'center'}
          width={'100%'}
          height={'100%'}
          style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
          <CircularActivityIndicator
            size={50}
            color={theme.colors.accentAction}
          />
        </Flex>
      )}
    </BottomSheet>
  );
};

export default GiftScreen;

const styles = StyleSheet.create({
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
  fullView: {
    height: '100%',
    width: '100%',
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
