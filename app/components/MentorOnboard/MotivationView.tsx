import {Appearance, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {AnimatedFlex, Flex} from '../layout/Flex';
import {theme} from 'app/themes/Theme';
import {Text} from '../core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import MatcomIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {generateText} from 'app/utils/tools';
import {store} from 'app/store';
import {CircularActivityIndicator} from '../ChatUI';

type Prop = {
  direction: 'left' | 'right';
  value: string;
  setValue: (val: string) => void;
};

const MotivationView = (prop: Prop) => {
  const dir = prop.direction;
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);
  const {value, setValue} = prop;
  const isdark = Appearance.getColorScheme() == 'dark';
  const [loading, setLoading] = useState<boolean>(false);
  const [preVal, setPreVal] = useState<string>('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        //bioTop.value = withTiming(-150)
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        //bioTop.value = withTiming(0)
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

  const _generateText = async () => {
    setLoading(true);
    const language = store.getState().application.appLanguage;
    const res = await generateText(
      t('writing_help_desc') as string,
      value,
      language,
    );
    setValue(res);
    setPreVal(value);
    setValue(res);
    setLoading(false);
  };

  const undo = () => {
    setValue(preVal);
    setPreVal('');
  };

  return (
    <>
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
            {t('motivate_pot_students')}
          </Text>
          <Text color={'textPrimary'} variant={'bodySmall'}>
            {t('motivate_pot_students_desc')}
          </Text>
          <Flex
            borderRadius={'rounded8'}
            minHeight={150}
            mt={'spacing14'}
            borderWidth={2}
            borderColor={'background3'}
            pt={'spacing6'}
            pb={'spacing8'}
            px={'spacing10'}>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={t('motivate_pot_students_ph') as string}
              style={{
                width: '100%',
                color: isdark ? 'white' : theme.colors.textPrimary,
              }}
              multiline
              numberOfLines={5}
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={500}
            />
          </Flex>
          {value.length > 10 && (
            <AnimatedFlex
              exiting={FadeOut.delay(10)}
              entering={FadeIn.delay(10)}>
              <Text
                mt={'spacing10'}
                variant={'buttonLabelSmall'}
                color={'textPrimary'}>
                {t('writing_help')}
              </Text>
              <Text color={'textPrimary'} variant={'bodySmall'}>
                {t('writing_help_desc')}
              </Text>
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Touchable onPress={_generateText}>
                  <Flex
                    mt={'spacing4'}
                    width={160}
                    justifyContent={'center'}
                    height={45}
                    borderWidth={1}
                    borderColor={'violetVibrant'}
                    borderRadius={'rounded8'}
                    gap={'spacing8'}
                    alignItems={'center'}
                    flexDirection={'row'}>
                    {loading ? (
                      <CircularActivityIndicator
                        color={theme.colors.accentActive}
                        size={18}
                      />
                    ) : (
                      <MatcomIcon
                        size={18}
                        color={isdark ? 'white' : theme.colors.textPrimary}
                        name="google-podcast"
                      />
                    )}
                    <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                      {t('create_message')}
                    </Text>
                  </Flex>
                </Touchable>
                {preVal !== '' && (
                  <Touchable onPress={undo}>
                    <Flex
                      mt={'spacing4'}
                      px={'spacing14'}
                      justifyContent={'center'}
                      height={45}
                      borderRadius={'rounded8'}
                      gap={'spacing8'}
                      backgroundColor={'background2'}
                      alignItems={'center'}
                      flexDirection={'row'}>
                      <MatcomIcon
                        size={18}
                        color={isdark ? 'white' : theme.colors.textPrimary}
                        name="undo-variant"
                      />
                      <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                        {t('undo')}
                      </Text>
                    </Flex>
                  </Touchable>
                )}
              </Flex>
            </AnimatedFlex>
          )}
        </Flex>
      </Animated.ScrollView>
    </>
  );
};

export default MotivationView;
