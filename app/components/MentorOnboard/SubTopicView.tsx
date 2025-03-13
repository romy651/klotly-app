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
import {Text} from '../core/Text/Text';
import CheckBox from '../Radio/CheckBox';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AVAILABLE_TOPICS} from 'app/constants';

type Prop = {
  direction: 'left' | 'right';
  value: string[];
  setValue: (val: string[]) => void;
  topic: string;
};

const SubTopic = (prop: Prop) => {
  const dir = prop.direction;
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);
  //@ts-ignore
  const subTopics: string[] = AVAILABLE_TOPICS[prop.topic];
  const defaultValue = (prop.value || [])
    .map(val => subTopics.findIndex(el => el === val))
    .filter(l => l > -1);

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
      //disappear()
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

  const setValue = (val: number[]) => {
    const res = val.map(elt => subTopics[elt]) as string[];
    console.log('the selected values are: ', val);
    prop.setValue(res);
  };

  return (
    <Animated.ScrollView
      bounces
      style={bioInputStyle}
      onLayout={() => appear()}
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        marginTop: 25,
        paddingHorizontal: 15,
        paddingBottom: inset.bottom + 200,
      }}>
      <Flex>
        <Text
          fontWeight={'bold'}
          color={'textPrimary'}
          variant={'subheadLarge'}>
          {t('subject_question_desc')}
        </Text>
        <CheckBox
          labels={subTopics.map(elt => t(elt))}
          values={subTopics.map((_, key) => key)}
          onChange={setValue}
          defaultSelected={defaultValue}
        />
      </Flex>
    </Animated.ScrollView>
  );
};

export default SubTopic;
