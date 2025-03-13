import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Alert, View} from 'react-native';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {uploadImage} from 'app/utils/tools';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import FastImage from 'react-native-fast-image';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CoinIndicator from 'app/components/Coin/CoinIndicator';
import {useUser} from 'app/hooks/useUser';
import GiftTab from './Components/GiftTab';
import ResumeTab from './Components/ResumeTab';
import ContextMenu from 'react-native-context-menu-view';
import Header from './Components/Header';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'app/hooks/state/useAppSelector';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.AccountScreen
>;

const AccountScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const {user, deleteMedia, updateInfo} = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const me = useAppSelector(state => state.user);

  const totalgifts = useCallback(() => {
    return (
      Object.keys(user.gifts || ([] as any)).reduce(
        (acc: any, elt: any) => acc + ((user.gifts as any) || [])[elt],
        0,
      ) || 0
    );
  }, [user]);

  const onShowImage = useCallback(
    (index: number) => {
      console.log('NOW WE MOVE');
      navigation?.push(Stack.GalleryScreen, {
        index: index,
        photos: user.photos,
      });
    },
    [navigation, user.photos],
  );

  const createTutor = () => {
    navigation.navigate(Stack.OnboardMentorMain);
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

  const add_media = useCallback(() => {
    if (loading) {
      return;
    }
    navigation?.push(Stack.UploadMediaScreen, {
      callback: async (asset: string, type) => {
        if (type === 'image' && asset) {
          setLoading(true);
          uploadImage(
            asset,
            user.id,
            () => {},
            () => {},
            async uri => {
              const res = {...user, photos: [uri, ...user.photos]};
              setLoading(true);
              await updateInfo(res);
              setLoading(false);
            },
          );
        }
      },
    });
  }, [loading, navigation, user, updateInfo]);

  const renderMedia = useCallback(
    ({item, index}: {item: any; index: number}) => {
      const actions = (_: string) => [
        {
          title: t('delete'),
          systemIcon: 'trash',
          destructive: true,
          action: () => _deleteMedia(_),
        },
      ];

      const _deleteMedia = async (_: string) => {
        console.log('delete media: ', _);
        Alert.alert(t('delete'), t('delete_photo') as string, [
          {
            text: t('cancel') as string,
            style: 'cancel',
          },
          {
            text: t('yes') as string,
            style: 'destructive',
            onPress: async () => {
              await deleteMedia(_);
            },
          },
        ]);
      };

      return item !== '' ? (
        <View>
          <Touchable onPress={() => onShowImage(index - 1)}>
            <View
              style={{
                ...styles.photoView,
                marginRight: (index + 1) % 3 == 0 ? 0 : 4,
              }}>
              <FastImage
                style={{width: '100%', height: '100%'}}
                source={{uri: item, cache: 'immutable'}}
              />
            </View>
          </Touchable>
          <View style={styles.moreOptions}>
            <ContextMenu
              onPress={e => actions(item)[e.nativeEvent.index]?.action()}
              dropdownMenuMode
              actions={actions(item)}>
              <FeatherIcon name="more-horizontal" size={18} color={'white'} />
            </ContextMenu>
          </View>
        </View>
      ) : (
        <Touchable onPress={add_media}>
          <Flex
            style={{
              ...styles.photoView,
              marginRight: (index + 1) % 3 == 0 ? 0 : 4,
              backgroundColor: theme.colors.background2,
            }}>
            {loading ? (
              <CircularActivityIndicator
                color={theme.colors.accentAction}
                size={24}
              />
            ) : (
              <MatIcon
                name="add"
                size={38}
                color={theme.colors.textSecondary}
              />
            )}
          </Flex>
        </Touchable>
      );
    },
    [
      loading,
      add_media,
      onShowImage,
      theme.colors.accentAction,
      theme.colors.background2,
      theme.colors.textSecondary,
      deleteMedia,
      t,
    ],
  );

  const editProfile = () => {
    navigation?.push(LibraryStackScreens.EditProfileScreen, {
      callback: () => {
        //refreshUserInfo(user.id, dispatch)
      },
    });
  };

  const onSetting = () => {
    navigation?.push(Stack.SettingScreen);
  };

  const Resume = useMemo(() => {
    return <ResumeTab user={me} />;
  }, [me]);

  const Gift = useMemo(() => {
    return <GiftTab user={me} />;
  }, [me]);

  const Gallery = useMemo(
    () => (
      <Tabs.FlatList
        data={['', ...user.photos]}
        numColumns={3}
        renderItem={renderMedia}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 4}}
      />
    ),
    [user, renderMedia],
  );

  const renderHeader = useCallback(() => {
    return <Header user={me} />;
  }, [me]);

  return (
    <Screen backgroundColor={'background2'} edges={['top']} flex={1}>
      <View
        style={{
          ...styles.headerView,
          backgroundColor: theme.colors.background2,
          borderBottomColor: theme.colors.background2,
        }}>
        <Flex flexDirection={'row'}>
          <TouchableIcon
            Component={Ionicon}
            name="settings-outline"
            size={24}
            color={theme.colors.textPrimary}
            action={onSetting}
          />
          <CoinIndicator />
        </Flex>
        <Flex flexDirection={'row'}>
          <TouchableIcon
            Component={MatComIcon}
            name="share-variant-outline"
            action={createTutor}
            size={24}
            color={theme.colors.textSecondary}
          />
          <TouchableIcon
            Component={MatComIcon}
            name="square-edit-outline"
            action={editProfile}
            size={24}
            color={theme.colors.textSecondary}
          />
        </Flex>
      </View>
      <>
        <Flex backgroundColor={'background0'} overflow={'hidden'} flex={1}>
          <Tabs.Container
            containerStyle={{paddingBottom: 60}}
            pagerProps={{scrollEnabled: false}}
            renderTabBar={tabBar}
            renderHeader={renderHeader}>
            <Tabs.Tab name={t('my_resume')}>{Resume}</Tabs.Tab>
            <Tabs.Tab name={t('gallery')}>{Gallery}</Tabs.Tab>
            <Tabs.Tab name={t(`${t('gifts')} (${totalgifts()})`)}>
              {Gift}
            </Tabs.Tab>
          </Tabs.Container>
        </Flex>
      </>
    </Screen>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  moreOptions: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 7,
    borderRadius: 5,
  },
  btnBack: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinbuttom: {
    width: 80,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchalbe: {
    height: 40,
    width: 40,
    borderRadius: 45,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 10,
  },
  flag: {
    borderRadius: 2,
    marginLeft: -10,
    marginBottom: 1,
  },
  normalText: {},
  avatarFlex: {width: 70, height: 70, borderRadius: 5, marginLeft: 5},
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
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
