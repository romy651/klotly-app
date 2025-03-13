import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from 'app/components/layout/Screen';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {HomeStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Text} from 'app/components/core/Text/Text';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import ContextMenu from 'react-native-context-menu-view';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {Chat} from 'app/components/ChatUI';
import {MessageType, Room, User} from 'app/actions/chatType';
import uid from 'react-native-uuid';
import {getUser} from 'app/actions/chatAction';
import {useMessages} from 'app/actions/messageAction';
import {getOnlineStatus, uploadImage} from 'app/utils/tools';
import {ImageOrVideo} from 'react-native-image-crop-picker';
//import {useRooms} from 'app/actions/roomAction';
import {updateUserSuccess, UserInfo} from 'app/redux/user/userReducer';
import {useDispatch} from 'react-redux';
import {ImagePickerResponse} from 'react-native-image-picker';

type Props = NativeStackScreenProps<
  AppStackParamList & HomeStackParamList,
  Stack.ChatScreen
>;

interface ChatMessage {
  id: string;
  message: string;
  type: 'sent' | 'received';
}

const ChatScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  //const {bottom} = useSafeAreaInsets()
  const me = useAppSelector(state => state.user);
  const theme = useAppTheme();
  const dispatch = useDispatch();
  //const coins = me.coins
  const otherUser = route.params?.room.users.find(_ => _.id !== me.id) as User;
  const {messages, sendMessage, cleanEmtpyMessages} = useMessages(
    route.params.room as Room,
  );
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [other, setOther] = useState<UserInfo>();
  //const {deleteRoom} = useRooms();
  const [photos, setPhotos] = useState<string[]>([]);
  //console.log('the other user', route.params.room)
  //const onPressProfile = () => {};
  //@ts-ignore
  const {t} = useTranslation();

  const [messageSending, setMessageSending] = useState<boolean>(false);

  const handleAttachmentPress = () => {
    navigation.navigate(Stack.UploadImageScreen, {
      callback: uri => {
        const image = (uri as ImagePickerResponse).assets?.[0];
        console.log('the image: ', uri);
        setMessageSending(true);
        uploadImage(
          image?.uri as string,
          me.id,
          () => {},
          () => {},
          uri => {
            const imageMessage = {
              authorId: me.id,
              createdAt: Date.now(),
              height: image?.height,
              id: uid.v4().toString(),
              name: (image?.fileName as string).split('/').pop() ?? '🖼',
              size: 0,
              type: 'image',
              uri: uri,
              width: image?.width,
            };
            sendMessage(imageMessage);
            setMessageSending(false);
          },
        );
      },
      fullData: true,
    });
  };

  const handleMessagePress = (message: any) => {
    console.log('NOW WE MOVE');
    message.type == 'image' &&
      navigation?.push(Stack.GalleryScreen, {
        index: 0,
        photos: [message.uri],
      });
  };

  const handlePreviewDataFetched = () => {};

  useEffect(() => {
    console.log('THE ROOM ID', route.params.room.id);
    init();
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    return () => {
      console.log('now WE UNMOUNT: ', messages.length);
      cleanEmtpyMessages();
    };
  }, []);

  const init = async () => {
    // const o_user = await fetchUser(otherUser?.id as string)
    setPhotos(otherUser.photos as string[]);
    const status = await getOnlineStatus(otherUser.id);
    setIsOnline(status !== 0);
    const _ = await getUser(otherUser.id);
    setOther(_);
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    console.log('now we send: ', message);
    const textMessage = {
      authorId: me.id,
      createdAt: Date.now(),
      id: uid.v4().toString(),
      text: message.text,
      type: message.type,
      status: 'sent',
    };
    //we push the message in the room
    sendMessage(textMessage);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const onBlock = () => {
    if (me.blocked_users?.includes(otherUser.id)) {
      dispatch(
        updateUserSuccess({
          ...me,
          blocked_users: me.blocked_users?.filter(id => id !== otherUser.id),
        }),
      );
    } else {
      Alert.alert(t('are_you_sure'), t('block_desc') as string, [
        {
          text: t('yes_block') as string,
          onPress: () => {
            dispatch(
              updateUserSuccess({
                ...me,
                blocked_users: [...(me.blocked_users || []), otherUser.id],
              }),
            );
            navigation.goBack();
          },
        },
        {text: t('cancel') as string, style: 'cancel'},
      ]);
    }
  };

  const onReport = async () => {
    navigation?.push(HomeStackScreens.ReportScreen, {
      user: other as UserInfo,
      callback: navigation.goBack,
      type: 'user',
    });
  };

  const actions = [
    {
      title: t('view_profile'),
      action: () => {
        navigation.push(Stack.ProfileScreen, {id: otherUser?.id as string});
      },
      systemIcon: Platform.OS == 'ios' ? 'person' : 'btn_person',
    },
    {
      title: t('block'),
      action: onBlock,
      systemIcon: Platform.OS == 'ios' ? 'person.slash' : 'btn_minus',
    },
    {
      title: t('report'),
      action: onReport,
      systemIcon:
        Platform.OS == 'ios' ? 'exclamationmark.triangle' : 'stat_sys_warning',
    },
    {
      title: t('cancel'),
      action: () => {},
      destructive: true,
    },
  ];

  const ListHeaderComponent = () => {
    return (
      <View style={{}}>
        <View
          style={{
            ...styles.text_warning,
            backgroundColor: theme.colors.background2,
          }}>
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {t('attention')} !!! 👇🏼👇🏼👇🏼
          </Text>
          <Text
            color={'textSecondary'}
            variant={'bodyMicro'}
            style={{fontSize: 10}}>
            {t('during_chat_desc')}
            {'\n'}
            1. 🚫 {t('offensive_language')}
            {'\n'}
            2. 🚫 {t('pornographic')}
            {'\n'}
            3. 🚫 {t('nudity')}
            {'\n'}
            4. 🚫 {t('violence')}
            {'\n'}
            5. 🚫 {t('screen_recording')}
            {'\n'}
            6. 🚫 {t('bloodiness')}
            {'\n'}
            7. 🚫 {t('underage')}
            {'\n'}
            8. 🚫 {t('Harassment')}
            {'\n'}
            {t('please_chat_civil')}
            {'\n'}
            {t('if_reported_banned')}
            {'\n'}
            {t('if_other_reported')}
          </Text>
        </View>
      </View>
    );
  };

  const onLongPress = (message: any) => {
    console.log('long press', message);
  };

  const onSendGift = () => {
    navigation.navigate(Stack.GiftScreen, {userId: otherUser?.id as string});
  };

  const onVideoCall = () => {};

  const onAudioCall = () => {};

  const onBook = () => {
    navigation?.push(Stack.BookingScreen, {
      callback: () => {
        navigation.goBack();
      },
      tutor: other as UserInfo,
    });
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']} flex={1}>
      <View
        style={{
          ...styles.headerView,
          borderBottomColor: theme.colors.background3,
          borderBottomWidth: 2,
        }}>
        <Flex position={'absolute'} left={10}>
          <TouchableIcon
            Component={Ionicon}
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
            size={24}
            color={theme.colors.textPrimary}
            action={navigation.goBack}
          />
        </Flex>
        <Flex
          style={{marginRight: 'auto', marginLeft: 60}}
          flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'subheadLarge'}
            color={'textPrimary'}
            numberOfLines={1}>
            {`${otherUser?.username}`}
            <Text
              variant={'subheadLarge'}
              color={isOnline ? 'accentSuccess' : 'textSecondary'}>
              {' '}
              •
            </Text>
          </Text>
        </Flex>
        <Flex position={'absolute'} right={10}>
          {!me.isTutor ? (
            <Text
              onPress={onBook}
              textDecorationLine={'underline'}
              variant={'buttonLabelMicro'}
              color={'textPrimary'}>
              {t('buy_lesson')}
            </Text>
          ) : (
            <ContextMenu
              dropdownMenuMode
              actions={actions}
              onPress={e => actions[e.nativeEvent.index]?.action()}>
              <MatComIcon
                name="dots-horizontal"
                size={28}
                color={theme.colors.textSecondary}
              />
            </ContextMenu>
          )}
        </Flex>
      </View>
      <Chat
        messages={messages}
        onAttachmentPress={handleAttachmentPress}
        onMessagePress={handleMessagePress}
        onPreviewDataFetched={handlePreviewDataFetched}
        onSendPress={handleSendPress}
        listHeaderComponent={ListHeaderComponent}
        isAttachmentUploading={messageSending}
        user={{id: me.id}}
        onMessageLongPress={onLongPress}
        onSendGift={onSendGift}
        onVideoCall={onVideoCall}
        onAudioCall={onAudioCall}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  text_warning: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'flex-start',
    borderRadius: 4,
    height: 240,
    marginTop: 10,
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
  },
  lastViewPhoto: {
    width: (SCREEN_WIDTH - 55) / 4,
    height: 110,
    borderRadius: 3,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navBarTitle: {fontSize: 16, fontWeight: 'bold', color: 'white'},
  messageText: {
    color: 'white',
  },
  sentMessageContainer: {
    backgroundColor: '#186BE7',
    alignSelf: 'flex-start',
    borderRadius: 12,
    maxWidth: '75%',
    padding: 12,
    marginVertical: 12,
  },
  receivedMessageContainer: {
    backgroundColor: '#1F2329',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    borderRadius: 12,
    maxWidth: '75%',
    padding: 12,
    marginVertical: 12,
  },
});

export default ChatScreen;

interface RangeProps {
  start?: number;
  end: number;
  step?: number;
}

const range = ({start = 0, end, step = 1}: RangeProps): Array<number> => {
  const result = new Array(end - start);

  let i = 0;
  for (let v = start; v < end; v += step) {
    result[i] = v;
    i += 1;
  }

  return result;
};
