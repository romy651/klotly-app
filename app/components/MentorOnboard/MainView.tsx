import {Keyboard} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Text} from '../core/Text/Text';
import {AnimatedFlex, Flex} from '../layout/Flex';
import {theme} from 'app/themes/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Prop = {
  direction: 'left' | 'right';
};

const MainView = (prop: Prop) => {
  const dir = prop.direction;
  //@ts-ignore
  const {t} = useTranslation();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);
  const inset = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        bioTop.value = withTiming(-150);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        bioTop.value = withTiming(0);
      },
    );

    return () => {
      disappear();
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const disappear = () => {
    translateX.value = withTiming(dir == 'right' ? -100 : 100);
    opacity.value = withTiming(0);
  };

  const bioInputStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateX: translateX.value}],
    };
  });

  const appear = () => {
    translateX.value = withTiming(0);
    opacity.value = withTiming(1);
  };

  return (
    <Animated.ScrollView
      style={bioInputStyle}
      bounces={false}
      onLayout={() => appear()}
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        marginTop: -inset.top,
        paddingTop: 150,
      }}>
      <Flex px={'spacing18'}>
        <Flex
          alignItems={'center'}
          borderRadius={'roundedFull'}
          justifyContent={'center'}
          width={50}
          height={50}
          backgroundColor={'accentActiveSoft'}>
          <Ionicon
            name="checkmark"
            color={theme.colors.accentActive}
            size={30}
          />
        </Flex>
        <Text mt={'spacing10'} variant={'headlineSmall'} color={'textPrimary'}>
          {t('you_almost_there')}
        </Text>
        <Text variant={'buttonLabelSmall'} color={'textSecondary'}>
          {t('complete_profile_desc')}
        </Text>
        <AnimatedFlex
          entering={FadeInDown.delay(200)}
          mt={'spacing14'}
          gap={'spacing18'}
          alignItems={'center'}
          flexDirection={'row'}>
          <Flex
            alignItems={'center'}
            borderRadius={'roundedFull'}
            justifyContent={'center'}
            width={40}
            height={40}
            backgroundColor={'accentActiveSoft'}>
            <Ionicon
              name="wallet-outline"
              color={theme.colors.accentActive}
              size={20}
            />
          </Flex>
          <Flex gap={'spacing6'}>
            <Text variant={'subheadSmall'} color={'textPrimary'}>
              {t('set_hour_rate')}
            </Text>
            <Text
              style={{width: SCREEN_WIDTH - 94}}
              variant={'buttonLabelMicro'}
              color={'textSecondary'}>
              {t('set_hour_rate_desc')}
            </Text>
          </Flex>
        </AnimatedFlex>
        <AnimatedFlex
          entering={FadeInDown.delay(400)}
          mt={'spacing14'}
          gap={'spacing18'}
          alignItems={'center'}
          flexDirection={'row'}>
          <Flex
            alignItems={'center'}
            borderRadius={'roundedFull'}
            justifyContent={'center'}
            width={40}
            height={40}
            backgroundColor={'accentActiveSoft'}>
            <MatComIcon
              name="timer-outline"
              color={theme.colors.accentActive}
              size={20}
            />
          </Flex>
          <Flex gap={'spacing6'}>
            <Text variant={'subheadSmall'} color={'textPrimary'}>
              {t('teach_anywhere')}
            </Text>
            <Text
              style={{width: SCREEN_WIDTH - 94}}
              variant={'buttonLabelMicro'}
              color={'textSecondary'}>
              {t('teach_anywhere_desc')}
            </Text>
          </Flex>
        </AnimatedFlex>
        <AnimatedFlex
          entering={FadeInDown.delay(600)}
          mt={'spacing14'}
          gap={'spacing18'}
          alignItems={'center'}
          flexDirection={'row'}>
          <Flex
            alignItems={'center'}
            borderRadius={'roundedFull'}
            justifyContent={'center'}
            width={40}
            height={40}
            backgroundColor={'accentActiveSoft'}>
            <FontAwesome
              name="line-chart"
              color={theme.colors.accentActive}
              size={15}
            />
          </Flex>
          <Flex gap={'spacing6'}>
            <Text variant={'subheadSmall'} color={'textPrimary'}>
              {t('grow_prof')}
            </Text>
            <Text
              style={{width: SCREEN_WIDTH - 94}}
              variant={'buttonLabelMicro'}
              color={'textSecondary'}>
              {t('grow_prof_desc')}
            </Text>
          </Flex>
        </AnimatedFlex>
      </Flex>
    </Animated.ScrollView>
  );
};

export default MainView;
