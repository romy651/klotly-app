import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CharProgress} from 'app/components/char-progress/CharProgress';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {PoolItem, PostItem, QuizItem} from 'app/hooks/usePost';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {detectLanguage, uploadImages} from 'app/utils/tools';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  TouchableOpacity,
  UIManager,
} from 'react-native';
import {
  StyleSheet,
  TextInput,
  TouchableNativeFeedback as Touchable,
} from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.CreatePostScreen>;

const CreatePostScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string[]>([]);
  const [pool, setPool] = useState<PoolItem[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);
  const me = useAppSelector(state => state.user);
  const inset = useSafeAreaInsets();
  const opacity = useSharedValue<number>(1);

  const uploadPost = async (post: PostItem) => {
    await firestore().collection('posts').doc(`${post.id}`).set(post);
    setLoading(false);
    navigation.goBack();
  };

  const onSubmit = async () => {
    console.log('Submit button pressed');
    // Check if all pool items have content
    if (text.length === 0) {
      Alert.alert(t('error')!, t('enter_description') as string);
      return;
    }
    if (pool.length > 0) {
      const isPoolValid = pool.every(item => item.content.trim() !== '');
      if (!isPoolValid) {
        // Show an alert or handle the error
        Alert.alert(
          t('error')!,
          t('all_pool_options_must_have_content') as string,
        );
        return;
      }
    }

    // Check if all quiz items have content
    if (quiz.length > 0) {
      const isQuizValid = quiz.every(item => item.content.trim() !== '');
      if (!isQuizValid) {
        // Show an alert or handle the error
        Alert.alert(
          t('error')!,
          t('all_quiz_questions_must_have_content') as string,
        );
        return;
      }
    }
    setLoading(true);
    const lng = await detectLanguage(
      `${text} ${pool.map(item => item.content).join(' ')} ${quiz
        .map(item => item.content)
        .join(' ')}`,
    );
    const id = new Date().getTime();
    if (image.length > 0) {
      uploadImages(
        image,
        'post',
        me.id,
        () => {},
        () => {
          Alert.alert(t('error'), t('error_try_later') as string);
          setLoading(false);
        },
        async uris => {
          const post: PostItem = {
            id,
            created_at: id,
            updated_at: id,
            ownerId: me.id,
            language: lng,
            content: text,
            images: uris,
            pool: [],
            quiz: [],
            comments: [],
            likes: [],
          };
          uploadPost(post);
        },
      );
    } else {
      const post: PostItem = {
        id,
        created_at: id,
        updated_at: id,
        language: lng,
        ownerId: me.id,
        content: text,
        images: [],
        pool: pool,
        quiz: quiz,
        comments: [],
        likes: [],
      };
      uploadPost(post);
      console.log('All checks passed, submitting post');
    }
  };

  const onCancel = useCallback(() => {
    Alert.alert(t('cancel'), t('are_you_sure_to_cancel') as string, [
      {
        text: t('cancel') as string,
        style: 'destructive',
      },
      {
        text: t('yes') as string,
        onPress: () => navigation.goBack(),
      },
    ]);
    return true;
  }, [navigation, t]);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onCancel,
    );

    return () => backHandler.remove();
  }, [onCancel]);

  const uploadImage = async () => {
    const images = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 4 - image.length,
    });
    setImage([
      ...image,
      ...(images.assets || []).map(item => item.uri as string),
    ]);
    console.log('Upload image button pressed');
  };

  const deleteImage = (index: number) => {
    const newImage = image.filter((_, i) => i !== index);
    setImage(newImage);
  };

  const handlePoolChange = (index: number, content: string) => {
    const newPool = [...pool];
    newPool[index].content = content;
    setPool(newPool);
  };

  const handleQuizChange = (index: number, content: string) => {
    const newQuiz = [...quiz];
    newQuiz[index].content = content;
    setQuiz(newQuiz);
  };

  const deletePool = (index: number) => {
    const newPool = [...pool];
    newPool.splice(index, 1);
    setPool(newPool);
  };

  const deleteQuiz = (index: number) => {
    const newQuiz = [...quiz];
    newQuiz.splice(index, 1);
    setQuiz(newQuiz);
  };

  const addPool = () => {
    const newPool = [...pool];
    newPool.push({content: ''});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPool(newPool);
  };

  const addQuiz = () => {
    setShowHint(true);
    opacity.value = 1;
    const newQuiz = [...quiz];
    newQuiz.push({content: '', options: {isTrue: false}});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQuiz(newQuiz);
  };

  const addQuizView = () => {
    const newQuiz: QuizItem[] = [
      {content: '', options: {isTrue: true}},
      {content: '', options: {isTrue: false}},
    ];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQuiz(newQuiz);
  };

  const deletePoolView = () => {
    setPool([]);
  };

  const deleteQuizView = () => {
    setQuiz([]);
    setShowHint(true);
    opacity.value = 1;
  };

  const addPoolView = () => {
    const newPool: PoolItem[] = [{content: ''}, {content: ''}];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPool(newPool);
  };

  const setQuizTrue = (index: number) => {
    const newQuiz = [...quiz];
    // Set all quizzes to false
    newQuiz.forEach(quizItem => {
      quizItem.options.isTrue = false;
    });
    newQuiz[index].options.isTrue = !newQuiz[index].options.isTrue;
    setQuiz(newQuiz);
  };

  const poolView = () => {
    return (
      <Flex px={'spacing10'} py={'spacing16'} backgroundColor={'background1'}>
        {pool.map((item, index) => (
          <Flex
            key={index}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={'none'}
            flexDirection={'row'}>
            <Flex
              width={SCREEN_WIDTH - 70}
              height={50}
              px={'spacing6'}
              borderWidth={1}
              justifyContent={'center'}
              borderRadius={'rounded8'}
              borderColor={'background3'}>
              <TextInput
                placeholder={t('add_option') as string}
                value={item.content}
                maxLength={50}
                onChangeText={_ => {
                  handlePoolChange(index, _);
                }}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </Flex>
            {pool.length > 2 && (
              <TouchableIcon
                Component={MatComIcon}
                action={() => deletePool(index)}
                name="delete"
                size={24}
                color={theme.colors.textPrimary}
              />
            )}
          </Flex>
        ))}
        <Flex
          width={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          flexDirection={'row'}>
          <Flex
            width={110}
            overflow={'hidden'}
            backgroundColor={'background2'}
            borderRadius={'roundedFull'}>
            <Touchable disabled={pool.length === 4} onPress={addPool}>
              <Flex
                width={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
                flexDirection={'row'}
                p={'spacing6'}
                gap={'none'}>
                <Ionicon
                  name="add"
                  size={18}
                  color={theme.colors.textPrimary}
                />
                <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                  {t('add_option')}
                </Text>
              </Flex>
            </Touchable>
          </Flex>
          <TouchableOpacity onPress={deletePoolView}>
            <Flex
              width={100}
              alignItems={'center'}
              justifyContent={'center'}
              p={'spacing6'}
              gap={'none'}>
              <Text variant={'buttonLabelMicro'} color={'accentCritical'}>
                {t('delete_pool')}
              </Text>
            </Flex>
          </TouchableOpacity>
        </Flex>
      </Flex>
    );
  };

  const animateHint = () => {
    'worklet';
    opacity.value = withDelay(
      1000,
      withTiming(0, {duration: 1000}, () => {
        runOnJS(setShowHint)(false);
      }),
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const quizView = () => {
    return (
      <Flex
        overflow={'hidden'}
        px={'spacing10'}
        py={'spacing16'}
        backgroundColor={'background1'}>
        {quiz.map((item, index) => (
          <Flex
            key={index}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={'none'}
            flexDirection={'row'}>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <TouchableIcon
                Component={MatIcon}
                action={() => setQuizTrue(index)}
                name={
                  item.options.isTrue ? 'radio-button-on' : 'radio-button-off'
                }
                size={24}
                color={theme.colors.textPrimary}
              />
              <Flex
                width={SCREEN_WIDTH - 120}
                height={50}
                px={'spacing6'}
                justifyContent={'center'}
                borderWidth={1}
                borderRadius={'rounded8'}
                borderColor={'background3'}>
                <TextInput
                  placeholder={t('add_option') as string}
                  value={item.content}
                  maxLength={50}
                  onChangeText={_ => {
                    handleQuizChange(index, _);
                  }}
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </Flex>
            </Flex>
            {quiz.length > 2 && (
              <TouchableIcon
                Component={MatComIcon}
                action={() => deleteQuiz(index)}
                name="delete"
                size={24}
                color={theme.colors.textPrimary}
              />
            )}
          </Flex>
        ))}
        <Flex
          width={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          flexDirection={'row'}>
          <Flex
            width={110}
            overflow={'hidden'}
            backgroundColor={'background2'}
            borderRadius={'roundedFull'}>
            <Touchable disabled={quiz.length === 4} onPress={addQuiz}>
              <Flex
                width={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
                flexDirection={'row'}
                p={'spacing6'}
                gap={'none'}>
                <Ionicon
                  name="add"
                  size={18}
                  color={theme.colors.textPrimary}
                />
                <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                  {t('add_option')}
                </Text>
              </Flex>
            </Touchable>
          </Flex>
          <TouchableOpacity onPress={deleteQuizView}>
            <Flex
              width={100}
              alignItems={'center'}
              justifyContent={'center'}
              p={'spacing6'}
              gap={'none'}>
              <Text variant={'buttonLabelMicro'} color={'accentCritical'}>
                {t('delete_quiz')}
              </Text>
            </Flex>
          </TouchableOpacity>
        </Flex>
        {showHint && (
          <AnimatedFlex
            style={animatedStyle}
            position={'absolute'}
            left={20}
            top={70}
            onLayout={animateHint}
            backgroundColor={'accentAction'}
            borderRadius={'rounded8'}
            p={'spacing10'}>
            <Text variant={'buttonLabelMicro'} color={'white'}>
              {t('tap_to_choose_right_answer')}
            </Text>
          </AnimatedFlex>
        )}
      </Flex>
    );
  };

  const actions = [
    {
      title: t('create_quiz'),
      action: addQuizView,
    },
    {
      title: t('create_pool'),
      action: addPoolView,
    },
  ];

  const bottomView = () => {
    return (
      <Flex
        width={'100%'}
        backgroundColor={'background0'}
        py={'spacing4'}
        borderTopWidth={1}
        borderTopColor={'background3'}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        px={'spacing10'}
        position={'absolute'}
        bottom={0}>
        <Flex flexDirection={'row'}>
          {pool.length === 0 && quiz.length === 0 && image.length < 4 ? (
            <TouchableIcon
              Component={Ionicon}
              action={uploadImage}
              name="image-outline"
              size={24}
              color={theme.colors.textPrimary}
            />
          ) : (
            <TouchableIcon
              disable
              Component={Ionicon}
              action={uploadImage}
              name="image-outline"
              size={24}
              color={theme.colors.background3}
            />
          )}
          {image.length === 0 && quiz.length === 0 && pool.length === 0 ? (
            <ContextMenu
              dropdownMenuMode
              actions={actions}
              onPress={e => actions[e.nativeEvent.index]?.action()}>
              <TouchableIcon
                Component={MatComIcon}
                action={() => {}}
                name="poll"
                size={24}
                color={theme.colors.textPrimary}
              />
            </ContextMenu>
          ) : (
            <TouchableIcon
              Component={MatComIcon}
              action={() => {}}
              name="poll"
              disable
              size={24}
              color={theme.colors.background3}
            />
          )}
        </Flex>
        <CharProgress count={text.length} />
      </Flex>
    );
  };

  const imageView = () => {
    return (
      <Flex flexDirection={'row'}>
        <ScrollView contentContainerStyle={styles.scrollView} horizontal>
          {image.map((item, index) => (
            <Flex position={'relative'}>
              <FastImage
                key={index}
                source={{uri: item}}
                style={styles.image}
              />
              <TouchableIcon
                Component={MatComIcon}
                action={() => deleteImage(index)}
                name="close"
                size={24}
                color={'white'}
                style={styles.closeIcon}
              />
            </Flex>
          ))}
        </ScrollView>
      </Flex>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top', 'bottom']}>
      <Flex
        width={'100%'}
        height={45}
        borderBottomWidth={1}
        borderBottomColor={'background3'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        paddingHorizontal={'spacing10'}>
        <Flex position={'absolute'} left={10}>
          <Touchable onPress={onCancel}>
            <Text variant={'buttonLabelMedium'} color={'accentCritical'}>
              {t('cancel')}
            </Text>
          </Touchable>
        </Flex>
        <Flex flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'buttonLabelMedium'}
            color={'textPrimary'}
            numberOfLines={1}>
            Post
          </Text>
        </Flex>
        <Touchable onPress={onSubmit}>
          <Flex position={'absolute'} right={10}>
            <Text variant={'buttonLabelMedium'} color={'accentAction'}>
              {t('submit')}
            </Text>
          </Flex>
        </Touchable>
      </Flex>
      <Flex pt={'spacing14'} flex={1} backgroundColor={'background0'}>
        <Flex px={'spacing10'}>
          <TextInput
            value={text}
            onChangeText={setText}
            style={{
              fontSize: 18,
              color: theme.colors.textSecondary,
              lineHeight: 25,
            }}
            placeholder={t('quiz_desc') as string}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </Flex>
        {image.length > 0 && imageView()}
        {pool.length >= 2 && poolView()}
        {quiz.length >= 2 && quizView()}
      </Flex>
      {bottomView()}
      {loading && (
        <Flex
          flex={1}
          position={'absolute'}
          top={0}
          left={0}
          alignItems={'center'}
          justifyContent={'center'}
          right={0}
          bottom={0}
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Flex
            borderRadius={'rounded8'}
            alignItems={'center'}
            justifyContent={'center'}
            backgroundColor={'background2'}
            width={'75%'}
            py={'spacing36'}>
            <CircularActivityIndicator
              size={24}
              color={theme.colors.accentAction}
            />
            <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
              {t('posting_content')}...
            </Text>
          </Flex>
        </Flex>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollView: {
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;
