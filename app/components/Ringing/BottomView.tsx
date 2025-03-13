import {useCallStateHooks} from '@stream-io/video-react-native-sdk';
import React, {useCallback} from 'react';
import {AnimatedFlex, Flex} from '../layout/Flex';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity as Touchable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from '../core/Text/Text';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Stack} from 'app/routes/screens/Stack';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  navigation: any;
  openBottomSheet: () => void;
  commentLength: number;
};

const BottomView = ({navigation, openBottomSheet, commentLength}: Props) => {
  const {useCameraState, useMicrophoneState} = useCallStateHooks();
  const microState = useMicrophoneState();
  const {camera, isMute} = useCameraState();
  const bottom = useSharedValue<number>(10);
  const inset = useSafeAreaInsets();
  const bioInputStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom.value,
      opacity: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
    };
  });

  const toggleCamera = useCallback(async () => {
    if (isMute) {
      await camera?.enable();
    } else {
      await camera?.disable();
    }
  }, [isMute, camera]);

  const toggleMicrophone = useCallback(async () => {
    if (microState.isMute) {
      await microState.microphone?.enable();
    } else {
      await microState.microphone?.disable();
    }
  }, [microState.isMute, microState.microphone]);

  return (
    <>
      <AnimatedFlex
        entering={FadeIn.delay(10)}
        exiting={FadeOut.delay(10)}
        style={[styles.bottomView, bioInputStyle, {bottom: inset.bottom}]}>
        <Touchable activeOpacity={0.8} onPress={toggleCamera}>
          <Flex
            width={50}
            height={50}
            borderRadius={'roundedFull'}
            alignItems={'center'}
            justifyContent={'center'}
            style={{backgroundColor: '#3b3b3b'}}>
            <Feather
              name={isMute ? 'video-off' : 'video'}
              size={24}
              color={'white'}
            />
          </Flex>
        </Touchable>
        <Touchable activeOpacity={0.8} onPress={toggleMicrophone}>
          <Flex
            width={50}
            height={50}
            borderRadius={'roundedFull'}
            alignItems={'center'}
            justifyContent={'center'}
            style={{
              backgroundColor: '#3b3b3b',
            }}>
            <MatComIcon
              name={microState.isMute ? 'microphone-off' : 'microphone'}
              size={28}
              color={'white'}
            />
          </Flex>
        </Touchable>
        <Touchable
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(Stack.GiftScreen, {userId: 'jfiew'})
          }>
          <Flex
            width={50}
            height={50}
            borderRadius={'roundedFull'}
            alignItems={'center'}
            justifyContent={'center'}
            style={{backgroundColor: '#3b3b3b'}}>
            <Text style={{fontSize: 18}} variant={'bodyLarge'}>
              🎁
            </Text>
          </Flex>
        </Touchable>
        <Touchable activeOpacity={0.8} onPress={openBottomSheet}>
          <View style={styles.iconView}>
            <MatComIcon
              name={'comment-text-multiple-outline'}
              size={26}
              color={'white'}
            />
            {commentLength > 0 && (
              <View style={styles.indicator}>
                <Text variant={'buttonLabelMicro'} color={'white'}>
                  {commentLength}
                </Text>
              </View>
            )}
          </View>
        </Touchable>
      </AnimatedFlex>
    </>
  );
};

export default BottomView;

const styles = StyleSheet.create({
  iconView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b3b3b',
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  image: {width: 40, height: 40, borderRadius: 40, marginTop: 1},
  bottomView: {
    position: 'absolute',
    width: '86%',
    paddingHorizontal: 30,
    right: '8%',
    paddingVertical: 15,
    flexDirection: 'row',
    zIndex: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
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
