import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {UserInfo} from 'app/redux/user/userReducer';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import FastImage from 'react-native-fast-image';
import {getUser} from 'app/actions/chatAction';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {PoolItem, PostItem, QuizItem} from 'app/hooks/usePost';
import CountryFlag from 'react-native-country-flag';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import ContextMenu from 'react-native-context-menu-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FBCollage from 'react-native-fb-collage';
import {Stack} from 'app/routes/screens/Stack';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import Animated, {SlideInLeft} from 'react-native-reanimated';

interface PostItemProps {
  item: PostItem;
  onLike: () => void;
  onComment: (focus?: boolean) => void;
  answerPool: (pool: PoolItem[]) => Promise<void>;
  answerQuiz: (quiz: QuizItem[]) => Promise<void>;
  deletePost: () => Promise<void>;
  onReport: (user: UserInfo) => void;
}

const PostItemView: React.FC<PostItemProps> = ({
  item,
  onLike,
  onComment,
  answerPool,
  answerQuiz,
  deletePost,
  onReport,
}) => {
  const me = useAppSelector(state => state.user);
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  //const [time, setTime] = useState<string>('-')
  const [owner, setOwner] = useState<UserInfo>();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  console.log('ON REPORT', onReport);

  useEffect(() => {
    if (item.pool.length > 0) {
      setHasVoted(item.pool.some(p => p.vote?.includes(me.id)));
    } else if (item.quiz.length > 0) {
      setHasVoted(item.quiz.some(q => q.options.vote?.includes(me.id)));
    }
  }, [item, me.id]);

  const totalVote = () => {
    if (item.pool.length > 0) {
      return item.pool.reduce((acc, curr) => acc + (curr.vote?.length || 0), 0);
    }
    if (item.quiz.length > 0) {
      return item.quiz.reduce(
        (acc, curr) => acc + (curr.options.vote?.length || 0),
        0,
      );
    }
    return -1;
  };

  const gotRight = () => {
    if (!hasVoted) {
      return '';
    }
    if (item.quiz.length > 0) {
      const rightAnswer = item.quiz.find(q => q.options.isTrue);
      if (rightAnswer && rightAnswer.options.vote?.includes(me.id)) {
        return true;
      } else {
        return false;
      }
    }
    return '';
  };

  useEffect(() => {
    const fetchOwner = async () => {
      if (item.ownerId === me.id) {
        setOwner(me);
        return;
      }
      const _ = await getUser(item.ownerId);
      setOwner(_);
    };

    fetchOwner();
  }, [item.ownerId, me]);

  const actions = [
    ...(item.ownerId !== me.id
      ? [
          {
            title: t('report'),
            systemIcon: 'flag-outline',
            action: () => onReport(owner as UserInfo),
          },
        ]
      : []),
    {
      title: t('share'),
      systemIcon: 'share-variant-outline',
      action: () => onReport(owner as UserInfo),
    },
    ...(item.ownerId === me.id
      ? [
          {
            title: t('delete'),
            systemIcon: 'delete-outline',
            action: () => {
              Alert.alert(t('delete'), t('delete_post') as string, [
                {
                  text: t('cancel') as string,
                  style: 'cancel',
                },
                {
                  text: t('yes') as string,
                  style: 'destructive',
                  onPress: () => {
                    deletePost();
                  },
                },
              ]);
            },
          },
        ]
      : []),
    {
      title: t('cancel'),
      systemIcon: 'close',
      action: () => {},
    },
  ];

  const onShowImage = (index: number, images: string[]) => {
    navigation?.push(Stack.GalleryScreen, {
      index: index,
      photos: images,
    });
  };

  const addPool = async (answer: string) => {
    // Check if the user has already voted
    setShouldAnimate(true);
    if (hasVoted) {
      console.log('User has already voted');
      return;
    }
    setLoading(true);
    const pool_item = item.pool.find(p => p.content === answer) as PoolItem;
    if (!pool_item.vote) {
      pool_item.vote = [me.id];
    } else {
      pool_item.vote.push(me.id);
    }
    // Update the original pool with the modified pool_item
    const updatedPool = item.pool.map(p =>
      p.content === answer ? pool_item : p,
    );

    // Call the answerPool function to update the post
    await answerPool(updatedPool);
    setLoading(false);
  };

  const addQuiz = async (answer: string) => {
    // Check if the user has already voted
    if (hasVoted) {
      console.log('User has already voted');
      return;
    }
    setLoading(true);
    const quiz_item = item.quiz.find(q => q.content === answer) as QuizItem;
    if (!quiz_item.options.vote) {
      quiz_item.options.vote = [me.id];
    } else {
      quiz_item.options.vote.push(me.id);
    }

    const updatedQuiz = item.quiz.map(q =>
      q.content === answer ? quiz_item : q,
    );

    await answerQuiz(updatedQuiz);
    setLoading(false);
  };

  const getWidth = (idx: number) => {
    let width = 0;
    if (item.pool.length > 0) {
      width = ((item.pool[idx].vote || [])?.length || 0) / totalVote();
    } else if (item.quiz.length > 0) {
      width = ((item.quiz[idx].options.vote || []).length || 0) / totalVote();
    }
    return width;
  };

  if (!owner) {
    return null;
  } else {
    return (
      <Flex
        mt={'spacing10'}
        pt={'spacing14'}
        gap={'none'}
        width={'100%'}
        backgroundColor={'background2'}
        py={'spacing10'}>
        <Flex
          justifyContent={'space-between'}
          flexDirection={'row'}
          px={'spacing10'}
          alignItems={'center'}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (item.ownerId.toString() === me.id.toString()) {
                navigation.navigate('AccountScreen');
              } else if (owner.isTutor) {
                navigation.navigate(Stack.UserProfileScreen, {
                  userId: owner.id,
                  user: owner,
                });
              } else {
                navigation.navigate(Stack.ProfileScreen, {
                  id: owner.id,
                  user: owner,
                });
              }
            }}>
            <Flex flexDirection={'row'}>
              <View style={styles.centerView}>
                <FastImage
                  source={{uri: owner.avatar}}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <CountryFlag
                  isoCode={owner.country}
                  size={20}
                  style={styles.flag}
                />
              </View>
              <Flex gap={'none'}>
                <Text
                  variant={'buttonLabelMedium'}
                  color={
                    'textPrimary'
                  }>{`${owner.firstName} ${owner.lastName}`}</Text>
                <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
                  {t('professional_tutor')}
                </Text>
              </Flex>
            </Flex>
          </TouchableOpacity>
          <ContextMenu
            dropdownMenuMode
            actions={actions}
            onPress={e => actions[e.nativeEvent.index]?.action()}>
            <TouchableIcon
              Component={Ionicon}
              action={() => {}}
              name="ellipsis-horizontal-sharp"
              size={24}
              color={theme.colors.textPrimary}
            />
          </ContextMenu>
        </Flex>
        <Text
          mt={'spacing8'}
          mb={'spacing4'}
          px={'spacing10'}
          variant={'bodySmall'}
          color={'textPrimary'}>
          {item.content}
        </Text>
        {item.images.length > 0 && (
          <Flex px={'spacing4'}>
            <FBCollage
              style={{width: '100%'}}
              images={item.images}
              imageOnPress={onShowImage}
              spacing={5}
              borderRadius={0}
            />
          </Flex>
        )}
        {item.pool.length > 0 && (
          <Flex mt={'spacing6'} gap={'spacing8'} px={'spacing10'}>
            {item.pool.map((_, index) => (
              <TouchableOpacity
                onPress={() => addPool(_.content)}
                activeOpacity={0.7}
                key={index}>
                <View
                  style={{
                    ...styles.choiceView,
                    borderColor: _.vote?.includes(me.id)
                      ? theme.colors.accentAction
                      : theme.colors.background3,
                    backgroundColor: theme.colors.background3,
                  }}>
                  {(shouldAnimate || hasVoted) && (
                    <Animated.View
                      entering={SlideInLeft}
                      style={[
                        styles.animationView,
                        {
                          width: `${getWidth(index) * 100}%`,
                          backgroundColor: theme.colors.blue300,
                        },
                      ]}
                    />
                  )}
                  <Text
                    ml={'spacing10'}
                    variant={'buttonLabelSmall'}
                    color={'textPrimary'}>
                    {_.content}
                  </Text>
                  {(shouldAnimate || hasVoted) && (
                    <Text
                      mr={'spacing10'}
                      variant={'buttonLabelSmall'}
                      color={'textPrimary'}>
                      {`${Math.round(getWidth(index) * 100)}%`}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Flex>
        )}
        {item.quiz.length > 0 && (
          <Flex mt={'spacing6'} gap={'spacing8'} px={'spacing10'}>
            {item.quiz.map((_, index) => (
              <TouchableOpacity
                onPress={() => addQuiz(_.content)}
                activeOpacity={0.7}
                key={index}>
                <View
                  style={{
                    ...styles.choiceView,
                    borderColor: hasVoted
                      ? _.options.isTrue
                        ? theme.colors.accentSuccess
                        : theme.colors.accentCritical
                      : theme.colors.background3,
                    backgroundColor: theme.colors.background3,
                  }}>
                  {(shouldAnimate || hasVoted) && (
                    <Animated.View
                      entering={SlideInLeft}
                      style={[
                        styles.animationView,
                        {
                          width: `${getWidth(index) * 100}%`,
                          backgroundColor: _.options.isTrue
                            ? theme.colors.accentSuccess
                            : theme.colors.accentCritical,
                        },
                      ]}
                    />
                  )}
                  <Text
                    ml={'spacing10'}
                    variant={'buttonLabelSmall'}
                    color={'textPrimary'}>
                    {_.content}
                  </Text>
                  {(shouldAnimate || hasVoted) && (
                    <Flex
                      flexDirection={'row'}
                      alignItems={'center'}
                      gap={'spacing10'}>
                      <Text
                        mr={'spacing10'}
                        variant={'buttonLabelSmall'}
                        color={'textPrimary'}>
                        {`${Math.round(getWidth(index) * 100)}%`}
                      </Text>
                    </Flex>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Flex>
        )}
        {totalVote() > -1 && (
          <Flex
            mt={'spacing6'}
            gap={'none'}
            width={'100%'}
            justifyContent={'space-between'}
            flexDirection={'row'}
            alignItems={'center'}>
            <Flex flexDirection={'row'} alignItems={'center'} gap={'spacing4'}>
              <Text
                mx={'spacing12'}
                variant={'buttonLabelMicro'}
                color={'textSecondary'}>
                {`${totalVote()} ${t(
                  totalVote() > 1 ? t('votes') : t('vote'),
                )}`}
              </Text>
              {loading && (
                <CircularActivityIndicator
                  size={12}
                  color={theme.colors.accentAction}
                />
              )}
            </Flex>
            {gotRight() === '' ? null : gotRight() ? (
              <Text
                mr={'spacing12'}
                variant={'buttonLabelMicro'}
                color={'accentSuccess'}>
                {t('you_got_it_right')}
              </Text>
            ) : (
              <Text
                mr={'spacing12'}
                variant={'buttonLabelMicro'}
                color={'accentCritical'}>
                {t('you_got_it_wrong')}
              </Text>
            )}
          </Flex>
        )}
        <Flex
          flexDirection={'row'}
          borderTopWidth={1}
          mt={'spacing10'}
          pt={'spacing10'}
          px={'spacing10'}
          alignItems={'center'}
          borderTopColor={'background3'}
          justifyContent={'space-between'}>
          <Flex gap={'spacing4'} flexDirection={'row'}>
            <TouchableIcon
              Component={AntDesign}
              action={onLike}
              name={item.likes.includes(me.id) ? 'like1' : 'like2'}
              size={18}
              color={
                item.likes.includes(me.id)
                  ? theme.colors.accentAction
                  : theme.colors.textPrimary
              }
            />
            <TouchableIcon
              Component={MatComIcon}
              action={() => onComment(true)}
              name="comment-multiple-outline"
              size={18}
              color={theme.colors.textPrimary}
            />
          </Flex>
          <Flex flexDirection={'row'} gap={'spacing12'}>
            <TouchableOpacity
              onPress={() => {
                if (item.likes.length > 0) {
                  navigation.push(Stack.FollowScreen, {
                    userId: item.likes,
                    type: 'likes',
                  });
                }
              }}>
              <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                {`${item.likes.length} ${t(
                  item.likes.length > 1 ? t('likes') : t('like'),
                )}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onComment()}>
              <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                {`${item.comments.length} ${t(
                  item.comments.length > 1 ? t('comments') : t('comment'),
                )}`}
              </Text>
            </TouchableOpacity>
          </Flex>
        </Flex>
      </Flex>
    );
  }
};

export default PostItemView;

const styles = StyleSheet.create({
  animationView: {
    height: '100%',
    position: 'absolute',
  },
  choiceView: {
    width: '100%',
    overflow: 'hidden',
    height: 40,
    justifyContent: 'space-between',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  centerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  flag: {
    position: 'absolute',
    borderRadius: 50,
    right: -5,
    bottom: 0,
    width: 20,
    height: 20,
  },
});
