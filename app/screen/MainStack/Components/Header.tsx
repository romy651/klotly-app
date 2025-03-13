import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/core';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {UserInfo} from 'app/redux/user/userReducer';
import {Stack} from 'app/routes/screens/Stack';
import {
  getOnlineStatus,
  getPostsLenght,
  getUserfollowers,
} from 'app/utils/tools';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, TouchableNativeFeedback as Touchable} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRooms} from 'app/actions/roomAction';
import {Room} from 'app/actions/chatType';

type Props = {
  user?: UserInfo;
  followUser?: (id: string) => void;
};

const Header = ({user, followUser}: Props) => {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [followersCount, setFollowersCount] = useState<number>(0);
  const me = useAppSelector(state => state.user);
  const following = (me.following || []).includes(user?.id || '');
  const [posts, setPosts] = useState<number>(0);
  const [online, setOnline] = useState<boolean>(false);
  const {createRoom} = useRooms();

  const reviews = useCallback(() => {
    if (user && user.isTutor) {
      const _ = user.tutorObj?.reviews.length;
      return _;
    } else {
      return 0;
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      if (user) {
        if (me.id !== user.id) {
          const followers = await getUserfollowers(user.id);
          setFollowersCount(followers.length);
        }
        const _ = await getPostsLenght(user.id);
        setPosts(_);
        const status = await getOnlineStatus(user.id);
        setOnline(status !== 0);
      }
    })();
  }, [user, me.id]);

  const create_room = async () => {
    if (!user) {
      return;
    }
    const room = (await createRoom(user)) as Room;
    console.log('it is now created: ', room);
    navigation.push(Stack.ChatScreen, {room});
  };

  const onSendGift = () => {
    if (!user) {
      return;
    }
    navigation.navigate(Stack.GiftScreen, {userId: user.id as string});
  };

  const toggleFollow = () => {
    if (!user) {
      return;
    }
    followUser && followUser(user.id);
  };

  if (!user) {
    return null;
  } else {
    return (
      <Flex
        pb={'spacing10'}
        backgroundColor={'background0'}
        borderBottomWidth={1}
        gap={'none'}
        borderBottomColor={'background3'}>
        <Flex
          gap={'spacing6'}
          backgroundColor={'background0'}
          flexDirection={'row'}
          style={styles.header}>
          <Flex style={styles.avatarFlex}>
            <FastImage
              source={{uri: user.avatar, cache: 'immutable'}}
              style={styles.avatar}
            />
            {user.id !== me.id && (
              <Flex
                backgroundColor={online ? 'accentSuccess' : 'background3'}
                style={{...styles.dot, borderColor: theme.colors.background3}}
              />
            )}
          </Flex>
          <Flex
            justifyContent={'space-between'}
            width={SCREEN_WIDTH - 115}
            gap={'spacing4'}
            ml={'spacing4'}
            flexDirection={'row'}>
            <TouchableOpacity
              onPress={() =>
                (user.following?.length || 0) > 0
                  ? navigation.navigate(Stack.FollowScreen, {
                      userId: user.id,
                      type: 'following',
                    })
                  : {}
              }>
              <Flex
                paddingHorizontal={'spacing6'}
                alignItems={'center'}
                gap={'spacing2'}>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {(user.following || []).length}
                </Text>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {t('following')}
                </Text>
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                (followersCount || 0) > 0
                  ? navigation.navigate(Stack.FollowScreen, {
                      userId: user.id,
                      type: 'followers',
                    })
                  : {}
              }>
              <Flex
                paddingHorizontal={'spacing6'}
                alignItems={'center'}
                gap={'spacing2'}>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {followersCount}
                </Text>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {t('followers')}
                </Text>
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                (posts || 0) > 0
                  ? navigation.navigate(Stack.PostsScreen, {
                      userId: user.id,
                    })
                  : {}
              }>
              <Flex
                paddingHorizontal={'spacing6'}
                alignItems={'center'}
                gap={'spacing2'}>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {posts}
                </Text>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {posts > 1 ? t('posts') : t('post')}
                </Text>
              </Flex>
            </TouchableOpacity>
            {user.isTutor && (
              <TouchableOpacity
                onPress={() =>
                  (reviews() || 0) > 0
                    ? navigation.navigate(Stack.ReviewScreen, {
                        tutor: user as UserInfo,
                        isNew: false,
                      })
                    : {}
                }>
                <Flex
                  paddingHorizontal={'spacing6'}
                  alignItems={'center'}
                  gap={'spacing2'}>
                  <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                    {reviews()}
                  </Text>
                  <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                    {(reviews() || 0) > 1 ? t('reviews') : t('review')}
                  </Text>
                </Flex>
              </TouchableOpacity>
            )}
          </Flex>
        </Flex>
        <Flex px={'spacing10'} gap={'none'} backgroundColor={'background0'}>
          <Flex
            style={{marginTop: -10}}
            alignItems={'center'}
            flexDirection={'row'}>
            <Text
              style={{maxWidth: SCREEN_WIDTH - 150}}
              fontWeight={'bold'}
              color={'textPrimary'}
              variant={'subheadLarge'}>
              {`${user.firstName} ${user.lastName}`}
            </Text>
            <MatIcon
              selectionColor={'white'}
              name={'verified'}
              style={{marginTop: 1, marginLeft: -10}}
              size={20}
              color={theme.colors.accentActive}
            />
          </Flex>
          <Flex flexDirection={'row'} alignItems={'center'}>
            <Text
              style={styles.normalText}
              color={'textSecondary'}
              variant={'buttonLabelSmall'}>
              {(user.age || 24) +
                ', ' +
                t(user.gender) +
                ', ' +
                user.country +
                ' '}
            </Text>
            <CountryFlag style={styles.flag} isoCode={user.country} size={14} />
          </Flex>
          <Flex gap={'spacing10'} alignItems={'center'} flexDirection={'row'}>
            <Entypo
              name="language"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text
              color={'textSecondary'}
              variant={'buttonLabelSmall'}
              paddingHorizontal={'spacing6'}>
              {user.languages.map((elt: string) => t(elt)).join(', ')}
            </Text>
          </Flex>

          {(user.intro || '').length > 0 && (
            <Text variant={'bodySmall'} mb={'spacing10'} color={'textPrimary'}>
              {user.intro || ''}
            </Text>
          )}
        </Flex>

        {me.id !== user.id && (
          <Flex
            width={SCREEN_WIDTH}
            px={'spacing14'}
            mt={'spacing10'}
            flexDirection={'row'}
            alignItems={'center'}
            style={{backgroundColor: 'transparent'}}>
            <Touchable style={{flex: 1}} onPress={toggleFollow}>
              <Flex
                py={'spacing6'}
                borderRadius={'rounded8'}
                flexDirection={'row'}
                alignItems={'center'}
                px={'spacing18'}
                justifyContent={'center'}
                backgroundColor={following ? 'background3' : 'accentActive'}>
                <Text
                  color={following ? 'textSecondary' : 'white'}
                  variant={'buttonLabelSmall'}>
                  {following ? t('unfollow') : t('follow')}
                </Text>
              </Flex>
            </Touchable>
            <Touchable style={{flex: 1}} onPress={create_room}>
              <Flex
                py={'spacing6'}
                px={'spacing18'}
                borderRadius={'rounded8'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                backgroundColor={'background3'}>
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {t('message')}
                </Text>
              </Flex>
            </Touchable>
            <Touchable onPress={onSendGift}>
              <Flex
                width={45}
                height={33}
                borderRadius={'roundedFull'}
                alignItems={'center'}
                justifyContent={'center'}
                backgroundColor={'background3'}>
                <Feather
                  name={'gift'}
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </Flex>
            </Touchable>
          </Flex>
        )}
      </Flex>
    );
  }
};

export default Header;

const styles = StyleSheet.create({
  normalText: {},
  dot: {
    width: 15,
    height: 15,
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderRadius: 3,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarFlex: {width: 70, height: 70, borderRadius: 5},
  avatar: {width: '100%', height: '100%', borderRadius: 5},
  flag: {
    borderRadius: 2,
    marginLeft: -10,
    marginBottom: 1,
  },
});
