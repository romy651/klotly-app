import {Flex} from 'app/components/layout/Flex';
import React, {useEffect, useState} from 'react';
import {Text} from 'app/components/core/Text/Text';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {PoolItem, PostItem, QuizItem, usePost} from 'app/hooks/usePost';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import PostItemView from './PostItem';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/core';
import PostLoader from 'app/components/Loader/PostLoader';
import {UserInfo} from 'app/redux/user/userReducer';
import {StyleSheet} from 'react-native';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import CountryFlag from 'react-native-country-flag';
import FastImage from 'react-native-fast-image';
import {View, TouchableNativeFeedback as Touchable} from 'react-native';
import {ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {navigate} from 'app/navigation/rootNavigation';
import {Stack} from 'app/routes/screens/Stack';

type Props = {};

type EmptyPostProps = {
  recommendedPeople: UserInfo[];
};

const EmptyPost = ({recommendedPeople}: EmptyPostProps) => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  const navigation = useNavigation<any>();

  const onFollowPressed = (personId: string) => {
    if ((me.following || []).includes(personId)) {
      console.log('we unfollow');
      firestore()
        .collection('users')
        .doc(me.id)
        .update({
          following: firestore.FieldValue.arrayRemove(personId),
        });
    } else {
      console.log('we follow');
      firestore()
        .collection('users')
        .doc(me.id)
        .update({
          following: firestore.FieldValue.arrayUnion(personId),
        });
    }
  };

  return (
    <Flex
      flex={1}
      width={'100%'}
      backgroundColor={'background2'}
      mt={'spacing20'}
      pb={'spacing20'}
      pt={'spacing16'}>
      <Text mx={'spacing10'} variant={'buttonLabelLarge'}>
        {t('recommended_people')}
      </Text>
      <ScrollView>
        {recommendedPeople.map((person, index) => (
          <Touchable
            onPress={() => {
              if (person.isTutor) {
                navigation.navigate(Stack.UserProfileScreen, {
                  userId: person.id,
                  user: person,
                });
              } else {
                navigation.navigate(Stack.ProfileScreen, {
                  id: person.id,
                });
              }
            }}>
            <Flex
              px={'spacing10'}
              justifyContent={'space-between'}
              flexDirection={'row'}
              key={index}
              py={'spacing8'}
              alignItems={'center'}>
              <Flex alignItems={'center'} flexDirection={'row'}>
                <View style={styles.centerView}>
                  <FastImage
                    source={{uri: person.avatar}}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                  <CountryFlag isoCode="US" size={20} style={styles.flag} />
                </View>
                <Flex gap={'none'}>
                  <Text
                    variant={'buttonLabelMedium'}
                    color={
                      'textPrimary'
                    }>{`${person.firstName} ${person.lastName}`}</Text>
                  {person.isTutor && (
                    <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
                      {t('professional_tutor')}
                    </Text>
                  )}
                  <Flex
                    flexDirection={'row'}
                    gap={'none'}
                    alignItems={'center'}>
                    <AntDesign
                      style={{marginRight: 5}}
                      name="message1"
                      size={12}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      key={index}
                      variant={'bodyMicro'}
                      color={'textSecondary'}>
                      {person.languages.join(', ')}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <TouchableIcon
                Component={Ionicon}
                action={() => onFollowPressed(person.id)}
                name={
                  (me.following || []).includes(person.id)
                    ? 'person-remove-outline'
                    : 'person-add-outline'
                }
                size={18}
                color={
                  (me.following || []).includes(person.id)
                    ? theme.colors.textSecondary
                    : theme.colors.accentAction
                }
                style={{
                  backgroundColor: (me.following || []).includes(person.id)
                    ? theme.colors.accentActionSoft
                    : theme.colors.background3,
                  borderColor: me.following.includes(person.id.toString())
                    ? theme.colors.background3
                    : theme.colors.accentAction,
                  borderWidth: 1.5,
                }}
              />
            </Flex>
          </Touchable>
        ))}
      </ScrollView>
    </Flex>
  );
};

const FollowingPost = ({}: Props): React.JSX.Element => {
  const me = useAppSelector(state => state.user);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendedPeople, setRecommendedPeople] = useState<UserInfo[]>([]);

  const {
    posts,
    likePost,
    addComment,
    unLikePost,
    answerPool,
    answerQuiz,
    getRecommendedPeople,
  } = usePost(true);

  useEffect(() => {
    (async () => {
      if (posts) {
        setLoading(false);
      }
      if (posts && posts.length === 0) {
        const res = await getRecommendedPeople();
        setRecommendedPeople(res);
      }
    })();
  }, [posts, getRecommendedPeople]);

  const onLIkePressed = (postId: number, key: number) => {
    console.log('we press');
    if (posts[key].likes.includes(me.id)) {
      console.log('we unlike');
      unLikePost(postId);
    } else {
      console.log('we like');
      likePost(postId);
    }
  };

  const onCommentPressed = (postId: number, focus?: boolean) => {
    navigation.navigate('CommentSheetScreen', {
      postId,
      onComment: async (text: string) => {
        await addComment(postId, text);
      },
      focus,
    });
  };

  const renderItem = ({item, index}: {item: PostItem; index: number}) => (
    <Flex>
      <PostItemView
        key={index}
        item={item}
        onLike={() => onLIkePressed(item.id, index)}
        onComment={focus => onCommentPressed(item.id, focus)}
        answerPool={async (pool: PoolItem[]) => await answerPool(item.id, pool)}
        answerQuiz={async (quiz: QuizItem[]) => await answerQuiz(item.id, quiz)}
      />
    </Flex>
  );

  return (
    <Flex flex={1} paddingHorizontal={'spacing4'}>
      <FlashList
        data={posts}
        numColumns={1}
        ListEmptyComponent={
          loading ? (
            <PostLoader />
          ) : (
            <EmptyPost recommendedPeople={recommendedPeople} />
          )
        }
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </Flex>
  );
};

export default FollowingPost;

const styles = StyleSheet.create({
  centerView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
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
