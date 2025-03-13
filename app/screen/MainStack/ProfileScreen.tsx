import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {HomeStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Platform, StyleSheet} from 'react-native';
import {Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import {updateUserSuccess, UserInfo} from 'app/redux/user/userReducer';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {fecth_user} from 'app/utils/tools';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {ActivityIndicator} from 'react-native-paper';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {useUser} from 'app/hooks/useUser';
import GiftTab from './Components/GiftTab';
import ResumeTab from './Components/ResumeTab';
import Animated from 'react-native-reanimated';
import Header from './Components/Header';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.ProfileScreen
>;

const ProfileScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  //@ts-ignore
  const {t} = useTranslation();
  const {followUser} = useUser();
  const me = useAppSelector(state => state.user);
  const [user, setUser] = useState<UserInfo>();
  const __user = route.params.user;
  const [loading, setLoading] = useState<boolean>(true);

  const totalgifts = useCallback(() => {
    if (!user) {
      return 0;
    }
    return (
      Object.keys(user.gifts || ([] as any)).reduce(
        (acc: any, elt: any) => acc + ((user.gifts as any) || [])[elt],
        0,
      ) || 0
    );
  }, [user]);

  useEffect(() => {
    (async () => {
      console.log('ID', route.params.id);
      const _user = __user ? __user : await fecth_user(route.params.id);
      if (_user.isDeleted || false) {
        navigation.goBack();
      }
      setUser(_user);
      setLoading(false);
    })();
  }, [__user, route.params.id, navigation]);

  const onBlock = () => {
    if (me.blocked_users?.includes(route.params.id)) {
      dispatch(
        updateUserSuccess({
          ...me,
          blocked_users: me.blocked_users?.filter(id => id !== route.params.id),
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
                blocked_users: [...(me.blocked_users || []), route.params.id],
              }),
            );
            navigation.goBack();
          },
        },
        {text: t('cancel') as string, style: 'cancel'},
      ]);
    }
  };

  const onShowImage = (index: number) => {
    if (!user) {
      return;
    }
    console.log('NOW WE MOVE');
    navigation?.push(Stack.GalleryScreen, {
      index: index,
      photos: user.photos,
    });
  };

  const onReport = () => {
    if (!user) {
      return;
    }
    navigation?.push(HomeStackScreens.ReportScreen, {user, type: 'user'});
  };

  const tabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      labelStyle={{textTransform: 'capitalize'}}
      indicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      inactiveColor={theme.colors.textSecondary}
      activeColor={theme.colors.textPrimary}
      style={{backgroundColor: theme.colors.background0}}
    />
  );

  const renderMedia = ({item, index}: {item: any; index: number}) => (
    <Touchable onPress={() => onShowImage(index)}>
      <Flex
        style={{
          ...styles.photoView,
          marginRight: (index + 1) % 3 === 0 ? 0 : 4,
        }}>
        <Animated.Image
          style={{width: '100%', height: '100%'}}
          source={{uri: item}}
        />
      </Flex>
    </Touchable>
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']} flex={1}>
      <ViewHeader
        showBackButton
        showBorder
        onShowMore={[
          {
            title: (me.following || []).includes(user?.id || '')
              ? t('unfollow')
              : t('follow'),
            action: () => {
              console.log('follow');
            },
            systemIcon: Platform.OS == 'ios' ? 'person.badge.plus' : 'btn_plus',
          },
          {
            title: me.blocked_users?.includes(route.params.id)
              ? t('unblock')
              : t('block'),
            action: onBlock,
            systemIcon: Platform.OS == 'ios' ? 'person.slash' : 'btn_minus',
          },
          {
            title: t('report'),
            action: onReport,
            systemIcon:
              Platform.OS == 'ios'
                ? 'exclamationmark.triangle'
                : 'stat_sys_warning',
          },
          {
            title: t('cancel'),
            action: () => {},
            destructive: true,
          },
        ]}
        iconList={[
          {IconName: 'alert-decagram-outline', action: onReport, size: 24},
        ]}
      />
      {loading || !user ? (
        <Flex
          flex={1}
          alignItems={'center'}
          justifyContent={'center'}
          pb={'spacing90'}
          backgroundColor={'background0'}>
          <ActivityIndicator size={'large'} />
        </Flex>
      ) : (
        <>
          <Flex backgroundColor={'background0'} overflow={'hidden'} flex={1}>
            <Tabs.Container
              snapThreshold={0.3}
              pagerProps={{scrollEnabled: false}}
              renderTabBar={tabBar}
              renderHeader={() => (
                <Header followUser={followUser} user={user} />
              )}>
              <Tabs.Tab name={t('my_resume')}>
                {<ResumeTab me={false} user={user} />}
              </Tabs.Tab>
              <Tabs.Tab name={t('gallery')}>
                <Tabs.FlatList
                  data={[...user.photos]}
                  numColumns={3}
                  renderItem={renderMedia}
                  keyExtractor={item => item}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingHorizontal: 4}}
                />
              </Tabs.Tab>
              <Tabs.Tab name={t(`${t('gifts')} (${totalgifts()})`)}>
                {<GiftTab user={user} />}
              </Tabs.Tab>
            </Tabs.Container>
          </Flex>
        </>
      )}
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  normalText: {},
  avatarFlex: {width: 70, height: 70, borderRadius: 5},
  avatar: {width: '100%', height: '100%', borderRadius: 5},
  dot: {
    width: 15,
    height: 15,
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderRadius: 3,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterView: {
    paddingHorizontal: 5,
    width: '100%',
    height: 30,
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoView: {
    width: (SCREEN_WIDTH - 16) / 3,
    height: (SCREEN_WIDTH - 16) / 3,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  flag: {
    borderRadius: 2,
    marginLeft: -10,
    marginBottom: 1,
  },
});
