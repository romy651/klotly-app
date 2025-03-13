import Image from 'app/components/core/Image/Image';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {UserInfo} from 'app/redux/user/userReducer';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {Stack} from 'app/routes/screens/Stack';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useRooms} from 'app/actions/roomAction';
import {Room} from 'app/actions/chatType';
import {getOnlineStatus} from 'app/utils/tools';
import FastImage from 'react-native-fast-image';

interface UserItemProps {
  user: UserInfo;
}

const UserItemRow: React.FC<UserItemProps> = ({user}) => {
  const [isOnline, setOnline] = useState<boolean>(false);
  const me = useAppSelector(state => state.user);
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const {createRoom} = useRooms();

  const initStatus = useCallback(async () => {
    const status = await getOnlineStatus(user.id);
    setOnline(status !== 0);
  }, [user.id]);

  useEffect(() => {
    initStatus();
  }, [initStatus]);

  const openUser = () => {
    if (user.id !== me.id) {
      if (user.isTutor) {
        navigation?.push(Stack.UserProfileScreen, {
          userId: user.id,
          user,
        });
      } else {
        navigation?.push(Stack.ProfileScreen, {
          id: user.id,
        });
      }
    }
  };

  const create_room = async () => {
    if (!user) {
      return;
    }
    const room = (await createRoom(user)) as Room;
    navigation.navigate(Stack.ChatScreen, {room});
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={openUser}>
      <>
        <Flex
          borderBottomWidth={1}
          borderBottomColor={'background3'}
          py={'spacing18'}
          alignItems={'center'}
          flexDirection={'row'}>
          <Flex width={60} height={60}>
            <FastImage source={{uri: user.avatar}} style={styles.image} />
            <Flex
              position={'absolute'}
              bottom={5}
              right={5}
              backgroundColor={isOnline ? 'accentSuccess' : 'background3'}
              style={styles.dot}
            />
          </Flex>
          <Flex width={SCREEN_WIDTH - 230} gap={'spacing4'}>
            <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
              {`${user.firstName} ${user.lastName}`}
            </Text>
            <Text variant={'buttonLabelSmall'} color={'textSecondary'}>
              {`${user.age}, ${user.gender}, ${user.country}`}
            </Text>
            <View style={styles.lastRow}>
              <AntDesign
                style={{marginRight: 5}}
                name="message1"
                size={14}
                color={theme.colors.textSecondary}
              />
              {user.languages.map((lang, index) => (
                <Text
                  key={index}
                  variant={'bodyMicro'}
                  fontWeight={'bold'}
                  color={'textSecondary'}>
                  {lang + (index == user.languages.length - 1 ? '' : ', ')}
                </Text>
              ))}
            </View>
          </Flex>
          <Touchable onPress={create_room} style={{...styles.touchableAction}}>
            <Flex
              backgroundColor={'background2'}
              alignItems={'center'}
              justifyContent={'center'}
              borderWidth={1}
              px={'spacing16'}
              borderRadius={'rounded8'}
              py={'spacing4'}
              borderColor={'background3'}>
              <Text variant={'subheadSmall'} color={'textPrimary'}>
                {t('message')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
        {/*<View style={{...styles.lastLine, backgroundColor: theme.colors.background3}} />*/}
      </>
    </TouchableOpacity>
  );
};

export default UserItemRow;

const styles = StyleSheet.create({
  lastLine: {
    width: SCREEN_WIDTH - 82,
    height: 1,
    backgroundColor: 'green',
    marginLeft: 82,
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderColor: 'white',
  },
  touchableAction: {
    marginLeft: 'auto',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  callView: {
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  flag: {
    borderRadius: 15,
    width: 12,
    height: 12,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});

/*
<Flex flexDirection={'row'} alignItems={'center'} gap={'none'}>
                            <Flex
                                backgroundColor={isOnline ? 'accentSuccess' : 'background3'}
                                style={styles.dot}
                            />
                            <Text variant={'bodyMicro'} color={'textSecondary'}>
                                {isOnline ? t('online') : t('offline')}
                                <Text variant={'bodyMicro'} color={'textSecondary'}>
                                    {' • '}
                                </Text>
                            </Text>
                            <CountryFlag
                                size={15}
                                style={styles.flag}
                                isoCode={user.country.toLowerCase()}
                            />
                            <Text
                                style={{marginLeft: 2}}
                                variant={'bodyMicro'}
                                color={'textSecondary'}>
                                {user.country}
                            </Text>
                        </Flex>
*/
