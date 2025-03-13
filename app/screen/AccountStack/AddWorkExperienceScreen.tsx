import React, {useState} from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  Experience,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens, Stack} from 'app/routes/screens/Stack';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Screen} from 'app/components/layout/Screen';
import {Checkbox, TextInput} from 'react-native-paper';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Text} from 'app/components/core/Text/Text';
import DatePicker from 'react-native-date-picker';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import TextInput_ from 'app/components/core/Input/TextInput';
import {theme} from 'app/themes/Theme';
import {Flex} from 'app/components/layout/Flex';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {updateUserInfo} from 'app/actions/userAction';
import {UserInfo} from 'app/redux/user/userReducer';
import {isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.AddWorkExperienceScreen
>;

const AddCertificateScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const {data} = route.params;
  const user = useAppSelector(state => state.user);
  const dispatch = useDispatch();
  const isCreating = typeof data === 'undefined' ? true : false;
  const [experience, setExperience] = useState<Experience>(
    isCreating
      ? {
          uid: new Date().getTime(),
          area: '',
          companyName: '',
          employmentType: '',
          startDate: '',
          endDate: '',
          location: '',
          stillWorking: false,
          title: '',
        }
      : (data as Experience),
  );
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [modalDate, setModalDate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDateKey, setCurrentDateKey] = useState<keyof Experience>();

  const changeValue = (
    key: keyof Experience,
    val: string | number | boolean,
  ) => {
    const temp = {...experience};
    //@ts-ignore
    temp[key] = val;
    if (key !== 'stillWorking' && key === 'endDate') {
      //@ts-ignore
      temp.stillWorking = false;
    }
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

  const onPost = () => {
    if (
      !experience.stillWorking &&
      parseInt(experience.startDate) > parseInt(experience.endDate)
    ) {
      Alert.alert(t('error'), t('start_date_must_be_earlier') as string);
    } else if (
      experience.companyName !== '' &&
      experience.employmentType !== '' &&
      (experience.startDate !== '' || experience.stillWorking) &&
      experience.endDate !== '' &&
      experience.title !== ''
    ) {
      setLoading(true);
      const res: UserInfo = {
        ...user,
        experiences: isCreating
          ? [experience, ...(user.experiences || [])]
          : user.experiences?.map(item =>
              item.uid === experience.uid ? experience : item,
            ),
      };
      updateUserInfo(res, dispatch, setLoading);
      navigation.goBack();
    } else {
      Alert.alert(t('error'), t('complete_required_field') as string);
    }
  };

  const addEmployment = () => {
    navigation.navigate(Stack.SelectVariantScreen, {
      initChecked: [experience.employmentType],
      initValue: {
        key: 'employment_type',
        type: 'select',
        value: [
          'full_time',
          'contract',
          'internship',
          'freelance',
          'part_time_job',
          'temporary_job',
        ],
      },
      onDone: (value: string[]) => {
        changeValue('employmentType', value[0] as string);
      },
    });
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
              ? (t('add_experience') as string)
              : (t('edit_experience') as string)}
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
          {t('working_title')}
          <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
            *
          </Text>
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('working_title_placeholder') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.title}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('title', text)}
        />
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('company_name')}
          <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
            *
          </Text>
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('company_name_placeholder') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.companyName}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('companyName', text)}
        />

        <Touchable
          style={{
            ...styles.stillworking,
            paddingVertical: 18,
            borderColor: theme.colors.background3,
          }}
          onPress={addEmployment}>
          <Flex
            gap={'spacing1'}
            paddingVertical={'spacing14'}
            mt={'spacing10'}
            pl={'spacing10'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text variant={'buttonLabelMicro'} color={'textPrimary'}>
              {t('employment_type')}
            </Text>
            <View style={styles.forwardItem}>
              <Text variant={'buttonLabelMicro'} style={styles.selectedValues}>
                {t(experience.employmentType) as string}
              </Text>
              <Ionicon
                name="chevron-forward"
                size={22}
                color={theme.colors.textPrimary}
              />
            </View>
          </Flex>
        </Touchable>

        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('working_period')}
        </Text>
        <Touchable
          onPress={() => {
            setCurrentDateKey('startDate');
            setModalDate(true);
          }}>
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
          }}
          style={{marginTop: 20}}>
          <View
            style={{
              ...styles.selectView,
              marginTop: 20,
              borderColor: experience.stillWorking
                ? theme.colors.background3
                : theme.colors.textPrimary,
            }}>
            <Text
              color={experience.stillWorking ? 'textSecondary' : 'textPrimary'}
              variant={'bodySmall'}
              style={{marginRight: 'auto'}}>
              {t('to')}
              <Text variant={'buttonLabelSmall'} color={'accentCritical'}>
                *
              </Text>
            </Text>
            <View style={styles.forwardItem}>
              <Text variant={'buttonLabelMicro'} style={styles.selectedValues}>
                {experience.stillWorking ? '' : showDate(experience.endDate)}
              </Text>
              <MatIcon
                name="keyboard-arrow-down"
                color={
                  experience.stillWorking
                    ? theme.colors.textSecondary
                    : theme.colors.textPrimary
                }
                size={24}
              />
            </View>
          </View>
        </Touchable>
        <Touchable
          style={{
            ...styles.stillworking,
            paddingVertical: 13,
            borderColor: experience.stillWorking
              ? theme.colors.textPrimary
              : theme.colors.background3,
          }}
          onPress={() => changeValue('stillWorking', !experience.stillWorking)}>
          <Flex
            gap={'spacing1'}
            mt={'spacing10'}
            paddingVertical={'spacing10'}
            pl={'spacing10'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text
              variant={'buttonLabelMicro'}
              color={experience.stillWorking ? 'textPrimary' : 'textSecondary'}>
              {t('still_working')}
            </Text>
            <View style={styles.forwardItem}>
              <Checkbox
                status={experience.stillWorking ? 'checked' : 'indeterminate'}
                color={
                  experience.stillWorking
                    ? theme.colors.accentAction
                    : theme.colors.textSecondary
                }
              />
            </View>
          </Flex>
        </Touchable>
        <Text
          mt={'spacing20'}
          mb={'spacing10'}
          variant={'buttonLabelSmall'}
          color={'textPrimary'}>
          {t('working_location')}
        </Text>
        <TextInput_
          outline
          autoComplete="name"
          color={'textPrimary'}
          placeholder={t('input_here') as string}
          style={{width: '100%', color: theme.colors.textPrimary}}
          value={experience.location}
          onBlur={(): void => {}}
          onChangeText={text => changeValue('location', text)}
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
          placeholder={t('description_placeholder') as string}
          style={styles.input}
          placeholderTextColor={theme.colors.textOnDimTertiary}
          value={experience.description}
          textColor={theme.colors.textPrimary}
          cursorColor={theme.colors.textSecondary}
          activeUnderlineColor={theme.colors.textSecondary}
          onChangeText={text => changeValue('description', text)}
        />
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

export default AddCertificateScreen;

const styles = StyleSheet.create({
  stillworking: {
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  touchable: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
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
    paddingRight: 10,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: theme.colors.background3,
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
