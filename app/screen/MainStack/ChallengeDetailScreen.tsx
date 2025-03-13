/**
 * @Project Summarised
 * @File HomeScreen.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../routes/screens/Screens.types';
import {HomeStackScreens} from '../../routes/screens/Stack';
import {Screen} from '../../components/layout/Screen';
import {AnimatedFlex, Flex} from '../../components/layout/Flex';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import DynamicHeader from 'app/components/Header/DynamicHeader';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import {ScrollView} from 'react-native-gesture-handler';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import Image, {Source} from 'react-native-fast-image';
import {StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  HomeStackScreens.ChallengeDetailScreen
>;

const ChallengeDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const {t} = useTranslation();
  const {challengeInfo} = route.params;
  const theme = useAppTheme();
  let scrollOffsetY = useSharedValue<number>(0);
  const isDarkMode = useDarkMode();

  const onScroll = useAnimatedScrollHandler(event => {
    scrollOffsetY.value = event.contentOffset.y;
  });

  return (
    <>
      <Screen edges={['bottom']}>
        <AnimatedFlex backgroundColor="background0" flex={1} pb="spacing20">
          <DynamicHeader
            withReturn
            animHeaderValue={scrollOffsetY}
            title={challengeInfo.title}
            onGoBack={navigation.goBack}
          />
          <Animated.ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginTop: -15,
              paddingVertical: 15,
            }}
            onScroll={onScroll}>
            <AnimatedFlex left={10}>
              <Text
                color="textPrimary"
                fontWeight="bold"
                style={{color: isDarkMode ? 'white' : '#042330'}}
                variant="headlineMedium">
                {challengeInfo.title}
              </Text>
              <Text
                color="accentAction"
                fontWeight="bold"
                style={{marginTop: -5}}
                variant="headlineSmall">
                {challengeInfo.subtitle}
              </Text>
            </AnimatedFlex>
            <Text
              color="accentAction"
              fontWeight="bold"
              ml="spacing10"
              mt="spacing36"
              style={{color: isDarkMode ? 'white' : '#042330'}}
              variant="bodyLarge">
              {t('about_challenge')}
            </Text>
            <Text
              color="accentAction"
              ml="spacing10"
              mt="spacing10"
              style={{color: isDarkMode ? 'white' : '#042330'}}
              variant="bodySmall">
              {challengeInfo.about}
            </Text>
            <Text
              color="accentAction"
              fontWeight="bold"
              ml="spacing10"
              mt="spacing36"
              style={{color: isDarkMode ? 'white' : '#042330'}}
              variant="bodyLarge">
              {t('timeline')}
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingLeft: 10,
                marginTop: -25,
                paddingRight: 15,
              }}
              showsHorizontalScrollIndicator={false}>
              {challengeInfo.books.map((book, idx) => (
                <Flex key={idx}>
                  <Text
                    color="accentAction"
                    fontWeight="bold"
                    mt="spacing36"
                    style={{color: isDarkMode ? 'white' : '#042330'}}
                    variant="bodyLarge">
                    {`${t('day')} ${idx + 1}`}
                  </Text>
                  <Flex alignItems="center" flexDirection="row">
                    <Flex
                      backgroundColor="background3"
                      borderRadius="rounded16"
                      height={20}
                      width={20}
                    />
                    {idx < challengeInfo.books.length - 1 && (
                      <Flex
                        backgroundColor="background3"
                        height={4}
                        style={{marginLeft: -18}}
                        width={150}
                      />
                    )}
                  </Flex>
                  <Touchable
                    style={styles.image}
                    onPress={(): void =>
                      navigation?.push(HomeStackScreens.BookDetailScreen, {
                        bookInfo: book,
                      })
                    }>
                    <Image
                      source={book.image_url as Source}
                      style={styles.image}
                    />
                  </Touchable>
                </Flex>
              ))}
            </ScrollView>
            <Text
              color="accentAction"
              fontWeight="bold"
              mb="spacing10"
              ml="spacing10"
              mt="spacing36"
              style={{color: isDarkMode ? 'white' : '#042330'}}
              variant="bodyLarge">
              {t('what_will_you_learn')}
            </Text>
            {challengeInfo.advantages.map((value, idx) => (
              <Flex
                key={idx}
                alignItems="center"
                flexDirection="row"
                ml="spacing10">
                <Entypo
                  color={theme.colors.accentAction}
                  name="check"
                  size={24}
                />
                <Text
                  color="accentAction"
                  mt="spacing10"
                  style={{
                    color: isDarkMode ? 'white' : '#042330',
                    width: SCREEN_WIDTH - 60,
                  }}
                  variant="bodySmall">
                  {value}
                </Text>
              </Flex>
            ))}
            <Flex height={80} />
          </Animated.ScrollView>
        </AnimatedFlex>
      </Screen>
    </>
  );
};

export default ChallengeDetailScreen;

const styles = StyleSheet.create({
  image: {
    borderRadius: 5,
    height: 130 * 1.4518,
    width: 130,
  },
});
