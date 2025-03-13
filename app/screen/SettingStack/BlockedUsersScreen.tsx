import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  Switch,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {fecth_user} from 'app/utils/tools';
import {updateUserSuccess, UserInfo} from 'app/redux/user/userReducer';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import UserBlockedItem from 'app/components/UserMessageItem/UserBlockedItem';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ViewHeader} from 'app/components/Util/ViewHeader';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.BlockedUsersScreen
>;

const BlockedUsersScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const me = useAppSelector(state => state.user);
  const users_ids = useAppSelector(state => state.user.blocked_users);
  const [users, setUsers] = React.useState<UserInfo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    fetchUserList(users_ids || []);
  }, []);

  const fetchUserList = async (uids: string[]) => {
    const users = await Promise.all(uids.map(uid => fecth_user(uid)));
    setLoading(false);
    setUsers(users);
  };

  const onUnblock = (uid: string) => {
    const list = (users_ids || []).filter(id => id !== uid);
    dispatch(updateUserSuccess({...me, blocked_users: list}));
    setUsers(users.filter(user => user.id !== uid));
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const renderItem = useCallback(
    ({item, index}: {item: UserInfo; index: number}) => {
      return (
        <UserBlockedItem
          key={index}
          unBlockUser={() => onUnblock(item.id)}
          otheruser={item}
        />
      );
    },
    [],
  );

  const renderEmtpyComponent = useCallback(() => {
    return (
      <Flex style={styles.loadingFlex}>
        <MatComIcon
          name="account-cancel-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text variant={'bodyLarge'} color={'textSecondary'}>
          {t('no_blocked_users')}
        </Text>
      </Flex>
    );
  }, []);

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('blocked_users') as string}
        showBackButton
        showBorder
      />
      {loading && (
        <Flex style={styles.loadingFlex}>
          <CircularActivityIndicator
            size={60}
            color={theme.colors.accentSuccess}
          />
        </Flex>
      )}
      <FlatList
        style={{backgroundColor: theme.colors.background0}}
        ListEmptyComponent={renderEmtpyComponent}
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingFlex: {
    height: SCREEN_HEIGHT - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 10,
    paddingLeft: 15,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});

export default BlockedUsersScreen;
