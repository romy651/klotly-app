import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {updateUserFilter} from 'app/redux/config/config.reducer';
import {UserInfo} from 'app/redux/user/userReducer';
import {
  AppStackParamList,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens, Stack} from 'app/routes/screens/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {uploadAvatar} from 'app/utils/tools';
import {updateUserInfo} from 'app/actions/userAction';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Fontiso from 'react-native-vector-icons/Fontisto';
import {isAndroid, isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.EditProfileScreen
>;
const currentYear = new Date().getFullYear();

const EditProfileScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const me = useAppSelector(state => state.user);
  const inset = useSafeAreaInsets();
  const [_me, setMe] = useState<UserInfo>(me);
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const appState = useAppSelector(state => state.application);

  const changeValue = (
    type:
      | 'firstName'
      | 'lastName'
      | 'seeking'
      | 'age'
      | 'email'
      | 'language'
      | 'intro',
    value: string,
  ) => {
    navigation.navigate(Stack.BottomInputValue, {
      value,
      type,
      callback: (value: string) => {
        switch (type) {
          case 'firstName':
            setMe({..._me, firstName: value});
            break;
          case 'lastName':
            setMe({..._me, lastName: value});
            break;
          case 'intro':
            setMe({..._me, intro: value});
            break;
          case 'seeking':
            dispatch(
              updateUserFilter({
                ...appState.userFilter,
                gender: value as 'man' | 'woman' | 'other',
              }),
            );
            break;
          case 'age':
            setMe({..._me, age: parseInt(value)});
            break;
          case 'email':
            console.log('the email: ', value);
            setMe({..._me, email: value.toLowerCase().trim()});
            break;
          case 'language':
            setMe({
              ..._me,
              languages: value.split(',').map(lang => lang.trim()),
            });
            break;
        }
      },
    });
  };

  const onchangeAvatar = () => {
    navigation.navigate(Stack.UploadProfileScreen, {
      callback: (uri: string) => {
        console.log('we change the avatar: ', uri);
        setMe({..._me, avatar: uri});
      },
    });
  };

  const onSave = () => {
    setLoading(true);
    if (_me.avatar && _me.avatar !== me.avatar) {
      //upload avatar
      uploadAvatar(
        _me.avatar,
        me.id,
        () => {},
        () => {
          Alert.alert(t('error'), t('error_try_later') as string);
          setLoading(false);
        },
        uri => {
          updateUserInfo({..._me, avatar: uri}, dispatch, setLoading);
        },
      );
    } else {
      updateUserInfo(_me, dispatch, setLoading);
    }
    navigation.goBack();
  };

  const setHoliday = (value: boolean) => {
    if (me.tutorObj) {
      //@ts-ignore
      const res: UserInfo = {
        ..._me,
        tutorObj: {..._me.tutorObj, holidayMode: value},
      };
      setMe(res);
    }
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <View
        style={{
          ...styles.headerView,
          borderBottomColor: theme.colors.background2,
        }}>
        <TouchableIcon
          Component={Ionicon}
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          size={22}
          color={theme.colors.textPrimary}
          action={navigation.goBack}
          style={styles.backButton}
        />
        <Flex
          ml={isAndroid ? 'spacing60' : undefined}
          style={{marginRight: isIos ? undefined : 'auto'}}
          flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'headlineSmall'}
            color={'textPrimary'}
            numberOfLines={1}>
            {t('edit_profile')}
          </Text>
        </Flex>
        <Flex style={styles.saveButton}>
          <Touchable disabled={loading} onPress={onSave}>
            {!loading ? (
              <Text
                fontWeight={'bold'}
                variant={'buttonLabelMedium'}
                color={'accentAction'}>
                {t('save')}
              </Text>
            ) : (
              <CircularActivityIndicator
                color={theme.colors.textSecondary}
                size={22}
              />
            )}
          </Touchable>
        </Flex>
      </View>

      <ScrollView
        style={{backgroundColor: theme.colors.background0}}
        contentContainerStyle={{
          width: SCREEN_WIDTH,
          paddingBottom: inset.bottom + 65,
        }}>
        <Text
          fontWeight={'bold'}
          mt={'spacing20'}
          px={'spacing16'}
          variant={'bodyLarge'}
          color={'textPrimary'}>
          {t('my_avatar')}
        </Text>
        <Flex
          mt={'spacing10'}
          alignItems={'center'}
          justifyContent={'center'}
          p={'spacing16'}
          width={SCREEN_WIDTH - 20}
          mx={'spacing10'}
          backgroundColor={'background2'}
          borderRadius={'rounded12'}>
          <FastImage source={{uri: _me.avatar}} style={styles.avatar} />
          <Touchable onPress={onchangeAvatar} style={styles.touchable_change}>
            <Text
              textDecorationLine={'underline'}
              variant={'buttonLabelSmall'}
              color={'textPrimary'}>
              {t('change')}
            </Text>
          </Touchable>
        </Flex>

        {_me.isTutor && (
          <Touchable
            onPress={() => navigation.navigate(Stack.OnboardMentorMain)}>
            <Flex
              px={'spacing10'}
              mt={'spacing20'}
              borderRadius={'rounded12'}
              marginHorizontal={'spacing10'}
              paddingVertical={'spacing16'}
              backgroundColor={'background2'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-around'}>
              <FontIcon
                name="chalkboard-teacher"
                color={theme.colors.textPrimary}
                size={20}
              />
              <Text
                style={{marginRight: 'auto'}}
                variant={'buttonLabelSmall'}
                color={'textPrimary'}>
                {t('update_tutor_profile')}
              </Text>
              <Ionicon
                name="chevron-forward"
                color={theme.colors.textPrimary}
                size={22}
              />
            </Flex>
          </Touchable>
        )}

        {_me.isTutor && (
          <Touchable
            onPress={() => navigation.navigate(Stack.OnboardMentorMain)}>
            <Flex
              px={'spacing10'}
              mt={'spacing20'}
              borderRadius={'rounded12'}
              marginHorizontal={'spacing10'}
              paddingVertical={'spacing14'}
              backgroundColor={'background2'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-around'}>
              <Fontiso
                name="holiday-village"
                color={theme.colors.textPrimary}
                size={20}
              />
              <Text
                style={{marginRight: 'auto'}}
                variant={'buttonLabelSmall'}
                color={'textPrimary'}>
                {t('holiday_mode')}
              </Text>
              <Switch
                trackColor={{
                  false: theme.colors.background2,
                  true: theme.colors.accentActiveSoft,
                }}
                thumbColor={
                  _me?.tutorObj?.holidayMode || false
                    ? theme.colors.accentActive
                    : theme.colors.background3
                }
                ios_backgroundColor={theme.colors.background2}
                value={_me?.tutorObj?.holidayMode || false}
                onValueChange={setHoliday}
              />
            </Flex>
          </Touchable>
        )}

        <Text
          mb={'spacing10'}
          mt={'spacing36'}
          px={'spacing16'}
          fontWeight={'bold'}
          variant={'bodyLarge'}
          color={'textPrimary'}>
          {t('my_info')}
        </Text>
        <Touchable onPress={() => changeValue('firstName', _me.firstName)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('firstName')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {_me.firstName || ''}
              </Text>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        <Touchable onPress={() => changeValue('lastName', _me.lastName)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('lastName')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {_me.lastName || ''}
              </Text>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        {!me.isTutor && (
          <Touchable onPress={() => changeValue('intro', _me.intro || '')}>
            <Flex style={styles.touchable_item}>
              <Flex flexDirection={'row'}>
                <Text color={'textSecondary'} variant="bodyLarge">
                  {t('intro')}
                </Text>
              </Flex>
              <Flex gap={'none'} flexDirection={'row'} alignItems={'center'}>
                <Text
                  numberOfLines={3}
                  style={{
                    width: SCREEN_WIDTH / 2,
                    marginRight: 'auto',
                  }}
                  variant={_me.intro ? 'buttonLabelMicro' : 'bodySmall'}
                  fontStyle={_me.intro ? 'normal' : 'italic'}
                  color={'textPrimary'}>
                  {_me.intro || t('enter_intro')}
                </Text>
                <Ionicon
                  color={theme.colors.textSecondary}
                  name="chevron-forward"
                  size={24}
                />
              </Flex>
            </Flex>
          </Touchable>
        )}
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        <Touchable>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('gender')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {_me.gender}
              </Text>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        {/*<Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
                <Touchable

                    onPress={() => changeValue('seeking', filter.gender as any)}
                    style={styles.touchable_item}>
                    <>
                        <Flex flexDirection={'row'}>
                            <Text color={'textSecondary'} variant="bodyLarge">
                                {t('seeking')}
                            </Text>
                        </Flex>
                        <Flex flexDirection={'row'} alignItems={'center'}>
                            <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                                {filter.gender
                                    ? t(filter.gender)
                                    : me.gender == 'man'
                                    ? t('woman')
                                    : t('man')}
                            </Text>
                            <Ionicon
                                color={theme.colors.textSecondary}
                                name="chevron-forward"
                                size={24}
                            />
                        </Flex>
                    </>
                </Touchable>*/}
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        <Touchable onPress={() => setOpenDate(true)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('age')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {_me.age ?? 24}
              </Text>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        <Touchable
          onPress={() =>
            navigation.navigate(Stack.HomeLanguageScreen, {
              callback: val => {
                setMe({..._me, languages: val});
              },
              languages: _me.languages,
            })
          }>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('ispeak')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              {_me.languages.map((lang, index) => (
                <Text
                  key={index}
                  variant={'buttonLabelMicro'}
                  color={'textPrimary'}>
                  {`${lang}${index == _me.languages.length - 1 ? '' : ', '}`}
                </Text>
              ))}
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
        <Touchable onPress={() => changeValue('email', _me.email || '')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textSecondary'} variant="bodyLarge">
                {t('email')}
              </Text>
            </Flex>
            <Flex flexDirection={'row'} alignItems={'center'}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {_me.email || ''}
              </Text>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        open={openDate}
        date={
          new Date(
            `${_me.age ? currentYear - _me.age : currentYear - 24}-01-01`,
          )
        }
        onConfirm={date => {
          setOpenDate(false);
          setMe({..._me, age: currentYear - date.getFullYear()});
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
      />
    </Screen>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 5,
    paddingLeft: 15,
  },
  touchable_change: {
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});
