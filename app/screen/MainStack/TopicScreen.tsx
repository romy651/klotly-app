/**
 * @Project Summarised
 * @File HomeScreen1.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ExploreStackParamList} from '../../routes/screens/Screens.types';
import {
  ExploreStackScreens,
  HomeStackScreens,
} from '../../routes/screens/Stack';
import * as React from 'react';
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
import {isAndroid} from 'app/utils/PlatformUtils';
import CollectionDetailHeader from 'app/components/Header/CollectionDetailHeader';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import Cover from 'app/components/cover';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';

type Props = NativeStackScreenProps<
  ExploreStackParamList,
  ExploreStackScreens.TopicScreen
>;

const TopicScreen: React.FC<Props> = ({route, navigation}): JSX.Element => {
  //const {collectionInfo} = route.params
  const theme = useAppTheme();
  const statuBarHeight = getStatusBarHeight();
  const isDarkMode = useDarkMode();
  const backgroundColor = theme.colors.background0;
  const iconColor = isDarkMode ? 'white' : 'rgba(0,0, 0, 0.7)';
  const {t} = useTranslation();
  const topValue = getStatusBarHeight() + 350 - 25;

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
      [0, 265],
      [topValue, topValue - 265],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    const width = interpolate(
      scrollOffsetY.value,
      [200, 265],
      [240, SCREEN_WIDTH],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    const borderRadius = interpolate(scrollOffsetY.value, [180, 205], [32, 0], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    });

    return {
      top,
      width,
      borderRadius,
    };
  });

  //console.log('ALL THE BOOKS: ', collectionInfo.books)

  return (
    <Screen edges={['bottom']}>
      <AnimatedFlex
        alignItems="center"
        flex={1}
        pb="spacing20"
        style={{
          backgroundColor,
        }}>
        <CollectionDetailHeader
          animHeaderValue={scrollOffsetY}
          image={collectionInfo.image}
          title={collectionInfo.title}
        />
        <Animated.ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: 50 + 30,
            paddingTop: 285,
            width: SCREEN_WIDTH,
          }}
          onScroll={onScroll}>
          <Text
            color="textPrimary"
            mt="spacing48"
            px="spacing10"
            variant="subheadSmall">
            {collectionInfo.subTitle}
          </Text>
          <Flex height={25} />
          {collectionInfo.books.map((book, idx) => (
            <Cover
              key={idx}
              author={book.author}
              duration={book.duration}
              flexDirection="column"
              image_url={book.image_url}
              subtitle={book.subtitle}
              title={book.title}
              onPress={(): void =>
                navigation?.push(HomeStackScreens.BookDetailScreen, {
                  bookInfo: book,
                })
              }
            />
          ))}
          <Flex height={300} />
        </Animated.ScrollView>
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
              style={{color: iconColor, width: SCREEN_WIDTH - 150}}
              variant="bodyLarge">
              {collectionInfo.title}
            </Text>
          </AnimatedFlex>
          <Flex left={5} position="absolute" top={10 + statuBarHeight}>
            <TouchableIcon
              Component={Ionicon}
              action={(): void => {
                console.log('pressed');
              }}
              color={iconColor}
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
              color={iconColor}
              name={isAndroid ? 'share-social' : 'share'}
              size={24}
            />
          </Flex>
        </Flex>
        <AnimatedFlex
          alignItems="center"
          backgroundColor="accentAction"
          flexDirection="row"
          height={50}
          justifyContent="center"
          overflow="hidden"
          position="absolute"
          style={actionButton}>
          <Touchable style={[styles.touchable]}>
            <>
              <Ionicon color="white" name="play-circle-sharp" size={32} />
              <Text ml="spacing10" style={{color: 'white'}} variant="bodySmall">
                {t('play_collection')}
              </Text>
            </>
          </Touchable>
        </AnimatedFlex>
      </AnimatedFlex>
    </Screen>
  );
};

export default TopicScreen;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
