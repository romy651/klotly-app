/**
 * @Project Summarised
 * @File HomeScreen1.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */

import React, {useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import {Screen} from '../../components/layout/Screen';
import {Text} from 'app/components/core/Text/Text';
import {getStatusBarHeight} from 'react-native-safearea-height';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Ionicon from 'react-native-vector-icons/Ionicons';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {isAndroid, isIos} from 'app/utils/PlatformUtils';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ActivityIndicator} from 'react-native';
import CategoryHeader from 'app/components/Header/CategoryHeader';
import {
  getCategoryInfo,
  getCategoryTopics,
  getIdBooks,
  getNewestBook,
} from 'app/utils/tools';
import i18next from 'i18next';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import _ from 'lodash';
import HomeComponent from 'app/components/HomeComponents';
import {ITopic} from 'app/domain/interface/IThematic';
import {CollectionInfo} from 'app/constants/OnBoarding';
import {BookInfo} from 'app/redux/book/bookReducer';

//type Props = NativeStackScreenProps<HomeStackParamList, HomeStackScreens.CategoryScreen>

const CategoryScreen: React.FC<any> = ({route, navigation}): JSX.Element => {
  const {category} = route.params;
  const [isReady, setIsReady] = useState<boolean>(false);
  const [topics, setTopics] = useState<CollectionInfo[]>([]);
  const [allBooks, setAllBooks] = useState<BookInfo[]>([]);
  const [newBooks, setNewBooks] = useState<BookInfo[]>([]);
  const [bestsellers, setBestSellers] = useState<BookInfo[]>([]);
  const [basicKnowledge, setBasicKnowledge] = useState<BookInfo[]>([]);
  const [popular, setPopular] = useState<BookInfo[]>([]);
  const user = useAppSelector(state => state.user);
  const categoryInfo = getCategoryInfo(category.id, i18next.language);
  const theme = useAppTheme();
  const statuBarHeight = getStatusBarHeight();
  const isDarkMode = useDarkMode();
  const backgroundColor = theme.colors.background0;
  const {t} = useTranslation();
  const topValue = getStatusBarHeight() + 250 - 120;

  console.log('THE DARK THEME: ', isDarkMode);

  let scrollOffsetY = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler(event => {
    scrollOffsetY.value = event.contentOffset.y;
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffsetY.value, [140, 200], [0, 1], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    });
    return {
      opacity,
      backgroundColor: 'transparent',
    };
  });

  const actionButton = useAnimatedStyle(() => {
    const top = interpolate(
      scrollOffsetY.value,
      [0, 165],
      [topValue, topValue - 110],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    const opacity = interpolate(scrollOffsetY.value, [0, 165], [1, 0], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    });

    return {
      top,
      borderRadius: 10,
      opacity,
    };
  });

  const actionTitle = _.includes(user.thematics, categoryInfo.title)
    ? t('unfollow')
    : t('follow');

  const onStart = (): void => {
    const books = getIdBooks(categoryInfo.book_ids, i18next.language);
    setAllBooks(books);
    setTopics(getCategoryTopics(categoryInfo.id, i18next.language));
    setNewBooks(getNewestBook(categoryInfo.book_ids, i18next.language, 10));
    setBestSellers(books.filter(b => b.market === 'bestseller'));
    setBasicKnowledge(books.filter(b => b.market === 'mainstream'));
    setPopular(books.filter(b => b.market === 'niche'));
    setIsReady(true);
  };

  return (
    <Screen edges={['bottom']}>
      <AnimatedFlex
        alignItems="center"
        flex={1}
        style={{
          backgroundColor,
        }}>
        <CategoryHeader
          animHeaderValue={scrollOffsetY}
          title={categoryInfo.title}
        />

        {isReady ? (
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginTop: isIos ? 100 : 50 + 20,
              paddingTop: 145,
              marginBottom: -32,
              width: SCREEN_WIDTH,
            }}
            onScroll={onScroll}>
            <Text
              color="textPrimary"
              fontWeight="bold"
              mt="spacing20"
              px="spacing10"
              variant="subheadLarge">
              {t('what_is_it_about')}
            </Text>
            <Text
              color="textPrimary"
              mt="spacing16"
              px="spacing10"
              variant="subheadSmall">
              {categoryInfo.subtitle}
            </Text>
            <HomeComponent
              list={topics as ITopic[]}
              title={t('topics')}
              type="Topics"
            />

            <HomeComponent
              list={newBooks}
              navigation={navigation}
              subTitle={`${t('the_newest_title')} ${category.title}`}
              title={t('newest') as string}
              type="Cover"
              onMore={(): void =>
                navigation.push('ListBookScreen', {
                  title: t('newest'),
                  type: 'book',
                  list: getNewestBook(categoryInfo.book_ids, i18next.language),
                })
              }
            />

            {bestsellers.length > 0 && (
              <HomeComponent
                list={bestsellers.slice(0, 10)}
                navigation={navigation}
                subTitle={`${t('the_bestselling_title')} ${category.title}`}
                title={t('bestsellers') as string}
                type="Cover"
                onMore={
                  bestsellers.length > 2
                    ? (): void =>
                        navigation.push('ListBookScreen', {
                          title: t('bestsellers'),
                          type: 'book',
                          list: bestsellers,
                        })
                    : undefined
                }
              />
            )}

            {topics.length > 0 && (
              <HomeComponent
                list={topics.slice(0, 10)}
                navigation={navigation}
                subTitle={`${t('the_bestselling_title')} ${category.title}`}
                title={t('collections') as string}
                type="Collection"
                onMore={
                  topics.length > 2
                    ? (): void =>
                        navigation.push('ListBookScreen', {
                          title: t('collections'),
                          type: 'book',
                          list: topics,
                        })
                    : undefined
                }
              />
            )}

            {basicKnowledge.length > 0 && (
              <HomeComponent
                list={basicKnowledge.slice(0, 10)}
                navigation={navigation}
                subTitle={`${t('get_started_with')} ${category.title}`}
                title={t('basic_knowledge') as string}
                type="Cover"
                onMore={
                  basicKnowledge.length > 2
                    ? (): void =>
                        navigation.push('ListBookScreen', {
                          title: t('basic_knowledge'),
                          type: 'book',
                          list: basicKnowledge,
                        })
                    : undefined
                }
              />
            )}

            {popular.length > 0 && (
              <HomeComponent
                list={popular.slice(0, 10)}
                navigation={navigation}
                subTitle={t('the_popular_title_in') as string}
                title={`${t('popular')} ${category.title}`}
                type="Cover"
                onMore={
                  popular.length > 2
                    ? (): void =>
                        navigation?.push('ListBookScreen', {
                          title: t('popular'),
                          type: 'book',
                          list: popular,
                        })
                    : undefined
                }
              />
            )}

            {allBooks.length > 0 && (
              <HomeComponent
                list={allBooks.slice(0, 10)}
                navigation={navigation}
                subTitle={t('key_idea_in_minute') as string}
                title={`${t('all_summaries')}`}
                type="Cover"
                onMore={
                  allBooks.length > 2
                    ? (): void =>
                        navigation?.push('ListBookScreen', {
                          title: t('all_summaries'),
                          type: 'book',
                          list: allBooks,
                        })
                    : undefined
                }
              />
            )}

            <Flex height={230} />
          </Animated.ScrollView>
        ) : (
          <ActivityIndicator
            color={theme.colors.textPrimary}
            size="large"
            style={{marginTop: 350}}
            onLayout={(): void => onStart()}
          />
        )}
        <Flex
          height={60 + statuBarHeight}
          position="absolute"
          top={0}
          width="100%">
          <AnimatedFlex
            height={60}
            justifyContent="center"
            paddingLeft="spacing48"
            position="absolute"
            style={titleStyle}
            top={0 + statuBarHeight}
            width="100%">
            <Text
              numberOfLines={1}
              fontWeight={'bold'}
              style={{
                color: theme.colors.textPrimary,
                width: SCREEN_WIDTH - 150,
              }}
              variant="bodyLarge">
              {categoryInfo.title}
            </Text>
          </AnimatedFlex>
          <Flex left={5} position="absolute" top={10 + statuBarHeight}>
            <TouchableIcon
              Component={Ionicon}
              action={(): void => navigation.goBack()}
              color={theme.colors.textPrimary}
              name={isAndroid ? 'arrow-back' : 'chevron-back'}
              size={28}
            />
          </Flex>
          <Flex position="absolute" right={10} top={10 + statuBarHeight}>
            <TouchableIcon
              Component={Ionicon}
              action={(): void => {
                console.log('pressed');
              }}
              color={theme.colors.textPrimary}
              name={isAndroid ? 'share-social' : 'share'}
              size={24}
            />
          </Flex>
        </Flex>
        <AnimatedFlex
          alignItems="center"
          backgroundColor="accentAction"
          flexDirection="row"
          height={40}
          justifyContent="center"
          overflow="hidden"
          position="absolute"
          style={actionButton}
          width={150}>
          <Touchable style={[styles.touchable]}>
            <>
              <Text style={{color: 'white'}} variant="bodySmall">
                {t(actionTitle)}
              </Text>
            </>
          </Touchable>
        </AnimatedFlex>
      </AnimatedFlex>
    </Screen>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
