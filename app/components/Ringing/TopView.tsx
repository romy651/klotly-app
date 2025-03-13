import {
  CallingState,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {AnimatedFlex, Flex} from '../layout/Flex';
import {Alert, StyleSheet} from 'react-native';
import {TouchableOpacity as Touchable} from 'react-native';
import {Text} from '../core/Text/Text';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: any;
};

const TopView = ({navigation}: Props) => {
  const call = useCall();
  const {useCallCallingState, useCameraState, useCallSession} =
    useCallStateHooks();
  const session = useCallSession();
  const {camera} = useCameraState();
  const callingState = useCallCallingState();
  const bottom = useSharedValue<number>(0);
  //@ts-ignore
  const {t} = useTranslation();

  const bioInputStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom.value,
      opacity: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
    };
  });

  const hangupCallHandler = useCallback(async () => {
    try {
      Alert.alert(t('sure_end_call') as string, undefined, [
        {
          text: t('cancel') as string,
          style: 'cancel',
        },
        {
          text: t('yes') as string,
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error rejecting Call', error);
    }
  }, [navigation, t]);

  const flipCamera = useCallback(async () => {
    await camera?.flip();
  }, [camera]);

  return (
    <AnimatedFlex style={[styles.bottomView, bioInputStyle]}>
      <Touchable activeOpacity={0.8} onPress={flipCamera}>
        <Flex
          width={50}
          height={50}
          borderRadius={'roundedFull'}
          alignItems={'center'}
          justifyContent={'center'}
          style={{backgroundColor: '#3b3b3b'}}>
          <MatComIcon name={'camera-flip-outline'} size={28} color={'white'} />
        </Flex>
      </Touchable>

      <Flex alignItems={'center'} flexDirection={'row'}>
        <Elapsed startedAt={session?.started_at} />
      </Flex>

      <Touchable activeOpacity={0.8} onPress={hangupCallHandler}>
        <Flex
          width={50}
          height={50}
          borderRadius={'roundedFull'}
          alignItems={'center'}
          justifyContent={'center'}
          backgroundColor={'accentCritical'}>
          <MatComIcon name={'phone-hangup'} size={28} color={'white'} />
        </Flex>
      </Touchable>
    </AnimatedFlex>
  );
};

export default TopView;

const styles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 40, marginTop: 1},
  bottomView: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
    right: 0,
    paddingVertical: 13,
    flexDirection: 'row',
    zIndex: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: SCREEN_WIDTH - 160,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#404040',
    color: 'white',
    paddingHorizontal: 15,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

const Elapsed = ({
  startedAt,
}: {
  className?: string;
  startedAt: string | undefined;
}) => {
  const [elapsed, setElapsed] = useState<string>();
  const startedAtDate = useMemo(
    () => (startedAt ? new Date(startedAt).getTime() : Date.now()),
    [startedAt],
  );
  const theme = useAppTheme();
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAtDate) / 1000;
      const date = new Date(0);
      date.setSeconds(elapsedSeconds);
      const format = date.toISOString(); // '1970-01-01T00:00:35.000Z'
      const hours = format.substring(11, 13);
      const minutes = format.substring(14, 16);
      const seconds = format.substring(17, 19);
      const time = `${hours !== '00' ? hours + ':' : ''}${minutes}:${seconds}`;
      setElapsed(time);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAtDate]);

  return (
    <Flex
      style={{backgroundColor: '#3b3b3b'}}
      alignItems={'center'}
      p="spacing4"
      paddingHorizontal={'spacing10'}
      borderRadius={'roundedFull'}
      flexDirection={'row'}>
      <MatComIcon
        name="shield-check"
        size={18}
        color={theme.colors.accentSuccess}
      />
      <Text variant={'bodyMicro'} color={'white'}>
        {elapsed}
      </Text>
    </Flex>
  );
};
