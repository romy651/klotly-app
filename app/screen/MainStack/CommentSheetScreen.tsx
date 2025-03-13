import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, TextInput} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useBackHandler} from '@react-native-community/hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommentLoader from 'app/components/Loader/CommentLoader';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {PostItem} from 'app/hooks/usePost';
import CommentItem from './Components/CommentItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.CommentSheetScreen
>;

const CommentSheetScreen: React.FC<Props> = ({navigation, route}) => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const {postId, onComment, focus} = route.params;
  const bottomSheetRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [comments, setComments] = useState<any>([]);
  const snapPoints = useMemo(() => ['85%'], []);
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

  useEffect(() => {
    console.log('THE POST ID', postId);
    const subscriber = firestore()
      .collection('posts')
      .doc(`${postId}`)
      .onSnapshot(async snapshot => {
        const post = snapshot.data() as PostItem;
        console.log('THE POST', post);
        if (!post || post.comments.length === 0) {
          setComments([]);
          console.log('THE COMMENTSss');
          setLoading(false);
          return;
        }
        const _ = await fetchComments(post);
        setComments(_);
        console.log('THE COMMENTS', _);
        setLoading(false);
      });
    return () => subscriber();
  }, [postId]);

  const onSend = async () => {
    setIsSending(true);
    await onComment(text);
    setText('');
    setIsSending(false);
  };

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        alignItems={'center'}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        justifyContent={'space-between'}
        flexDirection={'row'}
        px={'spacing16'}
        width="100%">
        <Flex
          borderWidth={1.5}
          borderColor={'background3'}
          height={42}
          justifyContent={'center'}
          px={'spacing6'}
          borderRadius={'rounded8'}
          width={SCREEN_WIDTH - 90}>
          <TextInput
            value={text}
            onChangeText={setText}
            autoFocus={focus}
            placeholder={t('add_comment') as string}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </Flex>
        {isSending ? (
          <CircularActivityIndicator
            style={{marginRight: 10}}
            color={theme.colors.accentAction}
          />
        ) : (
          <TouchableIcon
            name="send"
            Component={Ionicon}
            disable={text.length === 0}
            size={20}
            style={{
              backgroundColor:
                text.length === 0
                  ? theme.colors.background3
                  : theme.colors.accentAction,
            }}
            color={theme.colors.white}
            action={onSend}
          />
        )}
      </Flex>
    );
  };

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const emptyComponent = () => {
    return (
      <Flex
        flex={1}
        justifyContent={'center'}
        px={'spacing10'}
        pt={'spacing48'}
        alignItems={'center'}>
        <FontAwesome
          name="comments-o"
          color={theme.colors.textSecondary}
          size={90}
        />
        <Text
          textAlign={'center'}
          variant={'bodyLarge'}
          color={'textSecondary'}>
          {t('no_comment')}
        </Text>
      </Flex>
    );
  };

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
      <Flex
        backgroundColor={'background2'}
        height={45}
        borderBottomWidth={1}
        borderBottomColor={'background3'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
          {t('add_comment')}
        </Text>
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <BottomSheetFlatList
          data={[...comments]}
          ListEmptyComponent={loading ? <CommentLoader /> : emptyComponent()}
          renderItem={({item}: {item: any}) => <CommentItem {...item} />}
          contentContainerStyle={{
            ...styles.contentContainer,
            backgroundColor: theme.colors.background0,
          }}
        />
      </Flex>
      {footerComponent()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default CommentSheetScreen;

const fetchComments = async (post: PostItem) => {
  console.log('THE POST', post);

  const uniqueUserIds = new Set(post.comments.map(comment => comment.ownerId));

  console.log('THE UNIQUE USER IDS', uniqueUserIds);

  // Fetch user data for all unique users in one batch
  const userDocs = await firestore()
    .collection('users')
    .where(
      firebase.firestore.FieldPath.documentId(),
      'in',
      Array.from(uniqueUserIds),
    )
    .get();

  // Create a map of user data
  const userDataMap = new Map();
  userDocs.forEach(doc => {
    userDataMap.set(doc.id, doc.data());
  });

  // Attach user info to comments
  const commentsWithUserInfo = post.comments.map(comment => {
    const userData = userDataMap.get(comment.ownerId) || {};
    return {
      ...comment,
      user: {
        id: comment.ownerId,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        avatar: userData.avatar || '',
      },
    };
  });

  return commentsWithUserInfo;
};
