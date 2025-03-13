import {Alert, Appearance, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from '../layout/Flex';
import {theme} from 'app/themes/Theme';
import {Text} from '../core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getlibraryImage} from 'app/utils/tools';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Video} from 'react-native-image-crop-picker';
import Video_ from 'react-native-video';
import Image from '../core/Image/Image';

type Prop = {
  direction: 'left' | 'right';
  value: string;
  setValue: (val: string) => void;
  value2: string;
  setValue2: (val: string) => void;
};

const VideoView = (prop: Prop) => {
  const dir = prop.direction;
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const bioTop = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(dir == 'right' ? 100 : -100);
  const opacity = useSharedValue<number>(0);
  const {value, setValue, value2, setValue2} = prop;
  const isdark = Appearance.getColorScheme() == 'dark';
  const [time, setTime] = useState<string>('');

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

  const addVideo = () => {
    getlibraryImage(
      uri => {
        const res = uri as Video;
        //@ts-ignore
        if (
          res.height > res.width ||
          res.duration < 30000 ||
          res.duration > 120000
        ) {
          Alert.alert(t('error'), t('video_landscape_err') as string);
          return;
        }
        //@ts-ignore
        setTime(convertTime(uri.duration));
        setValue(res.path);
        console.log('INFO ABOUT THE VIDEO', res);
      },
      () => {},
      'video',
    );
  };

  const addThumbnail = () => {
    getlibraryImage(
      uri => {
        setValue2(uri.path);
      },
      () => {},
      'photo',
    );
  };

  const convertTime = (millis: number) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = parseFloat(((millis % 60000) / 1000).toFixed(0));
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
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
            {t('video_introduction')}
          </Text>
          <Text color={'textPrimary'} variant={'bodySmall'}>
            {t('video_introduction_desc')}
          </Text>
          {value.length > 0 && (
            <Flex
              width={'100%'}
              height={200}
              borderRadius={'rounded8'}
              overflow={'hidden'}>
              <Video_
                style={{width: '100%', height: '100%'}}
                source={{uri: value}}
                paused
              />
              <Flex
                backgroundColor={'black'}
                px={'spacing14'}
                py={'spacing6'}
                borderRadius={'rounded4'}
                position={'absolute'}
                bottom={10}
                right={10}>
                <Text variant={'buttonLabelMicro'} color={'white'}>
                  {time}
                </Text>
              </Flex>
            </Flex>
          )}
          <Touchable onPress={addVideo}>
            <Flex
              mt={'spacing4'}
              width={160}
              justifyContent={'center'}
              height={45}
              borderWidth={1}
              borderColor={'textSecondary'}
              borderRadius={'rounded8'}
              gap={'spacing12'}
              alignItems={'center'}
              flexDirection={'row'}>
              <Feather
                size={18}
                color={isdark ? 'white' : theme.colors.textPrimary}
                name="upload"
              />
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {t('upload_video')}
              </Text>
            </Flex>
          </Touchable>
          <Text
            mt={'spacing36'}
            fontWeight={'bold'}
            color={'textPrimary'}
            variant={'subheadLarge'}>
            {t('add_thumbnail')}
          </Text>
          <Text color={'textPrimary'} variant={'bodySmall'}>
            {t('add_thumbnail_desc')}
          </Text>
          <Flex
            mt={'spacing6'}
            borderRadius={'rounded4'}
            gap={'spacing10'}
            px={'spacing10'}
            py={'spacing14'}
            flexDirection={'row'}
            backgroundColor={'accentActionSoft'}>
            <Feather
              name="info"
              color={isdark ? 'white' : theme.colors.textPrimary}
              size={22}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              variant={'bodyMicro'}
              color={'textPrimary'}>
              {t('add_thumbnail_warn')}
            </Text>
          </Flex>

          {value2.length > 0 && (
            <Flex
              width={'100%'}
              height={200}
              borderRadius={'rounded8'}
              overflow={'hidden'}>
              <Image
                style={{width: '100%', height: '100%'}}
                source={{uri: value2}}
              />
            </Flex>
          )}

          <Touchable onPress={addThumbnail}>
            <Flex
              mt={'spacing4'}
              width={200}
              justifyContent={'center'}
              height={45}
              borderWidth={1}
              borderColor={'textSecondary'}
              borderRadius={'rounded8'}
              gap={'spacing12'}
              alignItems={'center'}
              flexDirection={'row'}>
              <Feather
                size={18}
                color={isdark ? 'white' : theme.colors.textPrimary}
                name="upload"
              />
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {t('upload_thumbnail')}
              </Text>
            </Flex>
          </Touchable>

          <Text
            mt={'spacing36'}
            fontWeight={'bold'}
            color={'textPrimary'}
            variant={'subheadSmall'}>
            {t('video_requirement')}
          </Text>
          <Text color={'textPrimary'} variant={'bodySmall'}>
            {t('video_requirement_desc')}
          </Text>
          <Flex
            mt={'spacing10'}
            gap={'spacing6'}
            flexDirection={'row'}
            alignItems={'center'}>
            <Ionicon
              name="checkmark-sharp"
              color={theme.colors.accentSuccess}
              size={22}
            />
            <Text
              fontWeight={'bold'}
              color={'textPrimary'}
              variant={'bodySmall'}>
              {t('do')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req1')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req2')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req3')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req4')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req5')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req6')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_req7')}
            </Text>
          </Flex>

          <Flex
            mt={'spacing10'}
            gap={'spacing6'}
            flexDirection={'row'}
            alignItems={'center'}>
            <Ionicon
              name="close-sharp"
              color={theme.colors.accentCritical}
              size={22}
            />
            <Text
              fontWeight={'bold'}
              color={'textPrimary'}
              variant={'bodySmall'}>
              {t('dont')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_dont1')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_dont2')}
            </Text>
          </Flex>
          <Flex gap={'spacing6'} flexDirection={'row'}>
            <Entypo
              name="dot-single"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text
              style={{width: SCREEN_WIDTH - 70}}
              mt={'spacing2'}
              color={'textPrimary'}
              variant={'bodyMicro'}>
              {t('vid_dont3')}
            </Text>
          </Flex>
        </Flex>
      </Animated.ScrollView>
    </>
  );
};

export default VideoView;
