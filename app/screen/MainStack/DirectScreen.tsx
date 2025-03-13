import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  ChatStackParamList,
} from 'app/routes/screens/Screens.types';
import {ChatStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  openSettings,
} from 'react-native-permissions';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useRooms} from 'app/actions/roomAction';
import UserMessageItem from 'app/components/UserMessageItem';
import {Room} from 'app/actions/chatType';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Flex} from 'app/components/layout/Flex';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = NativeStackScreenProps<
  ChatStackParamList & AppStackParamList,
  ChatStackScreens.DirectScreen
>;

const DirectScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const [hasNotif, setHasNotif] = useState<boolean>(false);
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const {rooms, setRoomsSeen, deleteAllRooms, deleteRoom} = useRooms();

  useEffect(() => {
    checkNotifications().then(res => {
      if (res.status === 'granted') {
        setHasNotif(true);
      }
      console.log(res.settings);
    });
  }, []);

  const setRead = () => {
    Alert.alert(t('confirm_read'), t('confirm_read_desc') as string, [
      {
        text: t('confirm') as string,
        onPress: setRoomsSeen,
      },
      {
        text: t('cancel') as string,
        style: 'destructive',
      },
    ]);
  };

  const deleteChats = () => {
    Alert.alert(t('delete_chats'), t('delete_chats_desc') as string, [
      {
        text: t('confirm') as string,
        onPress: deleteAllRooms,
      },
      {
        text: t('cancel') as string,
        style: 'destructive',
      },
    ]);
  };

  const actions = [
    {
      title: t('set_unread_read'),
      action: setRead,
    },
    {
      title: t('delete_chats'),
      action: deleteChats,
    },
    {
      title: t('cancel'),
      action: () => {},
      destructive: true,
    },
  ];

  const request_notif = () => {
    requestNotifications(['alert', 'sound'])
      .then(({status, settings}) => {
        console.log('it is now approved', status);
      })
      .catch(err => {
        console.log('error', err);
        openSettings();
      });
  };

  const renderItem = ({item, index}: {item: Room; index: number}) => {
    return (
      <UserMessageItem
        deleteRoom={() => deleteRoom(item.id)}
        openRoom={() => _openRoom(item)}
        room={item}
        key={index}
      />
    );
  };

  const _openRoom = (room: Room) => {
    navigation.push(Stack.ChatScreen, {room});
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        showBorder
        title={t('messages') as string}
        onShowMore={actions}
        withNotice
      />
      {!hasNotif && (
        <View
          style={{...styles.notif_view, borderColor: theme.colors.background2}}>
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {t('turn_on_notification')}
          </Text>
          <Touchable
            onPress={request_notif}
            style={{
              ...styles.turn_on,
              backgroundColor: theme.colors.accentWarning,
            }}>
            <Text variant={'bodyMicro'} color={'white'}>
              {t('turn_on')}
            </Text>
          </Touchable>
        </View>
      )}
      <FlatList
        style={{backgroundColor: theme.colors.background0}}
        data={rooms}
        ListEmptyComponent={
          <Flex
            flex={1}
            alignItems="center"
            width="100%"
            height={SCREEN_HEIGHT - 210}
            justifyContent="center"
            backgroundColor="background0">
            <MatComicon
              name="inbox-full"
              size={42}
              color={theme.colors.textSecondary}
            />
            <Text variant="bodyLarge" color="textSecondary">
              {t('inbox_empty')}
            </Text>
          </Flex>
        }
        renderItem={renderItem}
      />
    </Screen>
  );
};

export default DirectScreen;

const styles = StyleSheet.create({
  image: {
    width: 45,
    height: 45,
    borderRadius: 40,
  },
  turn_on: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
  notif_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  headerView: {
    width: '100%',
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
});
