import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {UserInfo} from 'app/redux/user/userReducer';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet, View} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {Stack} from 'app/routes/screens/Stack';
import {getOnlineStatus} from 'app/utils/tools';

interface UserItemProps {
  user: UserInfo;
}

const UserItem: React.FC<UserItemProps> = ({user}) => {
  const [isOnline, setOnline] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const {t} = useTranslation();
  const langs = ['English', 'Francais'];

  const openUser = () => {
    navigation?.push(Stack.ProfileScreen, {
      id: user.id,
    });
  };

  useEffect(() => {
    (async () => {
      const status = await getOnlineStatus(user.id);
      setOnline(status);
    })();
  }, []);

  const onCall = () => {
    navigation?.push(Stack.OngoingCallScreen, {
      userId: user.id.toString(),
    });
  };

  return (
    <Touchable onPress={openUser}>
      <ImageBackground source={{uri: user.avatar}} style={styles.Container}>
        <View style={styles.gradient} />
        <View style={styles.available}>
          <View
            style={[
              styles.status,
              {
                backgroundColor: isOnline
                  ? theme.colors.accentSuccess
                  : theme.colors.textSecondary,
              },
            ]}
          />
          <Text variant={'bodyMicro'} color={'white'}>
            {t('available')}
          </Text>
        </View>
        <Flex style={styles.bottomView}>
          <View style={styles.topRow}>
            <View style={styles.countryView}>
              <CountryFlag
                size={15}
                style={styles.flag}
                isoCode={user.country.toLowerCase()}
              />
              <Text variant={'bodyMicro'} fontWeight={'bold'} color={'white'}>
                {user.country}
              </Text>
            </View>
            <MatIcon
              selectionColor={'white'}
              name={'verified'}
              size={20}
              color={theme.colors.accentActive}
            />
          </View>
          <Text
            style={{marginTop: -10}}
            fontWeight={'bold'}
            variant={'bodySmall'}
            color={'white'}>
            {user.firstName}
          </Text>
          <View style={styles.lastRow}>
            <AntDesign
              style={{marginRight: 5}}
              name="message1"
              size={15}
              color={'white'}
            />
            {langs.map((lang, index) => (
              <Text
                key={index}
                fontWeight={'bold'}
                variant={'bodyMicro'}
                color={'white'}>
                {lang + (index == langs.length - 1 ? '' : ', ')}
              </Text>
            ))}
          </View>
          <Touchable onPress={onCall} style={styles.touchableAction}>
            <Flex backgroundColor={'accentSuccess'} style={styles.callView}>
              <Icon name="videocam" size={30} color="white" />
            </Flex>
          </Touchable>
        </Flex>
      </ImageBackground>
    </Touchable>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  touchableAction: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
  },
  callView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastRow: {
    flexDirection: 'row',
    marginTop: -10,
    alignItems: 'center',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
  },
  flag: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
  bottomView: {
    width: '100%',
    height: 95,
    marginTop: 'auto',
    padding: 10,
  },
  Container: {
    backgroundColor: 'gray',
    width: '100%',
    height: '100%',
  },
  available: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 90,
    margin: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  countryView: {
    width: 55,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginRight: 5,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});
