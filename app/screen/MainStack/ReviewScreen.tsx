import {FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useRooms} from 'app/actions/roomAction';
import {Room} from 'app/actions/chatType';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import ReviewScreenItem from 'app/components/rating/ReviewScreenItem';
import {Review} from 'app/redux/user/userReducer';
import {Text} from 'app/components/core/Text/Text';
import {calculateAverageReview} from 'app/utils/tools';
import StaticStar from 'app/components/rating/StaticStar';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.ReviewScreen
>;

const ReviewScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const theme = useAppTheme();
  const {tutor, isNew} = route.params;
  const reviews = tutor.tutorObj?.reviews || [];
  //@ts-ignore
  const {t} = useTranslation();
  const {createRoom} = useRooms();
  const insets = useSafeAreaInsets();
  const me = useAppSelector(state => state.user);
  //const targetUser = useSelector(state => state.profileX) as

  const onBook = useCallback(() => {
    navigation?.push(Stack.BookingScreen, {
      callback: () => {
        navigation.goBack();
      },
      tutor,
    });
  }, [navigation, tutor]);

  const create_room = useCallback(async () => {
    if (!tutor) {
      return;
    }
    const room = (await createRoom(tutor)) as Room;
    navigation.push(Stack.ChatScreen, {room});
  }, [tutor, createRoom, navigation]);

  const renderItem = ({item, index}: {item: Review; index: number}) => (
    <ReviewScreenItem key={index} review={item} />
  );

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        py={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        justifyContent={'space-evenly'}
        flexDirection={'row'}
        width="100%">
        <Touchable onPress={create_room}>
          <Flex
            width={45}
            height={45}
            borderRadius={'rounded8'}
            borderWidth={3}
            alignItems={'center'}
            justifyContent={'center'}
            borderColor={'background3'}>
            <MatComIcon
              name="comment-text-outline"
              color={theme.colors.textPrimary}
              size={24}
            />
          </Flex>
        </Touchable>
        <Flex width={SCREEN_WIDTH - 45 - 30 - 20}>
          <Button
            backgroundColor={'accentActive'}
            emphasis={ButtonEmphasis.Outline}
            size={ButtonSize.Medium}
            style={{borderRadius: 10}}
            onPress={onBook}>
            {isNew ? t('buy_trial_lesson') : t('buy_lesson')}
          </Button>
        </Flex>
      </Flex>
    ),
    [isNew, create_room, onBook, t, theme.colors.textPrimary, insets.bottom],
  );

  const getNum = (val: number) => {
    return reviews.filter(_ => _.rate == val).length;
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader title={t('reviews_m') as string} showBackButton showBorder />
      <Flex flex={1} backgroundColor={'background0'}>
        <FlatList
          data={[...reviews]}
          ListHeaderComponent={() => (
            <>
              <Flex
                borderBottomWidth={1}
                borderBottomColor={'background3'}
                pb={'spacing20'}
                justifyContent={'space-between'}
                mt={'spacing20'}
                px={'spacing16'}
                alignItems={'center'}
                flexDirection={'row'}>
                <Flex gap={'spacing6'}>
                  <Text variant={'headlineLarge'} color={'textPrimary'}>
                    {calculateAverageReview(reviews.map(_ => _.rate))}
                  </Text>
                  <StaticStar
                    number={calculateAverageReview(reviews.map(_ => _.rate))}
                    size={20}
                  />
                  <Text variant={'bodySmall'} color={'textPrimary'}>
                    {reviews.length}{' '}
                    {reviews.length > 1 ? t('reviews') : t('review')}
                  </Text>
                </Flex>
                <Flex gap={'none'}>
                  {[5, 4, 3, 2, 1].map(_ => (
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      flexDirection={'row'}>
                      <Text
                        variant={'buttonLabelMicro'}
                        color={'textSecondary'}>
                        {_}
                      </Text>
                      <Flex
                        width={(SCREEN_WIDTH - 50) / 2}
                        borderBottomColor={'textSecondary'}
                        borderWidth={1}
                        height={8}>
                        <Flex
                          width={`${(getNum(_) * 100) / reviews.length}%`}
                          height={'100%'}
                          backgroundColor={'textPrimary'}
                        />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </>
          )}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 200}}
        />
      </Flex>
      {typeof isNew !== undefined && me.id !== tutor.id && footerComponent()}
    </Screen>
  );
};

export default ReviewScreen;
