/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {useCallback, useState} from 'react';
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
import {emailExist, validateEmail} from 'app/utils/tools';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {languageMap} from 'app/constants/languages';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.SignUpScreen
>;

const SignUpScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const appNavigation = useAppStackNavigation();
  const [email, setEmail] = useState<string>('');
  const [first, setFirst] = useState<string>('');
  const [last, setLast] = useState<string>('');
  const [first_e, setFirst_e] = useState<string>('');
  const [last_e, setLast_e] = useState<string>('');
  const [email_e, setEmail_e] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password_e, setPassword_e] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [secureEntry, setSecureEntry] = useState<boolean>(true);
  const lgs = useAppSelector(state => state.application.appLanguage);
  //@ts-ignore
  const appLanguage = languageMap[lgs].name;
  //console.log('THE LANGUAGE: ', lgs)
  const [languages, setLanguages] = useState<string[]>([appLanguage]);
  const [gender, setGender] = useState<'man' | 'woman' | 'other'>('man');

  const isInfoCorret =
    first.length >= 3 &&
    last.length >= 3 &&
    validateEmail(email) &&
    password.length >= 5;

  const registerUser = async (): Promise<void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!isInfoCorret) {
      if (first.trim().length < 2) {
        setFirst_e(t('thwo_char_req') as string);
      } else {
        setFirst_e('');
      }
      if (last.trim().length < 2) {
        setLast_e(t('thwo_char_req') as string);
      } else {
        setLast_e('');
      }
      if (!validateEmail(email)) {
        setEmail_e(t('email_error') as string);
      } else {
        setEmail_e('');
      }
      if (password.length < 5) {
        setPassword_e(t('password_error') as string);
      } else {
        setPassword_e('');
      }
      setLoading(false);
      return;
    } else {
      setFirst_e('');
      setLast_e('');
      setPassword_e('');
      setEmail_e('');
    }
    const exists = await emailExist(email);
    if (exists) {
      Alert.alert(t('error'), t('email_exists') as string);
      setLoading(false);
      return;
    }
    setLoading(false);
    navigation.navigate(OnBoardingScreens.AddPhotoScreen, {
      firstName: first,
      lastName: last,
      email,
      gender,
      languages,
      password,
    });
  };
  const chooseLanguage = () => {
    appNavigation.navigate(Stack.OnBoardingStack, {
      screen: OnBoardingScreens.LanguagesScreen,
      params: {
        languages: languages,
        callback: lang => {
          setLanguages(lang);
        },
      },
    });
  };

  const renderGenderItem = useCallback(
    ({item}: {item: 'man' | 'woman' | 'other'}) => (
      <Touchable onPress={() => setGender(item)}>
        <Flex
          height={40}
          px={'spacing14'}
          gap={'spacing10'}
          backgroundColor={item === gender ? 'background2' : 'background0'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'row'}
          borderColor={item === gender ? 'textPrimary' : 'background3'}
          borderWidth={1.5}>
          <MatComicon
            size={18}
            color={theme.colors.textSecondary}
            name={
              item === 'man'
                ? 'gender-male'
                : item === 'woman'
                ? 'gender-female'
                : 'gender-transgender'
            }
          />
          <Text
            color={item === gender ? 'textPrimary' : 'textSecondary'}
            variant={'bodySmall'}>
            {t(item)}
          </Text>
        </Flex>
      </Touchable>
    ),
    [gender],
  );

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        pt={'spacing10'}
        pb={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        width="100%">
        <Button
          backgroundColor={'textPrimary'}
          emphasis={ButtonEmphasis.Background}
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
    <Screen
      backgroundColor={'background2'}
      edges={['left', 'right', 'top', 'bottom']}>
      <ViewHeader showBorder showBackButton title={t('sign_up') as string} />
      <KeyboardAwareScrollView
        style={{backgroundColor: theme.colors.background0}}
        contentContainerStyle={{flex: 1}}>
        <Flex gap="none" marginTop="spacing18" px="spacing14">
          <Flex mt={'spacing2'}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('firstName')}
              </Text>
              {first_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {first_e}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex style={{marginTop: -10}}>
              <TextInput
                outline
                error={first_e.length > 0 ? first_e : undefined}
                autoComplete="name"
                color={'textPrimary'}
                placeholder={`${t('your_firstname')}...`}
                keyboardType="default"
                style={{color: theme.colors.textPrimary}}
                value={first}
                onBlur={(): void => {}}
                onChangeText={setFirst}
              />
              <Flex
                flexDirection={'row'}
                position={'absolute'}
                right={0}
                top={5}>
                {first.length > 0 && (
                  <TouchableIcon
                    size={20}
                    Component={Ionicon}
                    action={() => setFirst('')}
                    color={theme.colors.textSecondary}
                    name="close-circle-sharp"
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={'spacing4'}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('lastName')}
              </Text>
              {last_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {last_e}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex style={{marginTop: -10}}>
              <TextInput
                outline
                error={last_e.length > 0 ? last_e : undefined}
                autoComplete="name"
                color={'textPrimary'}
                placeholder={`${t('your_lastname')}...`}
                keyboardType="default"
                style={{color: theme.colors.textPrimary}}
                value={last}
                onBlur={(): void => {}}
                onChangeText={setLast}
              />
              <Flex
                flexDirection={'row'}
                position={'absolute'}
                right={0}
                top={5}>
                {last.length > 0 && (
                  <TouchableIcon
                    size={20}
                    Component={Ionicon}
                    action={() => setLast('')}
                    color={theme.colors.textSecondary}
                    name="close-circle-sharp"
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={'spacing4'}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('email')}
              </Text>
              {email_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {email_e}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex style={{marginTop: -10}}>
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
              <Flex
                flexDirection={'row'}
                position={'absolute'}
                right={0}
                top={5}>
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
          </Flex>
          <Flex mt={'spacing4'}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('password')}
              </Text>
              {password_e.length > 0 && (
                <Flex alignSelf="flex-start" justifyContent="flex-start">
                  <Text color="accentCritical" variant="bodyMicro">
                    {password_e}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex style={{marginTop: -10}}>
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
              <Flex
                flexDirection={'row'}
                position={'absolute'}
                right={5}
                top={5}>
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
          <Flex
            width={'100%'}
            height={45}
            borderRadius={'rounded8'}
            borderWidth={1.5}
            flexDirection={'row'}
            alignItems={'center'}
            px={'spacing10'}
            justifyContent={'space-between'}
            borderColor={'background3'}>
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {t('ispeak')}
            </Text>
            <Touchable onPress={chooseLanguage}>
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Text variant={'subheadSmall'} color={'textPrimary'}>
                  {languages.join(', ')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  color={theme.colors.textPrimary}
                  size={22}
                  style={styles.chevronRight}
                />
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            alignItems={'center'}
            mt={'spacing20'}
            justifyContent={'space-between'}
            flexDirection={'row'}>
            <Text color={'textPrimary'} variant={'buttonLabelSmall'}>
              {t('Iam')}
            </Text>
            <Text color={'textSecondary'} variant={'bodyMicro'}>
              {t('gender_desc')}
            </Text>
          </Flex>
          <Flex
            mt={'spacing10'}
            flexDirection={'row'}
            justifyContent={'flex-start'}>
            {renderGenderItem({item: 'man'})}
            {renderGenderItem({item: 'woman'})}
            {renderGenderItem({item: 'other'})}
          </Flex>
        </Flex>
      </KeyboardAwareScrollView>
      {footerComponent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  chevronRight: {marginLeft: -15, marginRight: -8},
});

export default SignUpScreen;
