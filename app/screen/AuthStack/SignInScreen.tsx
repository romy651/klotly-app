/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {useState} from 'react';
import {Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import TextInput from '../../components/core/Input/TextInput';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {useTranslation} from 'react-i18next';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from '../../components/core/Button/Button';
import {Text} from '../../components/core/Text/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validateEmail} from 'app/utils/tools';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {signInRequest} from 'app/actions/userAction';
import {useDispatch} from 'react-redux';
import {loginSuccess} from 'app/redux/user/userReducer';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.SignInScreen
>;

const SignInScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [email_e, setEmail_e] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password_e, setPassword_e] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [secureEntry, setSecureEntry] = useState<boolean>(true);
  const dispatch = useDispatch();

  const isInfoCorret = validateEmail(email) && password.length > 5;

  const registerUser = async (): Promise<void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!isInfoCorret) {
      if (!validateEmail(email)) {
        setEmail_e(t('email_error') as string);
      } else {
        setEmail_e('');
      }
      if (password.length == 0) {
        setPassword_e(t('enter_password') as string);
      } else {
        setPassword_e('');
      }
      setLoading(false);
      return;
    } else {
      setPassword_e('');
      setEmail_e('');
    }
    console.log('we start the sign in');
    signInRequest(
      email,
      password,
      e => {
        Alert.alert(t('error'), t(e) as string);
        setLoading(false);
      },
      u => {
        console.log('it is good');
        dispatch(loginSuccess(u));
        setLoading(false);
      },
    );
  };

  const onForgot = () => {
    navigation.navigate(OnBoardingScreens.ForgotPassword);
  };

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          loading={loading}
          style={{borderRadius: 15}}
          onPress={registerUser}>
          {t('continue')}
        </Button>
      </Flex>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['left', 'right', 'top']}>
      <ViewHeader showBorder showBackButton title={t('sign_in') as string} />
      <KeyboardAwareScrollView
        style={{backgroundColor: theme.colors.background0}}
        contentContainerStyle={{flex: 1}}>
        <Flex gap="none" marginTop="spacing18" px="spacing14">
          <Flex mt={'spacing4'}>
            <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
              {t('email')}
            </Text>
            <Flex gap={'spacing4'} style={{marginTop: -10}}>
              <TextInput
                outline
                error={email_e.length > 0 ? email_e : undefined}
                autoComplete="name"
                color={'textPrimary'}
                autoCapitalize="none"
                placeholder={`${t('your_email')}...`}
                style={{color: theme.colors.textPrimary}}
                value={email}
                keyboardType="email-address"
                onBlur={(): void => {}}
                onChangeText={setEmail}
              />
              {email_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {email_e}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex
              flexDirection={'row'}
              position={'absolute'}
              right={-5}
              top={28}>
              {email.length > 0 && (
                <TouchableIcon
                  size={20}
                  Component={Ionicon}
                  action={() => setEmail('')}
                  color={theme.colors.textSecondary}
                  name="close-circle-sharp"
                />
              )}
            </Flex>
          </Flex>
          <Flex mt={'spacing4'}>
            <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
              {t('password')}
            </Text>
            <Flex
              gap={'spacing4'}
              alignItems={'center'}
              style={{marginTop: -10}}>
              <TextInput
                outline
                autoComplete="name"
                color={'textPrimary'}
                error={password_e.length > 0 ? password_e : undefined}
                placeholder={`${t('your_password')}...`}
                style={{color: theme.colors.textPrimary}}
                value={password}
                secureTextEntry={secureEntry}
                onBlur={(): void => {}}
                onChangeText={setPassword}
              />
              {password_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {password_e}
                  </Text>
                </Flex>
              )}
              <Flex
                top={5}
                flexDirection={'row'}
                position={'absolute'}
                right={5}>
                <TouchableIcon
                  size={20}
                  Component={Feather}
                  action={() => setSecureEntry(!secureEntry)}
                  color={theme.colors.textSecondary}
                  name={secureEntry ? 'eye' : 'eye-off'}
                />
              </Flex>
            </Flex>
          </Flex>
          <Text
            onPress={onForgot}
            textAlign={'center'}
            mt={'spacing36'}
            variant={'buttonLabelSmall'}
            textDecorationLine={'underline'}
            color={'textPrimary'}>
            {t('forgot_my_password')}
          </Text>
        </Flex>
      </KeyboardAwareScrollView>
      {footerComponent()}
    </Screen>
  );
};

export default SignInScreen;
