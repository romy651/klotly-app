import {Room} from 'app/actions/chatType';
import React, {useCallback} from 'react';
import {View, StyleSheet, Alert, Animated} from 'react-native';
import {Flex} from '../layout/Flex';
import Image from '../core/Image/Image';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import moment from 'moment';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useMessages} from 'app/actions/messageAction';
import {useTranslation} from 'react-i18next';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text} from '../core/Text/Text';
import {getVerboseDateTimeRepresentation} from 'app/utils/tools';
import dayjs from 'dayjs';

interface UserMessageItemProps {
  room: Room;
  openRoom: () => void;
  deleteRoom: () => void;
}

const UserMessageItem: React.FC<UserMessageItemProps> = ({
  room,
  openRoom,
  deleteRoom,
}) => {
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const {t} = useTranslation();
  const otheruser = room.otherUser;
  const {messages, setSeenMessage} = useMessages(room);
  //const date = moment(room.messages?.[0]?.createdAt).local().fromNow();
  //console.log('the date: ', messages[0]?.type)

  // type-coverage:ignore-next-line
  //@ts-ignore
  const time = messages?.[0]?.createdAt ?? undefined;

  const date = getVerboseDateTimeRepresentation(time);

  const unReadCount = useCallback(() => {
    let count = 0;
    if (messages) {
      messages.forEach(message => {
        if (message.author.id !== me.id && message.status !== 'seen') {
          count++;
        }
      });
    }
    return count;
  }, [messages, me.id]);

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-75, 0],
      outputRange: [0, 20],
    });
    return (
      <RectButton style={styles.rightButton} onPress={deleteChat}>
        <Animated.View
          style={[
            {
              transform: [{translateX: trans}],
            },
          ]}>
          <FontAwesome name="trash-o" color={'white'} size={26} />
        </Animated.View>
      </RectButton>
    );
  };

  const text_content = useCallback(() => {
    let res = '...';
    const _temp = messages[0] as any;
    if (_temp) {
      if (_temp.type === 'text') {
        res = _temp.text;
      } else if (_temp.type === 'image') {
        res = `[${t('picture')}]`;
      }
    }
    return res;
  }, [messages, t]);

  const onPress = () => {
    setSeenMessage();
    openRoom();
  };

  const deleteChat = () => {
    Alert.alert(t('delete_chat'), t('delete_chat_desc') as string, [
      {
        text: t('confirm') as string,
        onPress: deleteRoom,
      },
      {
        text: t('cancel') as string,
        style: 'destructive',
      },
    ]);
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Touchable onPress={onPress}>
        <Flex
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.background2,
            paddingVertical: 5,
          }}>
          <Flex
            paddingHorizontal={'spacing10'}
            flexDirection={'row'}
            alignItems={'center'}
            paddingVertical={'spacing10'}>
            <Image
              source={{
                uri: otheruser?.avatar,
              }}
              style={styles.image}
            />
            <Flex gap={'spacing2'}>
              <Flex
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={SCREEN_WIDTH - 90}
                gap={'spacing2'}>
                <Text
                  variant={'subheadSmall'}
                  color={'textPrimary'}>{`${otheruser?.username.slice(
                  0,
                  10,
                )} `}</Text>
                <Text variant={'bodyMicro'} color={'textSecondary'}>
                  {date}
                </Text>
              </Flex>
              <Text
                style={{width: SCREEN_WIDTH - 120}}
                variant={'bodySmall'}
                color={'textSecondary'}
                numberOfLines={2}>
                {text_content()}
              </Text>
            </Flex>
            <View style={{marginLeft: 'auto', paddingTop: 3}}>
              {unReadCount() > 0 && (
                <View style={styles.unReadView}>
                  <Text variant={'buttonLabelMicro'} color={'white'}>
                    {unReadCount()}
                  </Text>
                </View>
              )}
            </View>
          </Flex>
        </Flex>
      </Touchable>
    </Swipeable>
  );
};

export default UserMessageItem;

const styles = StyleSheet.create({
  rightButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  lineView: {
    width: SCREEN_WIDTH - 65,
    height: 1,
    marginLeft: 65,
    marginVertical: 7.5,
  },
  unReadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unReadView: {
    backgroundColor: 'red',
    width: 15,
    height: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginTop: 7.5,
  },
  flag: {
    borderRadius: 3,
    marginTop: -2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageView: {
    justifyContent: 'center',
    marginLeft: -5,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  messageStyle: {
    fontSize: 12,
    marginTop: 7.5,
    maxWidth: SCREEN_WIDTH - 100,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
