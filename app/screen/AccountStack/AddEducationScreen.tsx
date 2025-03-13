import React, {useState} from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  Education,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens} from 'app/routes/screens/Stack';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Screen} from 'app/components/layout/Screen';
import {TextInput} from 'react-native-paper';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Text} from 'app/components/core/Text/Text';
import DatePicker from 'react-native-date-picker';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import TextInput_ from 'app/components/core/Input/TextInput';
import {Flex} from 'app/components/layout/Flex';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {Image} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch} from 'react-redux';
import {updateUserInfo} from 'app/actions/userAction';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {UserInfo} from 'app/redux/user/userReducer';
import {uploadAvatar} from 'app/utils/tools';
import {isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.AddEducationScreen
>;

const AddEducationScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const {data} = route.params;
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const isCreating = typeof data === 'undefined' ? true : false;
  const [experience, setExperience] = useState<Education>(
    isCreating
      ? {
          uid: new Date().getTime(),
          degree: '',
          description: '',
          startDate: '',
          endDate: '',
          fieldStudy: '',
          school: '',
          image: '',
          verificationUrl: '',
        }
      : (data as Education),
  );
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [modalDate, setModalDate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDateKey, setCurrentDateKey] = useState<keyof Education>();
  const [image, setImage] = useState<string>('');

  const changeValue = (key: keyof Education, val: string | number) => {
    const temp = {...experience};
    //@ts-ignore
    temp[key] = val;
    setExperience(temp);
  };

  const showDate = (t: any): string => {
    if (t == '') {
      return '';
    }
    const relative: string = moment(t).fromNow();
    const abs = moment(t).format('MMM, Do YYYY');
    return relative + ' (' + abs + ')';
  };

  const selectImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
    }).then(image => {
      setImage(image.path);
    });
  };

  const onPost = () => {
    if (parseInt(experience.startDate) > parseInt(experience.endDate)) {
      Alert.alert(t('error'), t('start_date_must_be_earlier') as string);
    } else if (
      experience.degree !== '' &&
      experience.fieldStudy !== '' &&
      experience.startDate !== '' &&
      experience.endDate !== ''
    ) {
      setLoading(true);
      if (image.length > 0) {
        uploadAvatar(
          image,
          user.id,
          () => {},
          () => {
            Alert.alert(t('error'), t('error_try_later') as string);
          },
          uri => {
            const res: UserInfo = {
              ...user,
              education: isCreating
                ? [{...experience, image: uri}, ...(user.education || [])]
                : user.education?.map(item => {
                    if (item.uid === experience.uid) {
                      return {...experience, image: uri};
                    }
                    return item;
                  }),
            };
            setLoading(false);
            updateUserInfo(res, dispatch, setLoading);
            navigation.goBack();
          },
        );
      } else {
        const res: UserInfo = {
          ...user,
          education: isCreating
            ? [experience, ...(user.education || [])]
            : user.education?.map(item => {
                if (item.uid === experience.uid) {
                  return experience;
                }
                return item;
              }),
        };
        updateUserInfo(res, dispatch, setLoading);
        navigation.goBack();
      }
    } else {
      Alert.alert(t('error'), t('complete_required_field') as string);
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
          ml={isIos ? 'none' : 'spacing60'}
          style={{marginRight: isIos ? undefined : 'auto'}}
          flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'headlineSmall'}
            color={'textPrimary'}
            numberOfLines={1}>
            {isCreating
              ? (t('add_education') as string)
              : (t('edit_education') as string)}
          </Text>
        </Flex>
        <View style={styles.saveButton}>
          <Touchable disabled={loading} onPress={onPost}>
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
        </View>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT - 50,
          backgroundColor: theme.colors.background0,
        }}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 10,
          width: '100%',
        }}>
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('institution')}
          <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
            *
          </Text>
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('institution_placeholder') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.school}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('school', text)}
        />
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('degree_name')}
          <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
            *
          </Text>
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('diploma_placeholder') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.degree}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('degree', text)}
        />
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('specialization')}
          <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
            *
          </Text>
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('specialization_placeholder') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.fieldStudy}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('fieldStudy', text)}
        />
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('description')}
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={5}
          maxLength={200}
          placeholder={t('description_placeholder') as string}
          style={{...styles.input, borderColor: theme.colors.background3}}
          placeholderTextColor={theme.colors.textOnDimTertiary}
          value={experience.description}
          textColor={theme.colors.textPrimary}
          cursorColor={theme.colors.textSecondary}
          activeUnderlineColor={theme.colors.textSecondary}
          onChangeText={text => changeValue('description', text)}
        />
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('years_of_study')}
        </Text>
        <Touchable
          onPress={() => {
            setCurrentDateKey('startDate');
            setModalDate(true);
          }}
          style={{marginTop: 20}}>
          <View
            style={{
              ...styles.selectView,
              borderColor: theme.colors.background3,
            }}>
            <Text variant={'bodySmall'} style={{marginRight: 'auto'}}>
              {t('from')}
              <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
                *
              </Text>
            </Text>
            <View style={styles.forwardItem}>
              <Text variant={'buttonLabelMicro'} style={styles.selectedValues}>
                {showDate(experience.startDate)}
              </Text>
              <MatIcon
                name="keyboard-arrow-down"
                color={theme.colors.textSecondary}
                size={24}
              />
            </View>
          </View>
        </Touchable>
        <Touchable
          onPress={() => {
            setCurrentDateKey('endDate');
            setModalDate(true);
          }}>
          <View
            style={{
              ...styles.selectView,
              borderColor: theme.colors.background3,
              marginTop: 20,
            }}>
            <Text variant={'bodySmall'} style={{marginRight: 'auto'}}>
              {t('to')}
              <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
                *
              </Text>
            </Text>
            <View style={styles.forwardItem}>
              <Text variant={'buttonLabelMicro'} style={styles.selectedValues}>
                {showDate(experience.endDate)}
              </Text>
              <MatIcon
                name="keyboard-arrow-down"
                color={theme.colors.textSecondary}
                size={24}
              />
            </View>
          </View>
        </Touchable>
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('verfification_url')}
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('input_here') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.verificationUrl}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('verificationUrl', text)}
        />
        <Flex
          borderRadius={'rounded8'}
          padding={'spacing14'}
          mt={'spacing18'}
          backgroundColor={'accentWarningSoft'}>
          <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
            {t('get_diploma_badge')}
          </Text>
          <Text variant={'bodyMicro'} color={'textPrimary'}>
            {t('get_diploma_badge_desc')}
          </Text>
          <Text variant={'bodyMicro'} color={'textPrimary'}>
            {t('certificate_format')}
          </Text>
          {image.length === 0 && (
            <Touchable
              onPress={selectImage}
              style={{
                ...styles.touchable,
                borderColor: theme.colors.textPrimary,
              }}>
              <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
                {t('import')}
              </Text>
            </Touchable>
          )}
          {image.length > 0 && (
            <View>
              <Image
                width={80}
                height={80}
                borderRadius={5}
                source={{
                  uri: image,
                }}
              />
              <TouchableIcon
                Component={Ionicon}
                size={18}
                color={theme.colors.accentCritical}
                action={() => setImage('')}
                name="close-circle"
                style={{position: 'absolute', top: -5, left: -5}}
              />
            </View>
          )}
        </Flex>
      </KeyboardAwareScrollView>
      <DatePicker
        modal
        mode="date"
        open={modalDate}
        date={new Date()}
        onConfirm={date => {
          currentDateKey && changeValue(currentDateKey, date.getTime());
          setModalDate(false);
        }}
        onCancel={() => {
          setModalDate(false);
        }}
      />
    </Screen>
  );
};

export default AddEducationScreen;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 10,
  },
  touchable: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    minHeight: 100,
    borderRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    fontSize: 14,
  },
  selectView: {
    width: '100%',
    height: 65,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  selectedValues: {
    maxWidth: SCREEN_WIDTH / 2,
  },
  forwardItem: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});
