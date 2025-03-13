import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {HomeStackScreens, Stack} from 'app/routes/screens/Stack';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {updateUserSuccess, UserInfo} from 'app/redux/user/userReducer';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import FastImage from 'react-native-fast-image';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Text} from 'app/components/core/Text/Text';
import {useTranslation} from 'react-i18next';
import CountryFlag from 'react-native-country-flag';
import Octicon from 'react-native-vector-icons/Octicons';
import StaticStar from 'app/components/rating/StaticStar';
import {ScrollView} from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReviewItem from 'app/components/rating/ReviewItem';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {getUser} from 'app/actions/chatAction';
import Video, {OnLoadData, OnProgressData} from 'react-native-video';
import Slider from '@react-native-community/slider';
import {
  calculateAverageReview,
  getTutorLessons,
  isSuperTutor,
} from 'app/utils/tools';
import {countryCodeToNameMap} from 'app/constants/languages';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {countryCurrencyMap} from 'app/constants/currency-map';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {Room} from 'app/actions/chatType';
import {useRooms} from 'app/actions/roomAction';
import {SlideInDown} from 'react-native-reanimated';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.UserProfileScreen
>;

const UserProfileScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  //const tutor = route.params.user
  const [user, setUser] = useState<UserInfo | undefined>(route.params.user);
  const [play, setPlay] = useState<boolean>(false);
  const rate = useAppSelector(state => state.application.exchangeRate);
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const country = countryCodeToNameMap[user?.country.toUpperCase()];
  //@ts-ignore
  const {t} = useTranslation();
  const {createRoom} = useRooms();
  const inset = useSafeAreaInsets();
  const theme = useAppTheme();
  const [progress, setProgress] = useState<number>(0);
  const [loadVideo, setLoadVideo] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [price, setPrice] = useState<string>('');
  const reviews =
    (user && (user.tutorObj?.reviews || []).map(r => r.rate)) || [];
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toUpperCase()] as string;
  const videoRef = React.useRef<any>(null);
  const [lessons, setLessons] = useState<number>(0);
  const [isNew, setIsNew] = useState<boolean>(true);

  const hasPostedReviews =
    user && (user.tutorObj?.reviews || []).some(r => r.user === me.id);

  console.log('hasPostedReviews', hasPostedReviews);

  const dispatch = useDispatch();

  const isFirst = async () => {
    const req = await firestore()
      .collection('bookings')
      .where('tutorId', '==', route.params.userId)
      .where('studentId', 'array-contains', me.id)
      .get();
    if (req.size > 0) {
      setIsNew(false);
    } else {
      setIsNew(true);
    }
  };

  const onProgress = (data: OnProgressData) => {
    setProgress(data.currentTime / duration);
    setCurrentTime(data.currentTime);
  };

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration);
  };

  const onSliderValueChange = (value: number) => {
    const newPosition = value * duration;
    videoRef.current.seek(newPosition);
  };
  const onEnd = () => {
    videoRef.current.seek(0);
    setPlay(false);
  };

  useEffect(() => {
    if (user) {
      setPrice(`${currency} ${Math.ceil((user.tutorObj?.rate || 20) * rate)}`);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const _ = route.params.user;
      if (!_) {
        const id = route.params.userId;
        const res = await getUser(id);
        setUser(res);
      }
      const l = await getTutorLessons(route.params.userId);
      setLessons(l);
      isFirst();
    })();
  }, []);

  const onReport = () => {
    if (!user) {
      return;
    }
    navigation?.push(HomeStackScreens.ReportScreen, {user, type: 'user'});
  };

  const updateFavTutor = async () => {
    const db = firestore();
    if ((me.favoriteTutors || []).includes(route.params.userId)) {
      const temp = (me.favoriteTutors || []).filter(
        t => t !== route.params.userId,
      );
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    } else {
      const temp = [...(me.favoriteTutors || []), route.params.userId];
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    }
  };

  const headerActions = [
    {
      IconName: 'share-variant-outline',
      color: theme.colors.textSecondary,
      action: () => {},
      size: 20,
    },
    {
      IconName: (me.favoriteTutors || []).includes(route.params.userId)
        ? 'bookmark'
        : 'bookmark-outline',
      color: theme.colors.textSecondary,
      action: updateFavTutor,
      size: 24,
    },
    {IconName: 'alert-decagram-outline', action: onReport, size: 24},
  ];

  const renderViewMore = (onPress: any) => (
    <Touchable
      style={{...styles.moreButton, borderColor: theme.colors.background3}}
      onPress={onPress}>
      <Text variant={'bodyMicro'} color={'textPrimary'} onPress={onPress}>
        View more
      </Text>
    </Touchable>
  );
  const renderViewLess = (onPress: any) => (
    <Touchable
      style={{...styles.moreButton, borderColor: theme.colors.background3}}
      onPress={onPress}>
      <Text variant={'bodyMicro'} color={'textPrimary'} onPress={onPress}>
        View less
      </Text>
    </Touchable>
  );
  const isNewAccount = () => {
    if (!user) {
      return false;
    }
    const {nanoseconds, seconds} = user.registered_at;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const creationTime = moment(milliseconds);
    const currentTime = moment();
    const daysSinceCreation = currentTime.diff(creationTime, 'days');
    return daysSinceCreation <= 4;
  };
  const onBook = () => {
    navigation?.push(Stack.BookingScreen, {
      callback: () => {
        navigation.goBack();
      },
      tutor: user as UserInfo,
    });
  };

  const create_room = async () => {
    if (!user) {
      return;
    }
    const room = (await createRoom(user)) as Room;
    navigation.push(Stack.ChatScreen, {room});
  };

  const footerComponent = useCallback(
    () => (
      <AnimatedFlex
        backgroundColor={'background0'}
        position={'absolute'}
        entering={SlideInDown}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        style={{
          paddingBottom: isAndroid ? 10 : inset.bottom,
        }}
        px={'spacing20'}
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
          <Touchable onPress={onBook}>
            <Flex
              alignItems={'center'}
              borderRadius={'rounded8'}
              justifyContent={'center'}
              width={'100%'}
              height={45}
              backgroundColor={'accentActive'}>
              <Text variant={'buttonLabelLarge'} color={'white'}>
                {isNew ? t('buy_trial_lesson') : t('buy_lesson')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </AnimatedFlex>
    ),
    [isNew],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader showBackButton showBorder iconList={headerActions} />
      <Flex flex={1} backgroundColor={'background0'}>
        <ScrollView
          contentContainerStyle={{
            width: SCREEN_WIDTH,
            paddingBottom: inset.bottom + 40,
          }}>
          <Flex
            paddingBottom={'spacing48'}
            gap={'none'}
            flex={1}
            backgroundColor={'background0'}>
            <Flex
              mt={'spacing10'}
              gap={'none'}
              width={'100%'}
              height={200}
              overflow={'hidden'}>
              {loadVideo && (
                <Video
                  ref={videoRef}
                  source={{uri: user?.tutorObj?.video}}
                  style={{width: '100%', height: '100%'}}
                  paused={!play}
                  onProgress={onProgress}
                  onLoad={onLoad}
                  volume={10}
                  onEnd={onEnd}
                />
              )}
              {!play && (
                <FastImage
                  source={{uri: user?.tutorObj?.videoThumb}}
                  style={{width: '100%', height: '100%', position: 'absolute'}}
                />
              )}
              <Touchable
                onPress={() => {
                  !loadVideo && setLoadVideo(true);
                  setPlay(!play);
                }}>
                <Flex
                  style={{
                    ...styles.playbutton,
                    borderColor: theme.colors.black,
                    backgroundColor: theme.colors.blue300,
                  }}>
                  <FontIcon
                    name={play ? 'pause' : 'play'}
                    size={18}
                    color={'black'}
                  />
                </Flex>
              </Touchable>
              {play && (
                <Flex
                  gap={'none'}
                  position={'absolute'}
                  bottom={0}
                  width={SCREEN_WIDTH}>
                  <Flex
                    px={'spacing10'}
                    justifyContent={'space-between'}
                    flexDirection={'row'}>
                    <Text variant={'buttonLabelMicro'} color={'white'}>
                      {formatTime(currentTime)}
                    </Text>
                    <Text variant={'buttonLabelMicro'} color={'white'}>
                      {formatTime(duration)}
                    </Text>
                  </Flex>
                  <Flex height={4}>
                    <Slider
                      style={styles.slider}
                      value={progress}
                      onValueChange={onSliderValueChange}
                      thumbTintColor="transparent"
                      maximumTrackTintColor="white"
                      minimumTrackTintColor="black"
                    />
                  </Flex>
                </Flex>
              )}
            </Flex>
            <Flex
              alignItems={'center'}
              borderBottomWidth={1}
              borderBottomColor={'background3'}
              paddingVertical={'spacing20'}
              marginHorizontal={'spacing16'}
              flexDirection={'row'}>
              <FastImage style={styles.avatar} source={{uri: user?.avatar}} />
              <Flex justifyContent={'center'} gap={'spacing4'}>
                <Flex flexDirection={'row'}>
                  <Text
                    fontWeight={'bold'}
                    variant={'subheadLarge'}
                    color={'textPrimary'}>
                    {`${user?.firstName} ${user?.lastName}`}
                  </Text>
                  <MatIcon
                    style={styles.badge}
                    size={20}
                    name="verified"
                    color={theme.colors.accentAction}
                  />
                </Flex>
                <Flex flexDirection={'row'}>
                  <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
                    {`${t('lives_in')}: ${country}`}
                  </Text>
                  <CountryFlag
                    style={styles.flag}
                    isoCode={user?.country as string}
                    size={14}
                  />
                </Flex>
                <Flex flexDirection={'row'}>
                  <Text
                    numberOfLines={2}
                    style={{width: SCREEN_WIDTH - 105}}
                    variant={'buttonLabelMicro'}
                    color={'textSecondary'}>
                    {`${t('can_mentor_in')}: ${
                      user?.tutorObj?.topic
                    } (${user?.tutorObj?.subTopics
                      ?.map(_ => t(_))
                      .join(', ')})`}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              <Flex
                gap={'spacing10'}
                justifyContent={'space-evenly'}
                py={'spacing20'}
                flexDirection={'row'}
                px={'spacing10'}>
                <Flex mr={'spacing10'} alignItems={'center'}>
                  <MatIcon
                    name="verified-user"
                    color={theme.colors.textPrimary}
                    size={23}
                  />
                  <Text
                    textAlign={'center'}
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {t('verified')}
                  </Text>
                </Flex>
                <Flex mr={'spacing10'}>
                  <StaticStar number={calculateAverageReview(reviews)} />
                  <Text
                    style={{marginTop: -5}}
                    textAlign={'center'}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {reviews.length}{' '}
                    {reviews.length > 1 ? t('reviews') : t('review')}
                  </Text>
                </Flex>
                <Flex mr={'spacing10'}>
                  <Text
                    fontWeight={'bold'}
                    variant={'buttonLabelLarge'}
                    color={'textPrimary'}>
                    {price}
                  </Text>
                  <Text
                    textAlign={'center'}
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {t('fifty_min_lesson')}
                  </Text>
                </Flex>
                {lessons > 0 && (
                  <Flex mr={'spacing10'} alignItems={'center'}>
                    <Text
                      fontWeight={'bold'}
                      variant={'buttonLabelLarge'}
                      color={'textPrimary'}>
                      {lessons}
                    </Text>
                    <Text
                      style={{marginTop: -10}}
                      variant={'bodyMicro'}
                      color={'textPrimary'}>
                      {lessons > 1 ? t('lessons') : t('lesson')}
                    </Text>
                  </Flex>
                )}
                {isNewAccount() && (
                  <Flex mr={'spacing10'} alignItems={'center'}>
                    <Text
                      fontWeight={'bold'}
                      variant={'buttonLabelLarge'}
                      color={'accentSuccess'}>
                      {t('new')}
                    </Text>
                    <Text
                      style={{marginTop: -10}}
                      variant={'bodyMicro'}
                      color={'accentSuccess'}>
                      {t('account')}
                    </Text>
                  </Flex>
                )}
                {getTotalGifts(user?.gifts) > 0 && (
                  <Flex mr={'spacing10'} alignItems={'center'}>
                    <Text
                      fontWeight={'bold'}
                      variant={'buttonLabelLarge'}
                      color={'textPrimary'}>
                      <Octicon
                        name="gift"
                        size={18}
                        color={theme.colors.textPrimary}
                      />
                      {` ${getTotalGifts(user?.gifts)}`}
                    </Text>
                    <Text
                      textAlign={'center'}
                      style={{marginTop: -10}}
                      variant={'bodyMicro'}
                      color={'textPrimary'}>
                      {getTotalGifts(user?.gifts) > 0
                        ? t('received_gift')
                        : t('received_gifts')}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </ScrollView>
            <Flex
              borderBottomWidth={1.5}
              borderTopWidth={1.5}
              borderTopColor={'background3'}
              justifyContent={'space-evenly'}
              borderBottomColor={'background3'}
              paddingVertical={'spacing20'}
              paddingHorizontal={'spacing16'}>
              {isSuperTutor(reviews || []) ||
                (true && (
                  <Flex flexDirection={'row'}>
                    <Octicon
                      name="file-badge"
                      color={theme.colors.textPrimary}
                      size={18}
                    />
                    <Flex gap={'spacing4'} style={{marginTop: -3}}>
                      <Text color={'textPrimary'} variant={'buttonLabelMicro'}>
                        {t('super_tutor')}
                      </Text>
                      <Text
                        style={{width: SCREEN_WIDTH - 55}}
                        color={'textSecondary'}
                        variant={'bodyMicro'}>
                        {`${user?.firstName} ${t('super_tutor_desc')}`}.
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              <Flex flexDirection={'row'}>
                <Octicon
                  name="verified"
                  color={theme.colors.textPrimary}
                  size={18}
                />
                <Flex gap={'spacing4'} style={{marginTop: -3}}>
                  <Text color={'textPrimary'} variant={'buttonLabelMicro'}>
                    {t('full_refundable')}
                  </Text>
                  <Text
                    style={{width: SCREEN_WIDTH - 65}}
                    color={'textSecondary'}
                    variant={'bodyMicro'}>
                    {t('full_refundable_desc')}.
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              borderBottomWidth={4}
              justifyContent={'space-evenly'}
              borderBottomColor={'background3'}
              paddingVertical={'spacing20'}
              paddingHorizontal={'spacing16'}>
              <Text
                fontWeight={'bold'}
                variant={'bodyLarge'}
                color={'textPrimary'}>
                {t('about_me')}
              </Text>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}>
                <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                  {user?.tutorObj?.headline} -{' '}
                  <Text variant={'bodyMicro'} color={'textPrimary'}>
                    {user?.tutorObj?.descriptionDesc}.{'\n\n'}
                  </Text>
                </Text>
                <Text variant={'bodyMicro'} color={'textPrimary'}>
                  {user?.tutorObj?.experienceDesc} {'\n\n'}
                  {user?.tutorObj?.motivationDesc}
                </Text>
              </ViewMoreText>
              <Flex
                marginTop={'spacing6'}
                paddingTop={'spacing14'}
                borderTopWidth={1}
                borderTopColor={'background3'}
                width={'100%'}>
                <Text
                  variant={'bodySmall'}
                  fontWeight={'bold'}
                  color={'textPrimary'}>
                  {t('ispeak')}
                </Text>
                <Flex
                  flexDirection={'row'}
                  gap={'spacing10'}
                  alignItems={'center'}>
                  {(user?.languages || []).map((_, i) => (
                    <Flex
                      key={i}
                      paddingVertical={'spacing6'}
                      borderRadius={'rounded8'}
                      backgroundColor={'accentActionSoft'}
                      paddingHorizontal={'spacing14'}>
                      <Text color={'textPrimary'} variant={'bodySmall'}>
                        {_}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
            {(reviews.length > 0 || !isNew) && (
              <Flex
                borderBottomWidth={4}
                justifyContent={'space-evenly'}
                borderBottomColor={'background3'}
                paddingVertical={'spacing20'}>
                <Flex
                  gap={'spacing10'}
                  marginLeft={'spacing16'}
                  flexDirection={'row'}
                  alignItems={'center'}>
                  <AntDesign
                    name="star"
                    color={theme.colors.textPrimary}
                    size={18}
                  />
                  <Text
                    fontWeight={'bold'}
                    color={'textPrimary'}
                    variant={'bodyLarge'}>
                    {`${calculateAverageReview(reviews)} - ${reviews.length} ${
                      reviews.length > 1 ? t('reviews') : t('review')
                    }`}
                  </Text>
                </Flex>
                <ScrollView
                  contentContainerStyle={{paddingLeft: 16}}
                  showsHorizontalScrollIndicator={false}
                  horizontal>
                  {(user?.tutorObj?.reviews || [])
                    .slice(0, 3)
                    .map((review, index) => (
                      <ReviewItem
                        onpress={() =>
                          navigation.navigate(Stack.ReviewScreen, {
                            tutor: user as UserInfo,
                            isNew,
                          })
                        }
                        key={index}
                        {...review}
                      />
                    ))}
                  {reviews.length > 3 && (
                    <Touchable
                      onPress={() =>
                        navigation.navigate(Stack.ReviewScreen, {
                          tutor: user as UserInfo,
                          isNew,
                        })
                      }>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'center'}
                        width={200}
                        marginRight={'spacing16'}
                        height={235}
                        backgroundColor={'background3'}
                        borderRadius={'rounded4'}>
                        <Text
                          textDecorationLine={'underline'}
                          variant={'buttonLabelMicro'}
                          color={'textPrimary'}>
                          {t('view_all_reviews')}
                        </Text>
                      </Flex>
                    </Touchable>
                  )}
                </ScrollView>
                {reviews.length > 3 && (
                  <Flex paddingHorizontal={'spacing16'}>
                    <Touchable
                      style={{
                        ...styles.moreButton,
                        borderColor: theme.colors.background3,
                      }}
                      onPress={() =>
                        navigation.navigate(Stack.ReviewScreen, {
                          tutor: user as UserInfo,
                          isNew,
                        })
                      }>
                      <Text variant={'bodyMicro'} color={'textPrimary'}>
                        {`${t('view_all_the')} ${reviews.length} ${t(
                          'reviews',
                        )}`}
                      </Text>
                    </Touchable>
                  </Flex>
                )}
                {!isNew && !hasPostedReviews && (
                  <Flex paddingHorizontal={'spacing16'}>
                    <Touchable
                      style={{
                        ...styles.moreButton,
                        borderColor: theme.colors.background3,
                      }}
                      onPress={() =>
                        navigation.navigate(Stack.LeaveFeedbackScreen, {
                          //@ts-ignore
                          tutor: user,
                        })
                      }>
                      <Text variant={'subheadSmall'} color={'textPrimary'}>
                        {`${t('post_review')}`}
                      </Text>
                    </Touchable>
                  </Flex>
                )}
              </Flex>
            )}
            <Touchable
              onPress={() =>
                //@ts-ignore
                navigation.navigate(Stack.ResumeScreen, {user, isNew})
              }
              style={{
                ...styles.b_button,
              }}>
              <Flex
                borderBottomWidth={4}
                gap={'none'}
                px={'spacing6'}
                paddingVertical={'spacing8'}
                justifyContent={'space-evenly'}
                borderBottomColor={'background3'}
                style={{
                  ...styles.b_button,
                }}>
                <Text variant={'bodyLarge'} color={'textPrimary'}>
                  {t('my_resume')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </Flex>
            </Touchable>
          </Flex>
        </ScrollView>
      </Flex>
      {user &&
        typeof isNew !== 'undefined' &&
        me.id !== user.id &&
        footerComponent()}
    </Screen>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  slider: {
    flex: 1,
  },
  b_button: {
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  moreButton: {
    width: '100%',
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  flag: {
    borderRadius: 3,
    marginTop: 2,
    marginLeft: -8,
  },
  badge: {
    marginTop: 2,
    marginLeft: -12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  playbutton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullView: {width: '100%', height: '100%'},
});

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

function getTotalGifts(items?: Record<string, number>): number {
  let total = 0;
  if (!items) {
    return 0;
  }
  Object.keys(items).map(_ => {
    total += items[_] as number;
  });
  return total;
}
