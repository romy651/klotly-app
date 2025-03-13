import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Alert, View} from 'react-native';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import CountryFlag from 'react-native-country-flag';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import InstagramStories from 'app/components/StoryView';
import {uploadImage, uploadVideo} from 'app/utils/tools';
import {useDispatch} from 'react-redux';
import {updateUserInfo} from 'app/actions/userAction';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {ImageOrVideo, Video} from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CoinIndicator from 'app/components/Coin/CoinIndicator';
import {useUser} from 'app/hooks/useUser';
import GiftTab from './Components/GiftTab';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.AccountScreen
>;

const AccountScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const {user, getFollowers} = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [followerCount, setFollowerCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const _ = await getFollowers();
      setFollowerCount(_.length);
    })();
  }, []);

  const totalgifts = useCallback(() => {
    return (
      Object.keys(user.gifts || ([] as any)).reduce(
        (acc: any, elt: any) => acc + ((user.gifts as any) || [])[elt],
        0,
      ) || 0
    );
  }, [user]);

  const onShowImage = (index: number) => {
    console.log('NOW WE MOVE');
    navigation?.push(Stack.GalleryScreen, {
      index: index,
      photos: user.photos,
    });
  };

  const Header = () => {
    return (
      <Flex backgroundColor={'background0'} borderBottomWidth={1}>
        <Flex
          backgroundColor={'background0'}
          flexDirection={'row'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          style={styles.header}>
          <Flex style={styles.avatarFlex}>
            <FastImage
              source={{uri: user.avatar, cache: 'immutable'}}
              style={styles.avatar}
            />
            <Flex backgroundColor={'accentSuccess'} style={styles.dot} />
          </Flex>
          <Flex backgroundColor={'background0'}>
            <Flex flexDirection={'row'}>
              <Text
                fontWeight={'bold'}
                style={{marginLeft: -8}}
                color={'textPrimary'}
                variant={'subheadLarge'}>
                {user.firstName}
              </Text>
              <MatIcon
                selectionColor={'white'}
                name={'verified'}
                style={{marginTop: 3, marginLeft: -10}}
                size={20}
                color={theme.colors.accentActive}
              />
            </Flex>
            <Text
              style={styles.normalText}
              color={'textPrimary'}
              variant={'bodySmall'}>
              {(user.age || 24) +
                ', ' +
                t(user.gender) +
                ', ' +
                user.country +
                ' '}
              <CountryFlag
                isoCode={user.country}
                size={12}
                style={{marginTop: 2, borderRadius: 2}}
              />
            </Text>
            <Flex
              mt={'spacing10'}
              style={{marginLeft: -10}}
              flexDirection={'row'}>
              <Text
                onPress={() =>
                  (user.following?.length || 0) > 0
                    ? navigation.navigate(Stack.FollowScreen, {
                        userId: user.id,
                        type: 'following',
                      })
                    : {}
                }
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodySmall'}>
                {t('following')}: {(user.following || []).length}
              </Text>
              <Text
                onPress={() =>
                  (followerCount || 0) > 0
                    ? navigation.navigate(Stack.FollowScreen, {
                        userId: user.id,
                        type: 'followers',
                      })
                    : {}
                }
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodySmall'}>
                {t('followers')}: {followerCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {(user.stories || []).length > 0 && (
          <View
            style={{
              paddingBottom: 15,
              backgroundColor: theme.colors.background0,
            }}>
            <InstagramStories
              modalAnimationDuration={500}
              textStyle={{color: 'white'}}
              closeIconColor="white"
              avatarSize={50}
              stories={(user.stories || []).map((elt, id) => {
                return {
                  id: 'story' + id,
                  imgUrl: elt.thumbnail as string,
                  name: user.firstName,
                  stories: [
                    {
                      id: 'story' + id,
                      source: {uri: elt.url},
                      mediaType: 'video',
                      sourceUrl: elt.url,
                    },
                  ],
                };
              })}
            />
          </View>
        )}
      </Flex>
    );
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

  const add_media = () => {
    if (loading) {
      return;
    }
    navigation?.push(Stack.UploadMediaScreen, {
      callback: async (asset: ImageOrVideo, type) => {
        if (type == 'image') {
          setLoading(true);
          uploadImage(
            asset.path as string,
            user.id,
            () => {},
            () => {},
            uri => {
              const res = {...user, photos: [uri, ...user.photos]};
              updateUserInfo(res, dispatch, setLoading);
            },
          );
        } else {
          const video = asset as Video;
          console.log('now we try to get the duration: ', video.duration);
          if ((video.duration as number) > 30000) {
            Alert.alert('Error', 'Video must be less than 30 seconds');
            return;
          }
          console.log('the video duration: ', video.path);
          setLoading(true);
          uploadVideo(
            video.path as string,
            user.id,
            () => {},
            () => {
              Alert.alert('Error', 'Error uploading video');
              setLoading(false);
            },
            (url, thumbnail) => {
              const res = {
                ...user,
                stories: [{thumbnail, url}, ...(user.stories || [])],
              };
              updateUserInfo(res, dispatch, setLoading);
            },
          );
        }
      },
    });
  };

  const renderMedia = useCallback(
    ({item, index}: {item: any; index: number}) => {
      return (
        <Touchable
          onPress={() => (item == '' ? add_media() : onShowImage(index - 1))}>
          {item !== '' ? (
            <Flex
              style={{
                ...styles.photoView,
                marginRight: (index + 1) % 3 == 0 ? 0 : 4,
              }}>
              <FastImage
                style={{width: '100%', height: '100%'}}
                source={{uri: item, cache: 'immutable'}}
              />
            </Flex>
          ) : (
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
          )}
        </Touchable>
      );
    },
    [loading],
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

  return (
    <Screen backgroundColor={'background3'} edges={['bottom', 'top']} flex={1}>
      <View
        style={{
          ...styles.headerView,
          backgroundColor: theme.colors.background3,
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
            action={() => {}}
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
        <Flex
          backgroundColor={'background0'}
          overflow={'hidden'}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}>
          <Tabs.Container
            snapThreshold={0.3}
            renderTabBar={tabBar}
            renderHeader={Header}>
            <Tabs.Tab name={t('gallery')}>
              <Tabs.FlatList
                data={['', ...user.photos]}
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
    </Screen>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
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
  normalText: {marginVertical: -12, marginLeft: -10},
  avatarFlex: {width: 80, height: 80, borderRadius: 40, marginHorizontal: 10},
  avatar: {width: '100%', height: '100%', borderRadius: 40},
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    position: 'absolute',
    bottom: 5,
    right: 5,
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
