import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useNavigation} from '@react-navigation/core';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNotif} from 'app/hooks/useNotif';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Flex} from '../layout/Flex';

const NotifIndicator: React.FC = (): JSX.Element => {
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const {notifs} = useNotif();
  const notif = notifs.filter(notif => !notif.seen).length;

  return (
    <View
      style={{
        ...styles.touchable,
        marginRight: 0,
        paddingHorizontal: 14,
        marginLeft: 10,
        backgroundColor:
          notif > 0
            ? theme.colors.accentCriticalSoft
            : theme.colors.background2,
      }}>
      <View style={styles.coinbuttom}>
        <Touchable
          background={Touchable.Ripple(theme.colors.background1, false)}
          onPress={() => navigation.push('NoticeScreen')}>
          <Flex
            height={44}
            alignItems="center"
            justifyContent="center"
            flexDirection="row">
            <Ionicon
              color={theme.colors.textSecondary}
              name={'notifications'}
              size={22}
            />
            {notif > 0 && (
              <Text
                marginLeft={'spacing1'}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodySmall'}>
                {notif > 9 ? '9+' : notif}
              </Text>
            )}
          </Flex>
        </Touchable>
      </View>
    </View>
  );
};

export default NotifIndicator;

const styles = StyleSheet.create({
  touchable: {
    height: 35,
    borderRadius: 45,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBack: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinbuttom: {
    height: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
