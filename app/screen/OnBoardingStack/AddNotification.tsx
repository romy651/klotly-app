/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  OnBoardingStackParamList,
  useAppStackNavigation,
} from '../../routes/screens/Screens.types';
import {OnBoardingScreens, Stack} from '../../routes/screens/Stack';
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {useTranslation} from 'react-i18next';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from '../../components/core/Button/Button';
import {Text} from '../../components/core/Text/Text';
import {fetchUnsplashProfile, uploadAvatar} from 'app/utils/tools';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {registerRequest} from 'app/actions/userAction';
import {useDispatch} from 'react-redux';
import {registerSuccess} from 'app/redux/user/userReducer';
import {Image} from 'react-native';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.AddNotificationScreen
>;

const AddPhotoScreen: React.FC<Props> = ({route}): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const inset = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const appNavigation = useAppStackNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    changeProfile();
  }, []);

  const changeProfile = useCallback(async () => {
    fetchUnsplashProfile(uri => {
      setProfile(uri);
    });
  }, [setProfile]);

  const registerUser = async (): Promise<void> => {
    setLoading(true);
    if (profile.includes('http')) {
      registerRequest(
        firstName,
        lastName,
        email,
        gender,
        languages,
        profile,
        e => {
          Alert.alert(t('error'), t(e) as string);
          setLoading(false);
        },
        u => {
          dispatch(registerSuccess(u));
          setLoading(false);
        },
        password,
      );
    } else {
      uploadAvatar(
        profile,
        email,
        progress => {},
        () => {},
        uri => {
          registerRequest(
            firstName,
            lastName,
            email,
            gender,
            languages,
            uri,
            e => {
              Alert.alert(t('error'), t(e) as string);
              setLoading(false);
            },
            u => {
              dispatch(registerSuccess(u));
              setLoading(false);
            },
            password,
          );
        },
      );
    }

    setLoading(false);
  };

  const chooseImage = () => {
    appNavigation.navigate(Stack.UploadProfileScreen, {
      callback: (uri: string) => {
        console.log('we change the avatar: ', uri);
        setProfile(uri);
      },
    });
  };

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{
          paddingBottom: isAndroid ? 10 : inset.bottom,
        }}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'textPrimary'}
          emphasis={ButtonEmphasis.Background}
          size={ButtonSize.Medium}
          loading={loading}
          style={{borderRadius: 15}}
          onPress={registerUser}>
          {t('complete')}
        </Button>
      </Flex>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['left', 'right', 'top']}>
      <ViewHeader />
      <Flex
        flex={1}
        px={'spacing14'}
        backgroundColor={'background0'}
        style={{paddingBottom: insets.bottom + 100}}>
        <Text
          mt={'spacing10'}
          fontWeight={'bold'}
          color={'textPrimary'}
          variant={'subheadLarge'}>
          {t('allow_notification_desc')}
        </Text>
        <Flex alignItems={'center'} flexDirection={'row'}>
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            width={50}
            height={50}>
            <Image
              source={require('../../assets/images/im1.jpg')}
              style={styles.image}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/images/im2.jpg')}
              style={{
                ...styles.image,
                position: 'absolute',
                right: -10,
              }}
              resizeMode="cover"
            />
          </Flex>
          <Text
            style={{width: SCREEN_WIDTH - 90, marginTop: 0}}
            mt={'spacing10'}
            color={'textPrimary'}
            variant={'bodyLarge'}>
            {t('add_photo_desc2')}
          </Text>
        </Flex>
        <Flex justifyContent={'center'} flex={1} alignItems={'center'}>
          <Touchable onPress={chooseImage}>
            <Flex
              borderWidth={5}
              borderColor={'background3'}
              width={110}
              height={110}
              borderRadius={'rounded8'}
              overflow={'hidden'}>
              <Image source={{uri: profile}} style={styles.profile} />
              <Flex
                width={30}
                height={30}
                borderRadius={'roundedFull'}
                borderWidth={2}
                backgroundColor={'black'}
                borderColor={'white'}
                right={5}
                bottom={5}
                alignItems={'center'}
                justifyContent={'center'}
                position={'absolute'}>
                <Ionicon name="camera" color={'white'} size={16} />
              </Flex>
            </Flex>
          </Touchable>
          <Touchable onPress={changeProfile}>
            <Flex
              borderColor={'textPrimary'}
              borderWidth={1}
              flexDirection={'row'}
              borderRadius={'rounded20'}
              p={'spacing4'}
              px={'spacing8'}>
              <MatComicon
                name="rotate-3d-variant"
                size={18}
                color={theme.colors.textPrimary}
                style={styles.rotate}
              />
              <Text
                mt={'spacing2'}
                variant={'buttonLabelMicro'}
                color={'textPrimary'}>
                {t('random_avatar')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </Flex>
      {footerComponent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  rotate: {marginRight: -10, marginTop: 2},
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  profile: {
    width: '100%',
    height: '100%',
  },
});

export default AddPhotoScreen;
