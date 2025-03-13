import {Call, StreamCall, useCalls} from '@stream-io/video-react-native-sdk';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {RingingCallContent} from '../Ringing/RingingCallContent';
import {Screen} from '../layout/Screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getUser} from 'app/actions/chatAction';
import {UserInfo} from 'app/redux/user/userReducer';

export default function CallProvider({children}: PropsWithChildren) {
  const calls = useCalls();
  const me = useAppSelector(state => state.user);
  const call = calls[0];
  const [otherUser, setOtherUser] = useState<UserInfo[]>([]);

  useEffect(() => {
    (async () => {
      if (!call) {
        return;
      }
      console.log(
        'there is an incoming call: ',
        call.state.members.map(e => e.user_id),
      );
      const t = call.state.members.find(e => e.user_id !== me.id.toString());
      console.log('other user: ', call.state.members);
      const others = call.state.members
        .filter(e => e.user_id !== me.id.toString())
        .map(_ => _.user_id);
      const temp = await Promise.all(others.map(_ => getUser(_)));
      setOtherUser(temp);
      if (call.state.callingState === 'ringing') {
        console.log('It should be ringing now: ', call.isCreatedByMe);
      }
    })();
  }, [call]);

  return (
    <>
      {children}
      {call && !call.isCreatedByMe && (
        <Screen
          top={0}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          position={'absolute'}
          edges={['top']}>
          <StreamCall call={call as Call}>
            <RingingCallContent others={otherUser} />
          </StreamCall>
        </Screen>
      )}
    </>
  );
}

/*
       <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    detached
                    enableContentPanningGesture={false}
                    enablePanDownToClose
                    snapPoints={snapPoints}
                    handleComponent={null}
                    backgroundStyle={{backgroundColor: theme.colors.background3}}
                    style={{...styles.bsheet}}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}>
                    <BottomSheetView style={styles.contentContainer}>
                        <ImageBackground
                            blurRadius={30}
                            style={styles.fullScreen}
                            source={{uri: caller?.avatar}}>
                            <Flex style={styles.blackCover} />
                            <Text
                                textAlign={'center'}
                                mt={'spacing24'}
                                variant={'bodyLarge'}
                                fontWeight={'bold'}
                                color={'accentCritical'}>
                                {t('incoming_call')}
                            </Text>
                            <Flex
                                height={SCREEN_HEIGHT * 0.7 - 100}
                                pt={'spacing10'}
                                width={'100%'}>
                                <Flex
                                    mt={'spacing36'}
                                    flexDirection={'row'}
                                    justifyContent={'center'}>
                                    <FastImage
                                        style={styles.image}
                                        source={{uri: caller?.avatar}}
                                    />
                                </Flex>
                                <Text
                                    textAlign={'center'}
                                    variant={'buttonLabelLarge'}
                                    fontWeight={'bold'}
                                    color={'white'}>
                                    {caller?.username}
                                </Text>
                                {caller && (
                                    <Text
                                        textAlign={'center'}
                                        variant={'bodySmall'}
                                        style={{marginTop: -10}}
                                        color={'white'}>
                                        {caller.age},{' '}
                                        <CountryFlag
                                            isoCode={caller.country}
                                            size={12}
                                            style={{marginTop: 2, borderRadius: 2}}
                                        />{' '}
                                        {caller.country}
                                    </Text>
                                )}
                                <Flex
                                    style={{marginTop: 'auto'}}
                                    paddingHorizontal={'spacing36'}
                                    justifyContent={'space-around'}
                                    flexDirection={'row'}
                                    alignItems={'center'}>
                                    <Touchable activeOpacity={0.7} onPress={rejectCallHandler}>
                                        <Flex
                                            width={70}
                                            height={70}
                                            borderRadius={'roundedFull'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            backgroundColor={'accentCritical'}>
                                            <MatComIcon
                                                name={'phone-hangup'}
                                                size={34}
                                                color={'white'}
                                            />
                                        </Flex>
                                    </Touchable>
                                    <AnimatedButton onPress={() => {}} />
                                    <Touchable activeOpacity={0.7} onPress={() => {}}>
                                        <Flex
                                            width={70}
                                            height={70}
                                            borderRadius={'roundedFull'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            backgroundColor={'userThemeViolet'}>
                                            <Ionicon
                                                name={'chatbubble-ellipses'}
                                                size={32}
                                                color={'white'}
                                            />
                                        </Flex>
                                    </Touchable>
                                </Flex>
                            </Flex>
                        </ImageBackground>
                    </BottomSheetView>
                </BottomSheet>
*/
