import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {useTranslation} from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import CountryFlag from 'react-native-country-flag';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {CometChat} from '@cometchat/chat-sdk-react-native';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {
  CallingPackage,
  CallUIEvents,
  CometChatOngoingCall,
  CometChatSoundManager,
  CometChatUIEventHandler,
} from 'app/components/calls';
import {
  MessageCategoryConstants,
  MessageTypeConstants,
} from 'app/components/calls/shared/constants/UIKitConstants';

type Props = NativeStackScreenProps<AppStackParamList, Stack.OutGoingCall>;

export interface CometChatOutgoingCallInterface {}

const CometChatCalls = CallingPackage.CometChatCalls;

const OutGoingCall: React.FC<Props & CometChatOutgoingCallInterface> = ({
  navigation,
  route,
}) => {
  const [isCallConnected, setCallConnected] = useState(false);
  const [call, setCall] = useState<CometChat.Call>();
  const {t} = useTranslation();
  const ongoingCall = useRef<CometChat.Call | CometChat.CustomMessage | null>(
    null,
  );
  const callSessionId = useRef<string | null>(null);
  const callListener = useRef(null);
  const callSettings = useRef(null);
  const isCallEnded = useRef<null | boolean>(null);
  const me = useAppSelector(state => state.user);
  const user = route.params.user;
  const snapPoints = useMemo(() => ['70%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useAppTheme();

  function checkIfDefualtCall(call: CometChat.BaseMessage): Boolean {
    return call.getCategory() == MessageCategoryConstants.call;
  }

  const endCallIfRequired = useCallback(() => {
    if (call) {
      if (checkIfDefualtCall(call)) {
        CometChat.endCall((call as CometChat.Call).getSessionId())
          .then(() => {
            (call as CometChat.Call).setStatus('ended');
            !isCallEnded.current &&
              CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccCallEnded, {
                call,
              });
            isCallEnded.current = true;
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    }
  }, [call]);

  useEffect(() => {
    if (call) {
      if (
        call.status == 'ongoing' ||
        (call.getCategory() ==
          (CometChat.CATEGORY_CUSTOM as CometChat.MessageCategory) &&
          call.getType() == MessageTypeConstants.meeting)
      ) {
        ongoingCall.current = call;
        if (call.getType() == MessageTypeConstants.meeting) {
          // @ts-ignore
          callSessionId.current = (
            call as CometChat.CustomMessage
          ).getCustomData().sessionId;
        }
        if (call.getCategory() == MessageCategoryConstants.call) {
          // @ts-ignore
          callSessionId.current = call.sessionId;
        }
        setCallConnected(true);
      }
      console.log('now we prepare the call objects');
      const callListener = new CometChatCalls.OngoingCallListener({
        onCallEndedMessageReceived: (call: any) => {
          console.log('THE CALL IS ENDED:', call);
          setCall(undefined);
          ongoingCall.current = null;
          callSessionId.current = null;
          setCallConnected(false);
          navigation.goBack();
        },
        onError: (error: any) => {
          console.log('There is an error durring the Error :', error);
        },
      });
      callSettings.current = new CometChatCalls.CallSettingsBuilder()
        .setCallEventListener(callListener)
        .setIsAudioOnlyCall(false)
        .enableDefaultLayout(true);
    }
  }, [call]);

  useEffect(() => {
    startCall();
    CometChat.addCallListener(
      '@' + me.id.toString(),
      new CometChat.CallListener({
        onOutgoingCallAccepted: (call: any) => {
          CometChatSoundManager.pause();
          setCall(call);
          ongoingCall.current = call;
          console.log('the call is accepted', call.sessionId);
          callSessionId.current = call.sessionId;
          setCallConnected(true);
        },
        onOutgoingCallRejected: (call: any) => {
          console.log('THE CALL IS REJECTED:');
          CometChatSoundManager.pause();
          setCall(undefined);
          ongoingCall.current = null;
          callSessionId.current = null;
          setCallConnected(false);
          navigation.goBack();
        },
        onCallEndedMessageReceived: (call: any) => {
          console.log('THE CALL IS ENDED:');
          CometChatSoundManager.pause();
          setCall(undefined);
          ongoingCall.current = null;
          callSessionId.current = null;
          setCallConnected(false);
          navigation.goBack();
        },
      }),
    );
    CometChatUIEventHandler.addCallListener('@' + me.id.toString(), {
      ccCallFailed: () => {
        setCallConnected(false);
      },
    });
    return CometChat.removeCallListener(me.id.toString());
  }, []);

  const startCall = () => {
    //CometChatSoundManager.play('outgoingCall')
    var call: CometChat.Call = new CometChat.Call(
      user?.id.toString(),
      CometChat.CALL_TYPE.VIDEO,
      CometChat.RECEIVER_TYPE.USER,
    );

    CometChat.initiateCall(call).then(
      (outGoingCall: CometChat.Call) => {
        setCall(outGoingCall);
        console.log('Call initiated successfully:', user?.id.toString());
      },
      (error: CometChat.CometChatException) => {
        console.log('Call initialization failed with exception:', error);
      },
    );
  };

  const cancelCall = () => {
    //code
    if (call) {
      // @ts-ignore
      CometChat.rejectCall(
        call.sessionId,
        CometChat.CALL_STATUS.CANCELLED,
      ).then(
        call => {
          console.log('WE HAVE CANCCLED THE CALL:');
          CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccCallRejected, {
            call,
          });
          CometChatSoundManager.pause();
          navigation.goBack();
        },
        err => {
          console.log('Error while canceling the call', err);
        },
      );
    }
  };

  const endCall = () => {
    if (call) {
      CometChat.endCall(call.getSessionId())
        .then(() => {
          setCall(undefined);
          console.log('cancel call');
          navigation.goBack();
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  };

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={styles.backdrop}
        pressBehavior="collapse"
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  const onErrorHandler = (error: CometChat.CometChatException) => {
    //code
    console.log('There is an Error durring the call:', error);
  };

  return isCallConnected ? (
    <CometChatOngoingCall
      // @ts-ignore
      sessionID={call.sessionId}
      callSettingsBuilder={callSettings.current}
      onError={onErrorHandler}
    />
  ) : (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: theme.colors.background2}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      style={styles.bsheet}
      handleComponent={null}
      enableContentPanningGesture={false}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.contentContainer}>
        <ImageBackground
          blurRadius={30}
          style={styles.fullScreen}
          source={{uri: user.avatar}}>
          <Flex style={styles.blackCover} />
          <Text
            textAlign={'center'}
            mt={'spacing24'}
            variant={'bodyLarge'}
            fontWeight={'bold'}
            color={'white'}>
            {t('outgoing_call')}
          </Text>
          <Flex
            height={SCREEN_HEIGHT * 0.7 - 100}
            pt={'spacing10'}
            width={'100%'}>
            <Flex
              mt={'spacing36'}
              flexDirection={'row'}
              justifyContent={'center'}>
              <FastImage style={styles.image} source={{uri: user.avatar}} />
            </Flex>
            <Text
              textAlign={'center'}
              variant={'buttonLabelLarge'}
              fontWeight={'bold'}
              color={'white'}>
              {user.username}
            </Text>
            {user && (
              <Text
                textAlign={'center'}
                variant={'bodySmall'}
                style={{marginTop: -10}}
                color={'white'}>
                {user.age},{' '}
                <CountryFlag
                  isoCode={user.country}
                  size={12}
                  style={{marginTop: 2, borderRadius: 2}}
                />{' '}
                {user.country}
              </Text>
            )}
            <Flex
              style={{marginTop: 'auto'}}
              paddingHorizontal={'spacing36'}
              justifyContent={'space-around'}
              flexDirection={'row'}
              alignItems={'center'}>
              <Touchable activeOpacity={0.7} onPress={cancelCall}>
                <Flex
                  width={70}
                  height={70}
                  borderRadius={'roundedFull'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  backgroundColor={'accentCritical'}>
                  <MatComIcon name={'phone-hangup'} size={34} color={'white'} />
                </Flex>
              </Touchable>
            </Flex>
          </Flex>
        </ImageBackground>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default OutGoingCall;

const styles = StyleSheet.create({
  blackCover: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  bottomSheet: {
    alignItems: 'center',
    elevation: 5,
    left: 0,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    width: '100%',
    zIndex: 1,
  },
  fullView: {
    height: '100%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  bsheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

/*
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet, ImageBackground} from 'react-native'
import {useTranslation} from 'react-i18next'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
} from '@gorhom/bottom-sheet'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {AppStackParamList} from 'app/routes/screens/Screens.types'
import {Stack} from 'app/routes/screens/Stack'
import {Flex} from 'app/components/layout/Flex'
import {Text} from 'app/components/core/Text/Text'
import Touchable from 'react-native-platform-touchable'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import CountryFlag from 'react-native-country-flag'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import {CometChat} from '@cometchat/chat-sdk-react-native'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {
    AvatarStyleInterface,
    CallingPackage,
    CallUIEvents,
    CometChatOngoingCall,
    CometChatSoundManager,
    CometChatUIEventHandler,
    ImageType,
} from 'app/components/calls'
import {
    MessageCategoryConstants,
    MessageTypeConstants,
} from 'app/components/calls/shared/constants/UIKitConstants'

type Props = NativeStackScreenProps<AppStackParamList, Stack.OutGoingCall>

export interface CometChatOutgoingCallInterface {}

const CometChatCalls = CallingPackage.CometChatCalls

const OutGoingCall: React.FC<Props & CometChatOutgoingCallInterface> = ({navigation, route}) => {
    const [isCallConnected, setCallConnected] = useState(false)
    const [call, setCall] = useState<CometChat.Call>()
    const {t} = useTranslation()
    const ongoingCall = useRef<CometChat.Call | CometChat.CustomMessage | null>(null)
    const callSessionId = useRef<string | null>(null)
    const callListener = useRef(null)
    const callSettings = useRef(null)
    const isCallEnded = useRef<null | boolean>(null)
    const me = useAppSelector(state => state.user)
    const user = route.params.user
    const snapPoints = useMemo(() => ['70%'], [])
    const bottomSheetRef = useRef<BottomSheet>(null)
    const theme = useAppTheme()

    function checkIfDefualtCall(call: CometChat.BaseMessage): Boolean {
        return call.getCategory() == MessageCategoryConstants.call
    }

    const endCallIfRequired = useCallback(() => {
        if (call) {
            if (checkIfDefualtCall(call)) {
                CometChat.endCall((call as CometChat.Call).getSessionId())
                    .then(() => {
                        ;(call as CometChat.Call).setStatus('ended')
                        !isCallEnded.current &&
                            CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccCallEnded, {call})
                        isCallEnded.current = true
                    })
                    .catch(err => {
                        console.log('Error', err)
                    })
            }
        }
    }, [call])

    useEffect(() => {
        if (call) {
            if (
                call['status'] == 'ongoing' ||
                (call.getCategory() == (CometChat.CATEGORY_CUSTOM as CometChat.MessageCategory) &&
                    call.getType() == MessageTypeConstants.meeting)
            ) {
                ongoingCall.current = call
                if (call.getType() == MessageTypeConstants.meeting)
                    // @ts-ignore
                    callSessionId.current = (call as CometChat.CustomMessage).getCustomData()[
                        'sessionId'
                    ]
                if (call.getCategory() == MessageCategoryConstants.call)
                    // @ts-ignore
                    callSessionId.current = call['sessionId']
                setCallConnected(true)
            }
            console.log('now we prepare the call objects')
            const callListener = new CometChatCalls.OngoingCallListener({
                onCallEndedMessageReceived: (call: any) => {
                    console.log('THE CALL IS ENDED:', call)
                    setCall(undefined)
                    ongoingCall.current = null
                    callSessionId.current = null
                    setCallConnected(false)
                    navigation.goBack()
                },
                onError: (error: any) => {
                    console.log('There is an error durring the Error :', error)
                },
            })
            callSettings.current = new CometChatCalls.CallSettingsBuilder()
                .setCallEventListener(callListener)
                .setIsAudioOnlyCall(false)
                .enableDefaultLayout(true)
        }
    }, [call])

    useEffect(() => {
        startCall()
        CometChat.addCallListener(
            '@' + me.id.toString(),
            new CometChat.CallListener({
                onOutgoingCallAccepted: (call: any) => {
                    CometChatSoundManager.pause()
                    setCall(call)
                    ongoingCall.current = call
                    console.log('the call is accepted', call['sessionId'])
                    callSessionId.current = call['sessionId']
                    setCallConnected(true)
                },
                onOutgoingCallRejected: (call: any) => {
                    console.log('THE CALL IS REJECTED:')
                    CometChatSoundManager.pause()
                    setCall(undefined)
                    ongoingCall.current = null
                    callSessionId.current = null
                    setCallConnected(false)
                    navigation.goBack()
                },
                onCallEndedMessageReceived: (call: any) => {
                    console.log('THE CALL IS ENDED:')
                    CometChatSoundManager.pause()
                    setCall(undefined)
                    ongoingCall.current = null
                    callSessionId.current = null
                    setCallConnected(false)
                    navigation.goBack()
                },
            }),
        )
        CometChatUIEventHandler.addCallListener('@' + me.id.toString(), {
            ccCallFailed: () => {
                setCallConnected(false)
            },
        })
        return CometChat.removeCallListener(me.id.toString())
    }, [])

    const startCall = () => {
        //CometChatSoundManager.play('outgoingCall')
        var call: CometChat.Call = new CometChat.Call(
            user?.id.toString(),
            CometChat.CALL_TYPE.VIDEO,
            CometChat.RECEIVER_TYPE.USER,
        )

        CometChat.initiateCall(call).then(
            (outGoingCall: CometChat.Call) => {
                setCall(outGoingCall)
                console.log('Call initiated successfully:', user?.id.toString())
            },
            (error: CometChat.CometChatException) => {
                console.log('Call initialization failed with exception:', error)
            },
        )
    }

    const cancelCall = () => {
        //code
        if (call) {
            // @ts-ignore
            CometChat.rejectCall(call['sessionId'], CometChat.CALL_STATUS.CANCELLED).then(
                call => {
                    console.log('WE HAVE CANCCLED THE CALL:')
                    CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccCallRejected, {call})
                    CometChatSoundManager.pause()
                    navigation.goBack()
                },
                err => {
                    console.log('Error while canceling the call', err)
                },
            )
        }
    }

    const endCall = () => {
        if (call) {
            CometChat.endCall(call.getSessionId())
                .then(() => {
                    setCall(undefined)
                    console.log('cancel call')
                    navigation.goBack()
                })
                .catch(error => {
                    console.log('error', error)
                })
        }
    }

    const handleSheetChanges = useCallback(
        (ind: number) => {
            if (ind === -1) {
                navigation.goBack()
            }
        },
        [navigation],
    )

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                style={styles.backdrop}
                pressBehavior="collapse"
                disappearsOnIndex={-1}
            />
        ),
        [],
    )
    const onErrorHandler = (error: CometChat.CometChatException) => {
        //code
        console.log('There is an Error durring the call:', error)
    }

    return isCallConnected ? (
        <CometChatOngoingCall
            // @ts-ignore
            sessionID={call['sessionId']}
            callSettingsBuilder={callSettings.current}
            onError={onErrorHandler}
        />
    ) : (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            enablePanDownToClose
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor: theme.colors.background2}}
            handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
            style={styles.bsheet}
            handleComponent={null}
            enableContentPanningGesture={false}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={styles.contentContainer}>
                <ImageBackground
                    blurRadius={30}
                    style={styles.fullScreen}
                    source={{uri: user.avatar}}>
                    <Flex style={styles.blackCover} />
                    <Text
                        textAlign={'center'}
                        mt={'spacing24'}
                        variant={'bodyLarge'}
                        fontWeight={'bold'}
                        color={'white'}>
                        {t('outgoing_call')}
                    </Text>
                    <Flex height={SCREEN_HEIGHT * 0.7 - 100} pt={'spacing10'} width={'100%'}>
                        <Flex mt={'spacing36'} flexDirection={'row'} justifyContent={'center'}>
                            <FastImage style={styles.image} source={{uri: user.avatar}} />
                        </Flex>
                        <Text
                            textAlign={'center'}
                            variant={'buttonLabelLarge'}
                            fontWeight={'bold'}
                            color={'white'}>
                            {user.username}
                        </Text>
                        {user && (
                            <Text
                                textAlign={'center'}
                                variant={'bodySmall'}
                                style={{marginTop: -10}}
                                color={'white'}>
                                {user.age},{' '}
                                <CountryFlag
                                    isoCode={user.country}
                                    size={12}
                                    style={{marginTop: 2, borderRadius: 2}}
                                />{' '}
                                {user.country}
                            </Text>
                        )}
                        <Flex
                            style={{marginTop: 'auto'}}
                            paddingHorizontal={'spacing36'}
                            justifyContent={'space-around'}
                            flexDirection={'row'}
                            alignItems={'center'}>
                            <Touchable activeOpacity={0.7} onPress={cancelCall}>
                                <Flex
                                    width={70}
                                    height={70}
                                    borderRadius={'roundedFull'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    backgroundColor={'accentCritical'}>
                                    <MatComIcon name={'phone-hangup'} size={34} color={'white'} />
                                </Flex>
                            </Touchable>
                        </Flex>
                    </Flex>
                </ImageBackground>
            </BottomSheetView>
        </BottomSheet>
    )
}

export default OutGoingCall

const styles = StyleSheet.create({
    blackCover: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    fullScreen: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    bottomSheet: {
        alignItems: 'center',
        elevation: 5,
        left: 0,
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        width: '100%',
        zIndex: 1,
    },
    fullView: {
        height: '100%',
        width: '100%',
    },
    backdrop: {
        backgroundColor: 'black',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: 'absolute',
    },
    bsheet: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})

*/
