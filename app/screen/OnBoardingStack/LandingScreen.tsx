/**
 * @Project Summarised
 * @File LandingScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import React, {useRef, useState} from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {
  Appearance,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Image from '../../components/core/Image/Image';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.LandingScreen
>;

const {width} = Dimensions.get('window');

const LandingScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef(null);

  const onboardingData = [
    {
      id: '1',
      image: require('../../assets/images/onboard1.jpg'),
      title: 'Find the right tutor for you.',
      description:
        'With over 40,000 tutors and 1M+ learners, this is a place for you.',
    },
    {
      id: '2',
      image: require('../../assets/images/im1.jpg'),
      title: 'Get better every lesson.',
      description: 'Browse through our collection',
    },
    {
      id: '3',
      title: 'Practice makes it possible',
      description:
        'Now is the best time to get started. Ready to learn something new?',
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <Flex style={styles.slide} key={index}>
        {item.image && (
          <Image
            resizeMode="contain"
            source={item.image}
            style={styles.image}
          />
        )}
        <Text
          variant={'headlineSmall'}
          textAlign={'center'}
          mt={'spacing10'}
          fontWeight={'bold'}
          color={'textPrimary'}>
          {item.title}
        </Text>
        <Text variant={'bodyMicro'} textAlign={'center'} color={'textPrimary'}>
          {item.description}
        </Text>
      </Flex>
    );
  };

  const renderDotIndicator = () => {
    return onboardingData.map((_, index) => (
      <Flex
        key={index}
        width={10}
        height={10}
        backgroundColor={
          index === currentIndex ? 'textPrimary' : 'background60'
        }
      />
    ));
  };

  const getStarted = () => {
    navigation.navigate(OnBoardingScreens.ChooseTopicScreen);
  };

  const onSignIn = () => {
    navigation.navigate(OnBoardingScreens.HomeSignInScreen);
  };

  return (
    <Screen backgroundColor={'accentActiveSoft'} edges={['bottom', 'top']}>
      <Flex
        position={'absolute'}
        top={insets.top}
        shrink
        height="100%"
        alignItems={'center'}
        width="100%">
        {isDarkMode ? (
          <Image
            source={require('../../assets/images/textlogo_white.png')}
            style={styles.logo}
          />
        ) : (
          <Image
            source={require('../../assets/images/textlogo.png')}
            style={styles.logo}
          />
        )}
      </Flex>
      <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        <Flex
          alignItems={'center'}
          gap={'spacing20'}
          position={'absolute'}
          bottom={10}>
          <Flex
            gap={'spacing10'}
            right={0}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}>
            {renderDotIndicator()}
          </Flex>
          <Touchable onPress={getStarted}>
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              width={250}
              height={40}
              gap={'spacing8'}
              flexDirection={'row'}
              borderRadius={'rounded4'}
              backgroundColor={'textPrimary'}>
              <Text variant={'buttonLabelSmall'} color={'background0'}>
                {t('get_started')}
              </Text>
              <Feather
                name="arrow-right"
                color={theme.colors.background0}
                size={18}
              />
            </Flex>
          </Touchable>
          <Text
            onPress={onSignIn}
            variant={'buttonLabelSmall'}
            textDecorationLine={'underline'}
            color={'textPrimary'}>
            {t('sign_in')}
          </Text>
        </Flex>
      </Flex>
    </Screen>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 50,
  },
  image: {
    width: 300,
    height: 300 * 0.73,
    borderRadius: 10,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default LandingScreen;
