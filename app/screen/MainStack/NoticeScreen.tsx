import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Notif, useNotif} from 'app/hooks/useNotif';
import {giftsObjects} from 'app/constants';
import Animated from 'react-native-reanimated';
import {MotiView} from 'moti';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {isAndroid, isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.NoticeScreen>;

const NoticeScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {notifs, setNotifSeen} = useNotif();
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      await setNotifSeen();
      setLoading(false);
    })();
  }, [notifs]);

  const renderItem = useCallback(
    ({item, index}: {item: Notif; index: number}) => {
      return (
        <Flex marginTop={'spacing16'} key={index} flexDirection={'row'}>
          <FastImage
            style={{
              width: 30,
              height: 30,
              borderRadius: 30,
              backgroundColor: 'white',
            }}
            source={require('../../assets/images/logo.png')}
          />
          <Flex
            width={SCREEN_WIDTH - 125}
            paddingHorizontal={'spacing16'}
            backgroundColor={'background2'}
            borderRadius={'rounded12'}
            flexDirection={'row'}
            paddingTop={'spacing20'}
            paddingVertical={'spacing16'}>
            <>
              <Flex
                position={'absolute'}
                borderBottomRightRadius={'rounded12'}
                backgroundColor={'accentCritical'}
                paddingVertical={'spacing4'}
                paddingHorizontal={'spacing10'}>
                <Text fontWeight={'bold'} variant={'bodyMicro'} color={'white'}>
                  {t(item.type)}
                </Text>
              </Flex>
              <Text
                mt={'spacing14'}
                variant={'bodyLarge'}
                color={'textPrimary'}>
                <Text variant={'bodyLarge'} color={'accentAction'}>
                  {item.from.username}
                </Text>{' '}
                {me.isTutor &&
                  `${
                    item.type2 === 'new_booking'
                      ? t('new_booking')
                      : t(item.message)
                  }`}
                {!me.isTutor &&
                  `${
                    item.type2 === 'booking_confirmed'
                      ? t('booking_confirmed')
                      : t(item.message)
                  }`}
              </Text>
            </>
          </Flex>
          <MotiView
            from={{opacity: 0.5, scale: 0.5, rotate: '90deg'}}
            animate={{opacity: 1, scale: 0.8, rotate: '0deg'}}
            transition={{type: 'spring', duration: 2000}}
            style={{position: 'absolute', right: 0}}>
            <Animated.Image
              style={{width: 100, height: 100}}
              source={
                giftsObjects[parseInt(item.metadata as string)]?.image as any
              }
            />
          </MotiView>
        </Flex>
      );
    },
    [],
  );

  const renderHeader = useCallback(() => {
    return (
      <Flex mt={'spacing16'} flexDirection={'row'}>
        <FastImage
          style={{
            width: 30,
            height: 30,
            borderRadius: 30,
            backgroundColor: 'white',
          }}
          source={require('../../assets/images/logo.png')}
        />
        <Flex
          width={SCREEN_WIDTH - 125}
          paddingHorizontal={'spacing16'}
          backgroundColor={'background2'}
          borderRadius={'rounded12'}
          paddingTop={'spacing24'}
          paddingVertical={'spacing16'}>
          <Flex
            position={'absolute'}
            borderBottomRightRadius={'rounded12'}
            backgroundColor={'accentCritical'}
            paddingVertical={'spacing4'}
            paddingHorizontal={'spacing10'}>
            <Text fontWeight={'bold'} variant={'bodyMicro'} color={'white'}>
              {t('system_notice')}
            </Text>
          </Flex>
          <Text variant={'bodyLarge'} color={'textPrimary'}>
            {`${t('welcome_msg1')}\n\n${t('welcome_msg2')}\n\n${t(
              'welcome_msg3',
            )}`}
          </Text>
        </Flex>
      </Flex>
    );
  }, []);

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader showBackButton showBorder title={t('notice') as string} />
      {loading ? (
        <CircularActivityIndicator
          size={20}
          color={theme.colors.accentAction}
        />
      ) : (
        <FlatList
          ListFooterComponent={renderHeader}
          data={notifs}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 20,
            paddingBottom: isAndroid ? 10 : inset.bottom + 80,
          }}
          style={{backgroundColor: theme.colors.background0}}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
        />
      )}
      <Touchable onPress={() => navigation.navigate(Stack.FeedbackScreen)}>
        <Flex
          position={'absolute'}
          bottom={isIos ? inset.bottom : 10}
          backgroundColor={'background2'}
          left={15}
          flexDirection={'row'}
          alignItems={'center'}
          borderRadius={'rounded12'}
          paddingHorizontal={'spacing10'}
          paddingVertical={'spacing6'}>
          <MatComIcon
            color={theme.colors.textSecondary}
            name="file-document-edit-outline"
            size={24}
          />
          <Text variant={'bodySmall'} fontWeight={'bold'} color={'textPrimary'}>
            {t('feedback')}
          </Text>
        </Flex>
      </Touchable>
    </Screen>
  );
};

export default NoticeScreen;
