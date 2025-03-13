/**
 * @Project Summarised
 * @File LandingScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import {useTranslation} from 'react-i18next';
import {Platform, TouchableNativeFeedback as Touchable} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Image from 'app/components/core/Image/Image';
import {Alert, Appearance} from 'react-native';
import {openUri} from 'app/utils/linking';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {loginSuccess, UserInfo} from 'app/redux/user/userReducer';
import appleAuth from '@invertase/react-native-apple-authentication';
import {isAndroid, isIos} from 'app/utils/PlatformUtils';
type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.HomeSignUpScreen
>;

const HomeSignUpScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const onSignIn = () => {
    navigation.replace(OnBoardingScreens.HomeSignInScreen);
  };

  const withEmail = () => {
    navigation.navigate(OnBoardingScreens.SignUpScreen);
  };

  const onGoogleLogin = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('now we got the credentials: ', googleCredential);
      await auth()
        .signInWithCredential(googleCredential)
        .then(async user => {
          if (user.additionalUserInfo && user.additionalUserInfo.isNewUser) {
            console.log('2 the user is news: ', user);
            navigation.navigate(OnBoardingScreens.UpdateProfile, {
              email: user.user.email as string,
              firstName: user.user.displayName?.split(' ')[0] || '',
              lastName: user.user.displayName?.split(' ')[1] || '',
              avatar: user.user.photoURL as string,
            });
          } else {
            console.log('2 the user is not new');
            const req = await firestore()
              .collection('users')
              .where('email', '==', user.user.email)
              .get();
            const data = req.docs[0]?.data() as UserInfo;
            dispatch(loginSuccess(data));
          }
        })
        .catch(err => {
          Alert.alert(t('error'), t('error_try_later') as string);
          console.log('there is an error: ', err);
        });
    } catch (error) {
      Alert.alert(t('error'), t('error_try_later') as string);
      console.log('Google sign-in error:', error);
    }
  };

  const onAppleSignIn = async () => {
    console.log('now we start');
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log('we got the response');
      if (!appleAuthRequestResponse.identityToken) {
        console.log('there is error');
        Alert.alert(t('error!'), t('apple_signin_error') as string);
        throw 'Apple Sign-In failed - no identify token returned';
      } else {
        const {identityToken, nonce} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );
        console.log('now we signin with firebase with: ', appleCredential);
        // Sign the user in with the credential
        await auth()
          .signInWithCredential(appleCredential)
          .then(async user => {
            if (user.additionalUserInfo && user.additionalUserInfo.isNewUser) {
              console.log('2 the user is news: ', user);
              navigation.navigate(OnBoardingScreens.UpdateProfile, {
                email: user.user.email as string,
                firstName: user.user.displayName?.split(' ')[0] || '',
                lastName: user.user.displayName?.split(' ')[1] || '',
                avatar: user.user.photoURL as string,
              });
            } else {
              console.log('2 the user is not new');
              const req = await firestore()
                .collection('users')
                .where('email', '==', user.user.email)
                .get();
              const data = req.docs[0]?.data() as UserInfo;
              dispatch(loginSuccess(data));
            }
          })
          .catch(err => {
            Alert.alert(t('error'), t('error_try_later') as string);
            console.log('there is an error: ', err);
          });
      }
    } catch (e) {
      Alert.alert(t('error'), t('error_try_later') as string);
      console.log('THERE IS AN ERROR: ', e);
    }
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <Flex
        ml={'spacing10'}
        backgroundColor={'background2'}
        height={50}
        width={'100%'}>
        <TouchableIcon
          Component={Ionicon}
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          color={theme.colors.textPrimary}
          action={navigation.goBack}
          size={24}
        />
      </Flex>
      <Flex
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        px={'spacing10'}
        pt={'spacing18'}
        flex={1}
        backgroundColor={'background0'}>
        <Flex gap={'spacing10'}>
          <Text
            fontWeight={'bold'}
            color={'textPrimary'}
            variant={'headlineSmall'}>
            {t('signup_desc1')}
          </Text>
          <Text color={'textPrimary'} variant={'bodySmall'}>
            {t('signup_desc2')}
          </Text>
          <Touchable onPress={withEmail}>
            <Flex
              mt={'spacing36'}
              flexDirection={'row'}
              height={45}
              borderWidth={1.5}
              gap={'spacing10'}
              justifyContent={'center'}
              alignItems={'center'}
              borderColor={'textPrimary'}
              borderRadius={'rounded8'}>
              <MatIcon
                name="alternate-email"
                color={theme.colors.textPrimary}
                size={20}
              />
              <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                {t('signup_email')}
              </Text>
            </Flex>
          </Touchable>
          {isIos && (
            <Touchable onPress={onAppleSignIn}>
              <Flex
                flexDirection={'row'}
                height={45}
                borderWidth={1.5}
                gap={'spacing10'}
                justifyContent={'center'}
                alignItems={'center'}
                borderColor={'textPrimary'}
                borderRadius={'rounded8'}>
                {isDarkMode ? (
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/images/apple.png')}
                    style={{width: 18, height: 18, marginBottom: 4}}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/images/apple_dark.png')}
                    style={{width: 22, height: 22, marginBottom: 4}}
                  />
                )}
                <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                  {t('signup_apple')}
                </Text>
              </Flex>
            </Touchable>
          )}
          <Touchable onPress={onGoogleLogin}>
            <Flex
              flexDirection={'row'}
              height={45}
              borderWidth={1.5}
              gap={'spacing10'}
              justifyContent={'center'}
              alignItems={'center'}
              borderColor={'textPrimary'}
              borderRadius={'rounded8'}>
              <Image
                source={require('../../assets/images/google.png')}
                style={{width: 18, height: 18}}
              />
              <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
                {t('signup_google')}
              </Text>
            </Flex>
          </Touchable>
          <Text
            onPress={onSignIn}
            textAlign={'center'}
            mt={'spacing36'}
            variant={'buttonLabelSmall'}
            textDecorationLine={'underline'}
            color={'textPrimary'}>
            {t('signin_account')}
          </Text>
        </Flex>
        <Flex mb={'spacing10'} style={{marginTop: 'auto'}}>
          <Text
            color="textTertiary"
            mx="spacing4"
            textAlign="center"
            variant="buttonLabelMicro">
            {t('Landing.IAgree')}{' '}
            <Text
              color={isDarkMode ? 'accentActive' : 'accentAction'}
              variant="buttonLabelMicro"
              onPress={(): Promise<void> => openUri('https://google.com')}>
              {t('TermsOfService')}{' '}
            </Text>
            {t('TermsOfService.Consent')}{' '}
            <Text
              color={isDarkMode ? 'accentActive' : 'accentAction'}
              variant="buttonLabelMicro"
              onPress={(): Promise<void> => openUri('https://google.com')}>
              {t('Privacy.Policy')}
            </Text>
            .
          </Text>
        </Flex>
      </Flex>
    </Screen>
  );
};

export default HomeSignUpScreen;
