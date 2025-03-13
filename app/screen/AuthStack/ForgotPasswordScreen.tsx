/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import TextInput from '../../components/core/Input/TextInput';
import {useTranslation} from 'react-i18next';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from '../../components/core/Button/Button';
import {Text} from '../../components/core/Text/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {theme} from 'app/themes/Theme';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {UserInfo} from 'app/redux/user/userReducer';
import {validateEmail} from 'app/utils/tools';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.ForgotPassword
>;

const ForgotPasswordScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [email_e, setEmail_e] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sentLink, setSentLink] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const sendLink = async () => {
    if (!validateEmail(email)) {
      setEmail_e(t('email_error') as string);
      return;
    }
    setLoading(true);
    const usersRef = firestore().collection('users');
    const res = await usersRef.where('email', '==', email).get();
    if (res.size > 0) {
      const user = res.docs[0]?.data() as UserInfo;
      await auth().sendPasswordResetEmail(user.email as string);
      setSentLink(true);
      setLoading(false);
    } else {
      Alert.alert(t('error'), t('email_not_found') as string);
      setLoading(false);
    }
  };

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        pt={'spacing10'}
        style={{paddingBottom: isAndroid ? 10 : insets.bottom}}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'textPrimary'}
          emphasis={ButtonEmphasis.Background}
          size={ButtonSize.Medium}
          loading={loading}
          style={{borderRadius: 15}}
          onPress={sentLink ? navigation.goBack : sendLink}>
          {sentLink ? t('got_it') : t('send_link')}
        </Button>
      </Flex>
    );
  };

  return (
    <Screen edges={['bottom', 'left', 'right', 'top']}>
      <ViewHeader
        showBorder
        showBackButton
        title={t('sign_in_help') as string}
      />
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <Flex gap="spacing20" mt={'spacing10'} px="spacing14">
          <Text color="textPrimary" variant="bodySmall">
            {sentLink ? t('check_email_desc') : t('sign_in_help_desc')}
          </Text>
          {!sentLink && (
            <Flex mt={'spacing4'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('email')}
              </Text>
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
          )}
        </Flex>
      </KeyboardAwareScrollView>
      {footerComponent()}
    </Screen>
  );
};

export default ForgotPasswordScreen;
