/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {Dimensions, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {AnimatedFlex, Flex} from '../../components/layout/Flex';
import useDarkMode from '../../hooks/theme/useDarkMode';
import {useTranslation} from 'react-i18next';
import {useResponsiveProp} from '@shopify/restyle';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from '../../components/core/Button/Button';
import {Text} from '../../components/core/Text/Text';
import {FadeInRight} from 'react-native-reanimated';
import {useAppSelector} from 'app/hooks/state/useAppSelector';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.WelcomeScreen
>;
const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.5;

const WelcomeScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const isDarkMode = useDarkMode();
  const {t} = useTranslation();
  const username = useAppSelector(state => state.user).username;

  const buttonSize = useResponsiveProp({
    phone: ButtonSize.Medium,
    tablet: ButtonSize.Large,
  });

  const onPressGetStarted = (): void => {
    navigation.navigate(OnBoardingScreens.SelectThematicScreen);
  };

  return (
    <Screen edges={['bottom', 'left', 'right', 'top']}>
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        flex={1}
        gap="spacing20"
        px="spacing20">
        <AnimatedFlex
          width={'100%'}
          entering={FadeInRight.delay(400).duration(1000).springify()}>
          <Text
            color="textPrimary"
            style={{width: '100%'}}
            fontWeight={'bold'}
            variant="headlineLarge">
            {t('welcome_message')}
          </Text>
        </AnimatedFlex>
        <AnimatedFlex
          width={'100%'}
          entering={FadeInRight.delay(600).duration(1000).springify()}>
          <Text
            color="textPrimary"
            fontWeight={'normal'}
            variant="subheadLarge">
            {t('welcome_message_detail')}
          </Text>
        </AnimatedFlex>
        <Flex position={'absolute'} mx={'spacing10'} bottom={15} width="100%">
          <Button
            size={buttonSize}
            style={{borderRadius: 5}}
            backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
            emphasis={
              isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary
            }
            onPress={onPressGetStarted}>
            {t('Continue')}
          </Button>
        </Flex>
      </Flex>
    </Screen>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderRadius: CIRCLE_SIZE / 2,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  mailIcon: {
    marginLeft: 8,
  },
  appleIcon: {
    height: 30,
    width: 24,
    marginLeft: 8,
  },
  facebookIcon: {
    height: 24,
    width: 24,
    marginLeft: 8,
  },
  googleIcon: {
    height: 24,
    width: 24,
    marginLeft: 8,
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
