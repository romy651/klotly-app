import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useEffect, useState} from 'react';
import {UserInfo} from 'app/redux/user/userReducer';
import {useTranslation} from 'react-i18next';
import {RingingCallContent} from 'app/components/Ringing/RingingCallContent';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {getUser} from 'app/actions/chatAction';

type Props = NativeStackScreenProps<AppStackParamList, Stack.OngoingCallScreen>;

const OngoingCallScreen: React.FC<Props> = ({navigation, route}) => {
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const me = useAppSelector(state => state.user);
  //const inset = useSafeAreaInsets()
  const {bookingId, userIds} = route.params;
  console.log('the booking id: ', bookingId);
  const others = userIds.filter(_ => _ !== me.id);
  const [users, setUsers] = useState<UserInfo[]>([]);
  //@ts-ignore
  const {t} = useTranslation();

  useEffect(() => {
    console.log('now we start');
    joinCall();
  }, []);

  useEffect(() => {
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  const joinCall = async () => {
    // const members = [{user_id: `${route.params.userId}`}, {user_id: `${me.id}`}]
    //console.log('now we join: ', members)
    const _users = await Promise.all(others.map(_ => getUser(_)));
    setUsers(_users);
    const _call = client?.call('default', `Call-${bookingId}`);
    await _call
      ?.join({create: true})
      .then(() => {
        console.log('now we join the call');
      })
      .catch(err => {
        console.log('error joining the call: ', err);
      });
    //console.log('NOW WE SET THE CALL: ', call)
    setCall(_call as Call);
  };

  if (!call) {
    return (
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        flex={1}
        backgroundColor={'background3'}>
        <Text color={'textPrimary'} variant={'bodyLarge'}>
          {t('joining_meeting')}
        </Text>
      </Flex>
    );
  }

  return (
    <Screen backgroundColor={'black'} edges={['top']}>
      <StreamCall call={call}>
        <RingingCallContent
          bookingId={bookingId}
          navigation={navigation}
          others={users}
        />
      </StreamCall>
    </Screen>
  );
};

export default OngoingCallScreen;
