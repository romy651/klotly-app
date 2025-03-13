import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import React, {useCallback, useState} from 'react';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {UserInfo} from 'app/redux/user/userReducer';

export type PoolItem = {
  content: string;
  vote?: string[]; // shows the ids of the users who voted for this option
};

export type QuizItem = {
  content: string;
  options: {isTrue: boolean; vote?: string[]};
};

export type PostItem = {
  id: number;
  created_at: number;
  updated_at: number;
  ownerId: string;
  language: string;
  content: string;
  images: string[];
  comments: {
    ownerId: string;
    content: string;
    created_at: number;
  }[];
  likes: string[];
  pool: PoolItem[];
  quiz: QuizItem[];
};

export const usePost = (following?: boolean) => {
  const me = useAppSelector(state => state).user;
  const [posts, setPosts] = useState<PostItem[]>([]);

  const onRefresh = useCallback(async () => {
    let req: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;
    if (following) {
      if ((me.following || []).length > 0) {
        req = firestore()
          .collection('posts')
          .where('ownerId', 'in', me.following || []);
      } else {
        req = firestore().collection('posts');
      }
    } else {
      req = firestore().collection('posts');
    }
    if ((me.blocked_users || []).length > 0) {
      req = req
        .where('id', 'not-in', me.blocked_users || [])
        .orderBy('created_at', 'desc');
    } else {
      req = req.orderBy('created_at', 'desc');
    }

    const res = await req.get();
    setPosts(
      res.docs.map(b => {
        const _ = b.data() as PostItem;
        return _;
      }),
    );
  }, [me, following]);

  React.useEffect(() => {
    (async () => {
      if (!me) {
        return;
      }
      onRefresh();
    })();
  }, [onRefresh, me]);

  const likePost = async (postId: number) => {
    await firestore()
      .collection('posts')
      .doc(`${postId}`)
      .update({
        likes: firestore.FieldValue.arrayUnion(me.id),
      });
    // Update the local state after liking a post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: [...post.likes, me.id],
            }
          : post,
      ),
    );
  };

  const unLikePost = async (postId: number) => {
    await firestore()
      .collection('posts')
      .doc(`${postId}`)
      .update({
        likes: firestore.FieldValue.arrayRemove(me.id),
      });
    // Update the local state after unliking a post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.filter(id => id !== me.id),
            }
          : post,
      ),
    );
  };

  const addComment = async (postId: number, comment: string) => {
    const res = {
      ownerId: me.id,
      content: comment,
      created_at: Date.now(),
    };
    await firestore()
      .collection('posts')
      .doc(`${postId}`)
      .update({
        comments: firestore.FieldValue.arrayUnion(res),
      });

    // Update the local state after adding a comment
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), res],
            }
          : post,
      ),
    );
  };

  const answerPool = async (postId: number, pool: PoolItem[]) => {
    await firestore().collection('posts').doc(`${postId}`).update({
      pool,
    });
    // Update the local state after answering a pool
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? {...post, pool: pool} : post,
      ),
    );
  };

  const answerQuiz = async (postId: number, quiz: QuizItem[]) => {
    await firestore().collection('posts').doc(`${postId}`).update({
      quiz,
    });
    // Update the local state after answering a quiz
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? {...post, quiz: quiz} : post,
      ),
    );
  };

  const getRecommendedPeople = async () => {
    let req: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;
    if ((me.following || []).length > 0) {
      req = firestore()
        .collection('users')
        .where('id', 'not-in', me.following)
        .limit(10);
    } else {
      req = firestore().collection('users').limit(10);
    }
    const res = await req.get();
    return res.docs.map(b => {
      const _ = b.data() as UserInfo;
      return _;
    });
  };

  const deletePost = async (postId: number) => {
    try {
      await firestore().collection('posts').doc(`${postId}`).delete();
      // Update the local state to remove the deleted post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return {
    posts,
    likePost,
    unLikePost,
    addComment,
    answerPool,
    answerQuiz,
    getRecommendedPeople,
    deletePost,
    onRefresh,
  };
};
