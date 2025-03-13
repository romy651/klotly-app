import {Keyboard} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from '../layout/Flex';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {theme} from 'app/themes/Theme';
import {Text} from '../core/Text/Text';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

type Prop = {
  direction: 'left' | 'right';
  onNext: () => void;
  setValue: (val: string) => void;
  value: string;
};

const TopicView = (prop: Prop) => {
  const dir = prop.direction;
  const {t} = useTranslation();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);

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

  const bioInputStyle = useAnimatedStyle(() => {
    return {
      marginTop: bioTop.value,
      opacity: opacity.value,
      transform: [{translateX: translateX.value}],
    };
  });

  const appear = () => {
    translateX.value = withTiming(0);
    opacity.value = withTiming(1);
  };

  const disappear = () => {
    //translateX.value = withTiming(dir == 'right' ? -100 : 100)
    opacity.value = withTiming(0);
  };

  const setValue = (val: string) => {
    prop.setValue(val);
    disappear();
    setTimeout(() => {
      prop.onNext();
    }, 200);
  };

  return (
    <Animated.ScrollView
      bounces={false}
      style={bioInputStyle}
      onLayout={() => appear()}
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        marginTop: 25,
        paddingHorizontal: 15,
      }}>
      <Flex>
        <Text
          fontWeight={'bold'}
          color={'textPrimary'}
          variant={'subheadLarge'}>
          {t('subject_question')}
        </Text>
        <Touchable onPress={() => setValue('languages')}>
          <Flex
            mt={'spacing20'}
            flexDirection={'row'}
            borderWidth={1}
            p={'spacing14'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderColor={'background3'}
            borderRadius={'rounded8'}>
            <MatIcon
              name="language"
              color={theme.colors.textSecondary}
              size={18}
            />
            <Text
              style={{marginRight: 'auto'}}
              color={'textPrimary'}
              variant={'subheadSmall'}>
              {t('languages')}
            </Text>
            <Ionicon
              name="chevron-forward"
              color={theme.colors.textPrimary}
              size={18}
            />
          </Flex>
        </Touchable>
        <Touchable onPress={() => setValue('health_wellness')}>
          <Flex
            flexDirection={'row'}
            borderWidth={1}
            p={'spacing14'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderColor={'background3'}
            borderRadius={'rounded8'}>
            <Ionicon
              name="medical-outline"
              color={theme.colors.textSecondary}
              size={18}
            />
            <Text
              style={{marginRight: 'auto'}}
              color={'textPrimary'}
              variant={'subheadSmall'}>
              {t('health_wellness')}
            </Text>
            <Ionicon
              name="chevron-forward"
              color={theme.colors.textPrimary}
              size={18}
            />
          </Flex>
        </Touchable>
        <Touchable onPress={() => setValue('humanity')}>
          <Flex
            flexDirection={'row'}
            borderWidth={1}
            p={'spacing14'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderColor={'background3'}
            borderRadius={'rounded8'}>
            <Ionicon
              name="reader-outline"
              color={theme.colors.textSecondary}
              size={18}
            />
            <Text
              style={{marginRight: 'auto'}}
              color={'textPrimary'}
              variant={'subheadSmall'}>
              {t('humanity')}
            </Text>
            <Ionicon
              name="chevron-forward"
              color={theme.colors.textPrimary}
              size={18}
            />
          </Flex>
        </Touchable>
        <Touchable onPress={() => setValue('art')}>
          <Flex
            flexDirection={'row'}
            borderWidth={1}
            p={'spacing14'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderColor={'background3'}
            borderRadius={'rounded8'}>
            <Octicons
              name="paintbrush"
              color={theme.colors.textSecondary}
              size={18}
            />
            <Text
              style={{marginRight: 'auto'}}
              color={'textPrimary'}
              variant={'subheadSmall'}>
              {t('art')}
            </Text>
            <Ionicon
              name="chevron-forward"
              color={theme.colors.textPrimary}
              size={18}
            />
          </Flex>
        </Touchable>
      </Flex>
    </Animated.ScrollView>
  );
};

export default TopicView;
