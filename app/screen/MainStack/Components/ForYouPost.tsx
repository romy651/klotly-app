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
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import {UserInfo} from 'app/redux/user/userReducer';

type Props = {};

const EmptyPost = () => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  return (
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
};

const ForYouPost = ({}: Props): React.JSX.Element => {
  const me = useAppSelector(state => state.user);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const {
    posts,
    likePost,
    addComment,
    unLikePost,
    answerPool,
    answerQuiz,
    deletePost,
    onRefresh,
  } = usePost();

  useEffect(() => {
    if (posts.length > 0) {
      setLoading(false);
    }
  }, [posts]);

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

  const onReportPressed = async (user: UserInfo, postId: number) => {
    navigation?.push(HomeStackScreens.ReportScreen, {
      user,
      type: 'posts',
      postId,
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
        onReport={_ => onReportPressed(_, item.id)}
        deletePost={async () => await deletePost(item.id)}
      />
    </Flex>
  );

  return (
    <Flex flex={1} paddingHorizontal={'spacing4'}>
      <FlashList
        data={posts}
        onRefresh={onRefresh}
        refreshing={loading}
        numColumns={1}
        ListEmptyComponent={loading ? <PostLoader /> : <EmptyPost />}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 105}}
      />
    </Flex>
  );
};

export default ForYouPost;
