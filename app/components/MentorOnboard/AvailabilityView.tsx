import {Appearance, FlatList, Keyboard} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {theme} from 'app/themes/Theme';
import {Text} from '../core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {createTimeSlots} from 'app/utils/tools';
import {Flex} from '../layout/Flex';

type Prop = {
  direction: 'left' | 'right';
  value: Record<string, string[]>;
  setValue: (val: Record<string, string[]>) => void;
};

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const AvailabilityView = (prop: Prop) => {
  const dir = prop.direction;
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);
  const {value, setValue} = prop;
  const isdark = Appearance.getColorScheme() == 'dark';
  const slots = createTimeSlots('00:00', '23:30');

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

  const additem = (key: string, val: string) => {
    const res = {...value};
    if (res[key] && res[key].includes(val)) {
      const temp = res[key].filter(v => v !== val);
      res[key] = temp;
      //setPreVal(res)
    } else {
      res[key] = [...(res[key] || []), val];
      //setPreVal(res)
    }
    setValue(res);
  };

  const renderItem = (item: string, index: number, day: string) => {
    return (
      <Touchable onPressIn={() => additem(day, item)}>
        <Flex
          height={30}
          width={(SCREEN_WIDTH - 60) / 5}
          backgroundColor={
            ((value[day] as string[]) || []).includes(item)
              ? 'accentActive'
              : 'background2'
          }
          mx={'spacing4'}
          borderRadius={'rounded4'}
          alignItems={'center'}
          justifyContent={'center'}
          my={'spacing4'}>
          <Text
            color={
              ((value[day] as string[]) || []).includes(item)
                ? 'white'
                : 'textSecondary'
            }
            variant={'buttonLabelMicro'}>
            {item}
          </Text>
        </Flex>
      </Touchable>
    );
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
      <Flex gap={'spacing10'}>
        <Text
          fontWeight={'bold'}
          color={'textPrimary'}
          variant={'subheadLarge'}>
          {t('set_availability')}
        </Text>
        <Text mb={'spacing10'} color={'textPrimary'} variant={'bodySmall'}>
          {t('set_availability_desc')}
        </Text>
        {days.map(day => (
          <Flex>
            <Touchable>
              <Flex
                width={120}
                gap={'spacing6'}
                backgroundColor={'background3'}
                px={'spacing10'}
                py={'spacing4'}
                borderRadius={'rounded8'}
                flexDirection={'row'}
                mr={'spacing10'}
                mt={'spacing20'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Ionicon
                  name={
                    value.hasOwnProperty(day) ? 'checkbox' : 'square-outline'
                  }
                  color={isdark ? 'white' : theme.colors.textSecondary}
                  size={18}
                />
                <Text variant={'buttonLabelSmall'} color={'textSecondary'}>
                  {t(day)}
                </Text>
              </Flex>
            </Touchable>
            <FlatList
              bounces={false}
              renderItem={({item, index}) => renderItem(item, index, day)}
              contentContainerStyle={{marginLeft: -5}}
              numColumns={5}
              data={slots}
              keyExtractor={i => i}
            />
          </Flex>
        ))}
      </Flex>
    </Animated.ScrollView>
  );
};

export default AvailabilityView;
