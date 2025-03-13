import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useBackHandler} from '@react-native-community/hooks';
import {
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FilterStackParamList} from 'app/routes/screens/Screens.types';
import {FilterStackScreens} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import CountryFlag from 'react-native-country-flag';
import _ from 'lodash';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Octicon from 'react-native-vector-icons/Octicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {languageMap} from 'app/constants/languages';
import {filterTutors} from 'app/utils/tools';
import {UserInfo} from 'app/redux/user/userReducer';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  FilterStackParamList,
  FilterStackScreens.FilterScreen
>;

const FilterScreen: React.FC<Props> = ({navigation, route}) => {
  //@ts-ignore
  const {t} = useTranslation();
  const user = useAppSelector(state => state.user);
  const lang = useAppSelector(state => state.application.appLanguage);
  const theme = useAppTheme();
  const bottomSheetRef = useRef(null);
  const [selectedTime, setSelectedTimes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  const appState = useAppSelector(state => state.application);
  const [gender, setGender] = useState<'man' | 'woman' | 'other'>();
  const topic = useAppSelector(state => state.application.topic);
  const subTopics = useAppSelector(state => state.application.subTopics) || [];
  const [submitTitle, setSubmitTitle] = useState<string>('');
  const [provenance, setProvenance] = useState<string[]>([
    user.country,
    ...appState.userFilter.countries.filter(c => c != user.country),
    'search',
  ]);
  const [selectedProvenance, setSelectedProvenance] = useState<string[]>([]);
  const [selectedlanguages, setSelectedlanguages] = useState<string[]>(
    appState.userFilter.languages,
  );
  const [languageList, setLanguageList] = useState<string[]>([
    'English',
    'Español',
    'العربية',
    'Tiếng việt',
    'Français',
    ...(appState.userFilter.languages || []).filter(
      l => !selectedlanguages.includes(l),
    ),
    'search',
  ]);
  const [allTutors, setTutors] = useState<UserInfo[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const tutors = await filterTutors({
        gender,
        countries: selectedProvenance,
        languages:
          selectedlanguages.length > 0
            ? selectedlanguages
            : //@ts-ignore
              [...new Set([...user.languages, languageMap[lang]])],
        days: selectedDays,
        timeSlots: selectedTime,
        topic,
        subTopics,
      });
      setSubmitTitle(
        `${t('show')} ${tutors.length} ${
          tutors.length > 1 ? t('tutors') : t('tutor')
        }`,
      );
      setTutors(tutors);
      setLoading(false);
    })();
  }, [
    gender,
    selectedProvenance,
    selectedlanguages,
    selectedTime,
    selectedDays,
  ]);

  const addProvenance = useCallback(
    (index: string) => {
      const _id = selectedProvenance.findIndex(elt => elt == index);
      let _temp = [...selectedProvenance];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else {
        _temp = [..._temp, index];
      }
      setSelectedProvenance(_temp);
    },
    [setSelectedProvenance, selectedProvenance],
  );

  const addLanguage = useCallback(
    (index: string) => {
      setSelectedlanguages([index]);
    },
    [selectedlanguages, setSelectedlanguages],
  );

  const addTime = useCallback(
    (index: string) => {
      const _id = selectedTime.findIndex(elt => elt == index);
      let _temp = [...selectedTime];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else if (selectedTime.length < 3) {
        _temp = [..._temp, index];
      }
      setSelectedTimes(_temp);
    },
    [selectedTime, setSelectedTimes],
  );

  const addDay = useCallback(
    (index: string) => {
      const _id = selectedDays.findIndex(elt => elt == index);
      let _temp = [...selectedDays];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else if (selectedDays.length < 3) {
        _temp = [..._temp, index];
      }
      setSelectedDays(_temp);
    },
    [selectedDays, setSelectedDays],
  );

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  const onSubmit = useCallback(async () => {
    const filterText = getTitle();
    route.params.callback(allTutors, filterText);
    route.params.close();
  }, [allTutors]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          loading={loading}
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={onSubmit}>
          {submitTitle}
        </Button>
      </Flex>
    ),
    [onSubmit, loading, submitTitle],
  );

  const renderGenderItem = useCallback(
    ({item}: {item: 'man' | 'woman' | 'other'}) => (
      <Touchable onPress={() => setGender(item)}>
        <Flex
          height={40}
          px={'spacing18'}
          backgroundColor={item == gender ? 'background3' : 'background0'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'spacing6'}
          flexDirection={'row'}
          borderColor={item == gender ? 'textPrimary' : 'background3'}
          borderWidth={1.5}>
          <MatComicon
            size={18}
            color={
              item == gender
                ? theme.colors.textPrimary
                : theme.colors.textSecondary
            }
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

  const onSearch = () => {
    navigation?.push(FilterStackScreens.CountrySearchScreen, {
      callBack: data => {
        setProvenance([
          user.country,
          ...data.filter(c => c != user.country),
          'search',
        ]);
        setSelectedProvenance(data);
      },
    });
  };

  const onSearch2 = () => {
    navigation?.push(FilterStackScreens.SelectLanguageScreen, {
      callBack: data => {
        setLanguageList(
          _.uniq([
            'English',
            'Español',
            'العربية',
            'Tiếng việt',
            'Français',
            ...(data || []).filter(l => !selectedlanguages.includes(l)),
            'search',
          ]),
        );
        setSelectedlanguages(data);
      },
    });
  };

  const renderProvenance = useCallback(
    ({item, index}: {item: string; index: number}) =>
      item !== 'search' ? (
        <Touchable onPress={() => addProvenance(item)}>
          <Flex
            height={40}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={
              selectedProvenance.includes(item) ? 'background3' : 'background0'
            }
            style={{
              marginRight: (index + 1) % 3 == 0 ? 0 : 10,
              marginTop: index > 2 ? 10 : 0,
            }}
            borderWidth={1.5}
            borderRadius={'rounded8'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={
              selectedProvenance.includes(item) ? 'textPrimary' : 'background3'
            }>
            {item.length === 2 && (
              <CountryFlag
                style={{marginRight: -10, borderRadius: 3}}
                isoCode={item.toUpperCase()}
                size={14}
              />
            )}
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {item.toUpperCase()}
            </Text>
          </Flex>
        </Touchable>
      ) : (
        <Touchable onPress={onSearch}>
          <Flex
            style={{
              marginRight: (index + 1) % 3 == 0 ? 0 : 5,
              marginTop: index > 2 ? 10 : 0,
            }}
            height={40}
            px={'spacing14'}
            backgroundColor={'background0'}
            borderRadius={'rounded8'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={'background3'}
            borderWidth={1}>
            <Ionicon
              style={{marginRight: -10}}
              name="search-outline"
              color={theme.colors.textSecondary}
              size={16}
            />
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {t('search')}
            </Text>
          </Flex>
        </Touchable>
      ),
    [selectedProvenance],
  );

  const renderLanguage = useCallback(
    ({item, index}: {item: string; index: number}) =>
      item !== 'search' ? (
        <Touchable onPress={() => addLanguage(item)}>
          <Flex
            style={{
              marginRight: (index + 1) % 3 == 0 ? 0 : 5,
              marginTop: index > 2 ? 10 : 0,
            }}
            height={40}
            px={'spacing18'}
            backgroundColor={
              selectedlanguages.includes(item) ? 'background3' : 'background0'
            }
            borderWidth={1.5}
            borderRadius={'rounded8'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={
              selectedlanguages.includes(item) ? 'textPrimary' : 'background3'
            }>
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {item}
            </Text>
          </Flex>
        </Touchable>
      ) : (
        <Touchable onPress={onSearch2}>
          <Flex
            height={40}
            style={{
              marginRight: (index + 1) % 3 == 0 ? 0 : 5,
              marginTop: index > 2 ? 10 : 0,
            }}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={'background0'}
            borderRadius={'rounded8'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={'background3'}
            borderWidth={1}>
            <Ionicon
              style={{marginRight: -10}}
              name="search-outline"
              color={theme.colors.textSecondary}
              size={16}
            />
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {t('search')}
            </Text>
          </Flex>
        </Touchable>
      ),
    [selectedlanguages],
  );

  const getTitle = () => {
    const res = [];
    if ((gender || '').length > 0) {
      res.push([t(gender as string)]);
    } else {
      res.push([t('any_gender')]);
    }
    if (selectedProvenance.length > 0) {
      res.push([...selectedProvenance]);
    } else {
      res.push([t('any_country')]);
    }
    if (selectedlanguages.length > 0) {
      res.push([...selectedlanguages]);
    }
    //@ts-ignore
    else {
      res.push([...new Set([languageMap[lang].native, ...user.languages])]);
    }
    if (selectedTime.length > 0) {
      res.push([...selectedTime.map(_ => getTimeSlotText(_))]);
    } else {
      res.push([t('any_time')]);
    }
    if (selectedDays.length > 0) {
      res.push([...selectedDays.map(_ => t(_))]);
    } else {
      res.push([t('any_day')]);
    }
    return res.join(' • ');
  };

  const renderTime = useCallback(
    ({item, index}: {item: any; index: number}) => (
      <Flex key={index} gap={'spacing10'} mt={'spacing10'}>
        <Text px={'spacing2'} variant={'bodySmall'} color={'textSecondary'}>
          {t(item.title)}
        </Text>
        <Flex gap={'none'} flexDirection={'row'}>
          {item.slots.map((slot: any, key: any) => (
            <Touchable onPress={() => addTime(slot.name)}>
              <Flex
                gap={'spacing8'}
                style={{
                  marginRight: (key + 1) % 3 == 0 ? 0 : 10,
                  marginTop: key > 2 ? 10 : 0,
                }}
                width={(SCREEN_WIDTH - 40) / 3}
                px={'spacing18'}
                height={70}
                backgroundColor={
                  selectedTime.includes(slot.name)
                    ? 'background3'
                    : 'background0'
                }
                borderWidth={1.5}
                borderRadius={'rounded8'}
                alignItems={'center'}
                justifyContent={'center'}
                borderColor={
                  selectedTime.includes(slot.name)
                    ? 'textPrimary'
                    : 'background3'
                }>
                <slot.icon
                  name={slot.iconName}
                  color={
                    selectedTime.includes(slot.name)
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary
                  }
                  size={18}
                />
                <Text
                  color={
                    selectedTime.includes(slot.name)
                      ? 'textPrimary'
                      : 'textSecondary'
                  }
                  variant={'bodyMicro'}>
                  {slot.text}
                </Text>
              </Flex>
            </Touchable>
          ))}
        </Flex>
      </Flex>
    ),
    [selectedTime, setSelectedTimes],
  );

  const renderDay = useCallback(
    (item: string, index: number) => (
      <Touchable onPress={() => addDay(item)}>
        <Flex
          style={{
            marginTop: 10,
          }}
          height={40}
          px={'spacing18'}
          backgroundColor={
            selectedDays.includes(item) ? 'background3' : 'background0'
          }
          borderWidth={1.5}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'row'}
          borderColor={
            selectedDays.includes(item) ? 'textPrimary' : 'background3'
          }>
          <Text
            color={
              selectedDays.includes(item) ? 'textPrimary' : 'textSecondary'
            }
            variant={'bodySmall'}>
            {t(item)}
          </Text>
        </Flex>
      </Touchable>
    ),
    [selectedDays, setSelectedDays],
  );

  return (
    <Flex
      gap={'none'}
      backgroundColor={'background0'}
      ref={bottomSheetRef}
      style={styles.bsheet}>
      <Flex
        borderBottomWidth={1}
        height={45}
        backgroundColor={'background2'}
        borderBottomColor={'background3'}
        py={'spacing10'}
        alignItems={'center'}>
        <Text color={'textPrimary'} variant={'buttonLabelMedium'}>
          {t('filter_tutors')}
        </Text>
      </Flex>
      <BottomSheetScrollView
        bounces={false}
        contentContainerStyle={{...styles.containStyle}}>
        <Flex
          mt={'spacing10'}
          borderRadius={'rounded8'}
          justifyContent={'center'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          paddingBottom={'spacing20'}
          mx={'spacing10'}
          borderColor={'background3'}>
          <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
            {t('gender')}
          </Text>
          <Flex gap={'spacing10'} flexDirection={'row'}>
            {renderGenderItem({item: 'man'})}
            {renderGenderItem({item: 'woman'})}
            {renderGenderItem({item: 'other'})}
          </Flex>
        </Flex>
        <Flex
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mt={'spacing20'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          paddingBottom={'spacing20'}
          mx={'spacing10'}
          borderColor={'background3'}>
          <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
            {t('country_residence')}
          </Text>
          <FlatList
            bounces={false}
            renderItem={renderProvenance}
            numColumns={3}
            data={provenance}
            keyExtractor={i => i}
          />
        </Flex>
        <Flex
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mt={'spacing20'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          paddingBottom={'spacing20'}
          mx={'spacing10'}
          borderColor={'background3'}>
          <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
            {t('spoken_languages')}
          </Text>
          <FlatList
            bounces={false}
            renderItem={renderLanguage}
            numColumns={3}
            data={languageList}
            keyExtractor={i => i}
          />
        </Flex>
        <Flex
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mt={'spacing20'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          paddingBottom={'spacing20'}
          mx={'spacing10'}
          gap={'none'}
          borderColor={'background3'}>
          <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
            {t('time_available')}
          </Text>
          <FlatList
            bounces={false}
            renderItem={renderTime}
            data={times}
            keyExtractor={i => i.title}
          />
        </Flex>
        <Flex
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mt={'spacing20'}
          borderBottomColor={'background3'}
          borderBottomWidth={1}
          paddingBottom={'spacing20'}
          mx={'spacing10'}
          gap={'none'}
          borderColor={'background3'}>
          <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
            {t('days_available')}
          </Text>
          <Flex
            gap={'spacing10'}
            mt={'spacing14'}
            flexDirection={'row'}
            alignItems={'flex-start'}
            flexWrap={'wrap'}>
            {days.map((day, key) => renderDay(day, key))}
          </Flex>
        </Flex>
      </BottomSheetScrollView>
      {footerComponent()}
    </Flex>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 14,
    lineHeight: 20,
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    width: '100%',
  },
  containStyle: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  bottomSheet: {
    alignItems: 'center',
    elevation: 5,
    left: 0,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    width: '100%',
    zIndex: 1,
  },
  fullView: {
    height: '100%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  bsheet: {
    width: '100%',
    height: '100%',
  },
});

const times = [
  {
    title: 'day_time',
    slots: [
      {
        text: '9 AM - 12 PM',
        icon: Feather,
        iconName: 'sunrise',
        name: 'day-time-1',
      },
      {
        text: '12 - 3 PM',
        icon: Ionicon,
        iconName: 'sunny-outline',
        name: 'day-time-2',
      },
      {
        text: '12 - 3 PM',
        icon: FontIcon,
        iconName: 'sun-o',
        name: 'day-time-3',
      },
    ],
  },
  {
    title: 'evening_night',
    slots: [
      {
        text: '6 - 9 PM',
        icon: Feather,
        iconName: 'sunset',
        name: 'evening-night-1',
      },
      {
        text: '9 PM - 12 AM',
        icon: MatComicon,
        iconName: 'weather-night',
        name: 'evening-night-2',
      },
      {
        text: '12 - 3 AM',
        icon: Octicon,
        iconName: 'moon',
        name: 'evening-night-3',
      },
    ],
  },
  {
    title: 'morning',
    slots: [
      {
        text: '3 - 6 AM',
        icon: MatComicon,
        iconName: 'sleep',
        name: 'morning-1',
      },
      {
        text: '6 - 9 AM',
        icon: MatComicon,
        iconName: 'weather-sunset-up',
        name: 'morning-2',
      },
    ],
  },
];

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const getTimeSlotText = (name: string) => {
  for (const timeGroup of times) {
    for (const slot of timeGroup.slots) {
      if (slot.name === name) {
        return slot.text;
      }
    }
  }
};
