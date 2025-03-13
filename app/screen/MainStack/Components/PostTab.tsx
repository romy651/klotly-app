import {Flex} from 'app/components/layout/Flex';
import React, {useEffect, useState} from 'react';
import {Text} from 'app/components/core/Text/Text';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {PoolItem, PostItem, QuizItem} from 'app/hooks/usePost';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import PostItemView from './PostItem';
import {useNavigation} from '@react-navigation/core';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostLoader from 'app/components/Loader/PostLoader';
import firestore from '@react-native-firebase/firestore';
import {FlashList} from '@shopify/flash-list';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import {UserInfo} from 'app/redux/user/userReducer';

type Props = {
  userId: string;
};

const PostTab = ({userId}: Props): React.JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const me = useAppSelector(state => state.user);

  useEffect(() => {
    console.log('userIdSS', userId);
    const subscriber = firestore()
      .collection('posts')
      .where('ownerId', '==', `${userId}`)
      .onSnapshot(
        querySnapshot => {
          const _ = querySnapshot.docs.map(doc => doc.data() as PostItem);
          setPosts(_);
          console.log('posts', _);
          setLoading(false);
        },
        error => {
          console.log('error', error);
          setLoading(false);
        },
      );
    return () => subscriber();
  }, []);

  const onCommentPressed = (postId: number, focus?: boolean) => {
    navigation.navigate('CommentSheetScreen', {
      postId,
      onComment: async (text: string) => {
        const res = {
          ownerId: me.id,
          content: text,
          created_at: Date.now(),
        };
        const db = firestore();
        await db
          .collection('posts')
          .doc(`${postId}`)
          .update({
            comments: firestore.FieldValue.arrayUnion(res),
          });
      },
      focus,
    });
  };

  const onLIkePressed = async (postId: number, key: number) => {
    console.log('we press');
    if (posts[key].likes.includes(me.id)) {
      console.log('we unlike');
      await firestore()
        .collection('posts')
        .doc(`${postId}`)
        .update({
          likes: firestore.FieldValue.arrayRemove(me.id),
        });
    } else {
      console.log('we like');
      await firestore()
        .collection('posts')
        .doc(`${postId}`)
        .update({
          likes: firestore.FieldValue.arrayUnion(me.id),
        });
    }
  };

  const deletePost = async (postId: number) => {
    await firestore().collection('posts').doc(`${postId}`).delete();
  };

  const answerPool = async (postId: number, pool: PoolItem[]) => {
    await firestore().collection('posts').doc(`${postId}`).update({
      pool,
    });
  };

  const answerQuiz = async (postId: number, quiz: QuizItem[]) => {
    await firestore().collection('posts').doc(`${postId}`).update({
      quiz,
    });
  };

  const onReportPressed = async (user: UserInfo, postId: number) => {
    navigation?.push(HomeStackScreens.ReportScreen, {
      user,
      type: 'posts',
      postId,
    });
  };

  const EmptyPost = () => (
    <Flex
      flex={1}
      justifyContent={'center'}
      px={'spacing10'}
      pt={'spacing48'}
      alignItems={'center'}>
      <MatComIcon
        name="leak-off"
        color={theme.colors.textSecondary}
        size={90}
      />
      <Text textAlign={'center'} variant={'bodyLarge'} color={'textSecondary'}>
        {t('no_relevant_content_found')}
      </Text>
    </Flex>
  );

  const renderItem = ({item, index}: {item: PostItem; index: number}) => (
    <Flex>
      <PostItemView
        key={index}
        item={item}
        onLike={() => onLIkePressed(item.id, index)}
        onComment={focus => onCommentPressed(item.id, focus)}
        answerPool={async (pool: PoolItem[]) => await answerPool(item.id, pool)}
        answerQuiz={async (quiz: QuizItem[]) => await answerQuiz(item.id, quiz)}
        deletePost={async () => await deletePost(item.id)}
        onReport={_ => onReportPressed(_, item.id)}
      />
    </Flex>
  );

  return (
    <FlashList
      data={posts}
      ListEmptyComponent={loading ? <PostLoader /> : <EmptyPost />}
      numColumns={1}
      renderItem={renderItem}
      contentContainerStyle={{paddingBottom: 100}}
    />
  );
};

export default PostTab;
