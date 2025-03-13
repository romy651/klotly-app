import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Flex} from '../layout/Flex';
import Image from '../core/Image/Image';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Text} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {UserInfo} from 'app/redux/user/userReducer';

interface UserBlockedItemProps {
  otheruser: UserInfo;
  unBlockUser: () => void;
}

const UserBlockedItem: React.FC<UserBlockedItemProps> = ({
  otheruser,
  unBlockUser,
}) => {
  const theme = useAppTheme();
  const {t} = useTranslation();

  return (
    <Touchable
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.background2,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}>
      <>
        <Flex
          pr={'spacing10'}
          flexDirection={'row'}
          paddingVertical={'spacing10'}>
          <Image
            source={{
              uri: otheruser?.avatar,
            }}
            style={styles.image}
          />
          <View style={styles.messageView}>
            <View style={styles.titleRow}>
              <Text
                style={{
                  ...styles.title,
                  color: theme.colors.textPrimary,
                }}>{`${otheruser?.firstName.slice(0, 10)}, ${
                otheruser?.age
              } `}</Text>
              <CountryFlag
                isoCode={otheruser?.country as string}
                size={14}
                style={styles.flag}
              />
              <Text
                style={{
                  ...styles.title,
                  fontWeight: 'normal',
                  color: theme.colors.textPrimary,
                }}>{` ${otheruser?.country} `}</Text>
              <MatIcon
                name="verified"
                size={14}
                color={theme.colors.accentAction}
              />
            </View>
          </View>
        </Flex>
        <Touchable
          onPress={unBlockUser}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.textSecondary,
            paddingHorizontal: 15,
            justifyContent: 'center',
            marginVertical: 12,
            borderRadius: 25,
          }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
            }}>
            {t('unblock')}
          </Text>
        </Touchable>
      </>
    </Touchable>
  );
};

export default UserBlockedItem;

const styles = StyleSheet.create({
  lineView: {
    width: SCREEN_WIDTH - 65,
    height: 1,
    marginLeft: 65,
    marginVertical: 7.5,
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
    borderRadius: 40,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  borderView: {
    borderWidth: 1,
  },
});
