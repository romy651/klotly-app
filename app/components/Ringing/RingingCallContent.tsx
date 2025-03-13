import {useCallStateHooks} from '@stream-io/video-react-bindings';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Flex} from '../layout/Flex';
import {UserInfo} from 'app/redux/user/userReducer';
import {Text} from '../core/Text/Text';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  CallContent,
  CallingState,
  useCall,
} from '@stream-io/video-react-native-sdk';
import BottomView from './BottomView';
import TopView from './TopView';
import CallComments, {CallComment} from './CallComments';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useIsInPiPMode} from '@stream-io/video-react-native-sdk';

type RingingCallContentProps = {
  others: UserInfo[];
  navigation?: any;
  bookingId: number;
};

/**
 * Component to show the Incoming, Outgoing and CalContent component depending upon the Call states when the call is in ringing mode.
 */
export const RingingCallContent = ({
  others,
  navigation,
  bookingId,
}: RingingCallContentProps) => {
  const {useCallCallingState} = useCallStateHooks();
  const me = useAppSelector(state => state.user);
  const callingState = useCallCallingState();
  const call = useCall();
  const [loading, setLoading] = useState<boolean>(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const {useParticipants} = useCallStateHooks();

  console.log('THE OTHERS: ', callingState);
  const participantCount = useParticipants();

  const [comments, setComments] = useState<CallComment[]>([]);
  const isInPiPMode = useIsInPiPMode(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('liveChats')
      .doc(`${bookingId}`)
      .onSnapshot(documentSnapshot => {
        const res =
          documentSnapshot.data() as FirebaseFirestoreTypes.DocumentData;
        const _ = (res?.messages || []) as CallComment[];
        setComments(_.reverse());
      });
    return () => {
      subscriber();
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [bookingId, call]);

  const handleSheetChanges = useCallback((ind: number) => {
    if (ind === -1) {
      bottomSheetRef.current?.close();
    }
  }, []);

  useEffect(() => {
    console.log('THE NUM OF PARTICIPANTS: ', participantCount);
  }, [participantCount]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    console.log('A NEW EVENT: ', callingState.toString());
  }, [callingState]);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const addMessage = async (input: string) => {
    if (input.length > 0) {
      const temp = {
        image: me.avatar,
        content: input,
        username: me.firstName,
      };
      const messages = [temp, ...comments];
      console.log('NOW WE TRY TO SEND');
      await firestore()
        .collection('liveChats')
        .doc(`${bookingId}`)
        .set({messages});
    }
  };

  const onAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log('onAnimate', fromIndex, toIndex);
    if (toIndex === -1) {
      setIsBottomSheetOpen(false);
    } else {
      setIsBottomSheetOpen(true);
    }
  }, []);

  if (loading) {
    return (
      <Flex
        backgroundColor={'background3'}
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text variant={'bodyLarge'} color={'textPrimary'}>
          Loading...
        </Text>
      </Flex>
    );
  }

  if (callingState === CallingState.JOINING) {
    return (
      <Flex
        backgroundColor={'background3'}
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text variant={'bodyLarge'} color={'textPrimary'}>
          Joining...
        </Text>
      </Flex>
    );
  }

  if (
    callingState === CallingState.JOINED ||
    callingState === CallingState.IDLE
  ) {
    return (
      <>
        <CallContent
          CallTopView={() => <TopView navigation={navigation} />}
          ParticipantsInfoBadge={null}
          ParticipantLabel={null}
          iOSPiPIncludeLocalParticipantVideo={true}
          ParticipantNetworkQualityIndicator={null}
          CallControls={null}
        />
        {!isBottomSheetOpen && !isInPiPMode && (
          <BottomView
            navigation={navigation}
            openBottomSheet={openBottomSheet}
            commentLength={comments.length}
          />
        )}
        <CallComments
          comments={comments}
          bottomSheetRef={bottomSheetRef}
          onSend={addMessage}
          handleSheetChanges={handleSheetChanges}
          onAnimate={onAnimate}
        />
      </>
    );
  }
};

/*
type TopViewProps = {
  user: UserInfo;
};

const TopView = ({user}: TopViewProps) => {
  return (
    <Flex
      width={'100%'}
      height={53}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'center'}>
      <Text color={'white'} variant={'bodyLarge'}>
        {`${user.firstName}, ${user.age}`}{' '}
        <CountryFlag isoCode={user.country} size={18} /> {`${user.country}`}
      </Text>
    </Flex>
  );
};
*/
