/**
 * @Project Summarised
 * @File SignInScreen.tsx
 * @Path app/screen
 * @Author BRICE ZELE
 * @Date 23/04/2023
 */
import {useCallback, useState} from 'react';
import {Alert, Dimensions, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
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
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {languageMap} from 'app/constants/languages';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList & AppStackParamList,
  OnBoardingScreens.UpdateProfile
>;
const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.5;

const UpdateProfile: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const {avatar, email, firstName, lastName} = route.params;
  const appNavigation = useAppStackNavigation();
  const [first, setFirst] = useState<string>(firstName);
  const [last, setLast] = useState<string>(lastName);
  const [first_e, setFirst_e] = useState<string>('');
  const [last_e, setLast_e] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const lgs = useAppSelector(state => state.application.appLanguage);
  //console.log('THE LANGUAGE: ', lgs)
  //@ts-ignore
  const appLanguage = languageMap[lgs].name;
  const [languages, setLanguages] = useState<string[]>([appLanguage]);
  const [gender, setGender] = useState<'man' | 'woman' | 'other'>('man');

  const isInfoCorret = first.length > 3 && last.length > 3;

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
      setLoading(false);
      return;
    } else {
      setFirst_e('');
      setLast_e('');
    }

    navigation.navigate(OnBoardingScreens.AddPhotoScreen, {
      firstName: first,
      lastName: last,
      email,
      gender,
      languages,
    });
    setLoading(false);
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
          backgroundColor={item == gender ? 'background0' : 'background0'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'row'}
          borderColor={item == gender ? 'accentActive' : 'background3'}
          borderWidth={1.5}>
          <MatComicon
            size={18}
            color={theme.colors.textSecondary}
            name={
              item == 'man'
                ? 'gender-male'
                : item == 'woman'
                ? 'gender-female'
                : 'gender-transgender'
            }
          />
          <Text
            color={item == gender ? 'textPrimary' : 'textSecondary'}
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
        style={{paddingBottom: isAndroid ? 10 : insets.bottom}}
        px={'spacing20'}
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
    <Screen backgroundColor={'background2'} edges={['left', 'right', 'top']}>
      <ViewHeader showBorder showBackButton title={t('sign_up') as string} />
      <KeyboardAwareScrollView
        style={{backgroundColor: theme.colors.background0}}
        contentContainerStyle={{flex: 1}}>
        <Flex gap="none" marginTop="spacing18" px="spacing14">
          <Flex mt={'spacing2'}>
            <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
              {t('firstName')}
            </Text>
            <Flex style={{marginTop: -10}}>
              <TextInput
                outline
                error={first_e.length > 0 ? first_e : undefined}
                autoComplete="name"
                color={'textPrimary'}
                placeholder={`${t('your_firstname')}...`}
                style={{color: theme.colors.textPrimary}}
                value={first}
                onBlur={(): void => {}}
                onChangeText={setFirst}
              />
            </Flex>
            <Flex
              flexDirection={'row'}
              position={'absolute'}
              right={-5}
              top={28}>
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
          <Flex mt={'spacing4'}>
            <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
              {t('lastName')}
            </Text>
            <Flex style={{marginTop: -10}}>
              <TextInput
                outline
                error={last_e.length > 0 ? last_e : undefined}
                autoComplete="name"
                color={'textPrimary'}
                placeholder={`${t('your_lastname')}...`}
                style={{color: theme.colors.textPrimary}}
                value={last}
                onBlur={(): void => {}}
                onChangeText={setLast}
              />
            </Flex>
            <Flex
              flexDirection={'row'}
              position={'absolute'}
              right={-5}
              top={28}>
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
  rotate: {marginRight: -10, marginTop: 2},
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  appleIcon: {
    height: 30,
    marginLeft: 8,
    width: 24,
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: CIRCLE_SIZE / 2,
  },
  facebookIcon: {
    height: 24,
    marginLeft: 8,
    width: 24,
  },
  googleIcon: {
    height: 24,
    marginLeft: 8,
    width: 24,
  },
  logoImage: {
    height: 100,
    width: 100,
  },
  mailIcon: {
    marginLeft: 8,
  },
  headerView: {
    width: '100%',
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
});

export default UpdateProfile;
