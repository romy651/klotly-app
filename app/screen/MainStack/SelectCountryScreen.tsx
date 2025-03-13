import React, {useCallback, useRef, useState} from 'react';
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
import {theme} from 'app/themes/Theme';
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
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {updateUserFilter} from 'app/redux/config/config.reducer';
import _ from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  FilterStackParamList,
  FilterStackScreens.FilterScreen
>;

const SelectCountryScreen: React.FC<Props> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  console.log('the params: ', route.params);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const bottomSheetRef = useRef(null);
  const appState = useAppSelector(state => state.application);
  const [gender, setGender] = useState<'man' | 'woman' | 'other'>(
    appState.userFilter.gender || 'man',
  );
  const [provenance, setProvenance] = useState<string[]>([
    user.country,
    ...appState.userFilter.countries.filter(c => c != user.country),
    'search',
  ]);
  const [selectedProvenance, setSelectedProvenance] = useState<string[]>(
    appState.userFilter.countries,
  );

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
      const _id = selectedlanguages.findIndex(elt => elt == index);
      let _temp = [...selectedlanguages];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else if (selectedlanguages.length < 3) {
        _temp = [..._temp, index];
      }
      setSelectedlanguages(_temp);
    },
    [selectedlanguages, setSelectedlanguages],
  );

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  const onSubmit = useCallback(() => {
    dispatch(
      updateUserFilter({
        ...appState.userFilter,
        gender,
        countries: selectedProvenance,
        languages: selectedlanguages,
      }),
    );
    //route.params.callback()
  }, [selectedProvenance, selectedlanguages, gender]);

  const footerComponent = useCallback(
    () => (
      <Flex
        marginVertical="spacing24"
        position={'absolute'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        bottom={0}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Large}
          style={{borderRadius: 5}}
          onPress={onSubmit}>
          {t('confirm')}
        </Button>
      </Flex>
    ),
    [onSubmit, insets.bottom],
  );

  const renderGenderItem = useCallback(
    ({item}: {item: 'man' | 'woman' | 'other'}) => (
      <Touchable onPress={() => setGender(item)}>
        <Flex
          height={40}
          width={(SCREEN_WIDTH - 70) / 3}
          backgroundColor={item == gender ? 'background3' : 'background3'}
          borderRadius={'rounded4'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'row'}
          borderColor={'violetVibrant'}
          borderWidth={item == gender ? 1 : 0}>
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
          <Text color={'textSecondary'} variant={'bodySmall'}>
            {t(item)}
          </Text>
        </Flex>
      </Touchable>
    ),
    [gender, t],
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
        <Touchable
          style={{
            marginRight: (index + 1) % 3 == 0 ? 0 : 5,
            marginTop: index > 2 ? 10 : 0,
          }}
          onPress={() => addProvenance(item)}>
          <Flex
            height={40}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={
              selectedProvenance.includes(item)
                ? 'accentActiveSoft'
                : 'background3'
            }
            borderWidth={selectedProvenance.includes(item) ? 1 : 0}
            borderRadius={'rounded4'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={'violetVibrant'}>
            {item.length == 2 && (
              <CountryFlag
                style={{marginRight: -10, borderRadius: 3}}
                isoCode={item}
                size={14}
              />
            )}
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {t(item)}
            </Text>
          </Flex>
        </Touchable>
      ) : (
        <Touchable
          style={{
            marginRight: (index + 1) % 3 == 0 ? 0 : 5,
            marginTop: index > 2 ? 10 : 0,
          }}
          onPress={onSearch}>
          <Flex
            height={40}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={'background0'}
            borderRadius={'rounded4'}
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
        <Touchable
          style={{
            marginRight: (index + 1) % 3 == 0 ? 0 : 5,
            marginTop: index > 2 ? 10 : 0,
          }}
          onPress={() => addLanguage(item)}>
          <Flex
            height={40}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={
              selectedlanguages.includes(item)
                ? 'accentActiveSoft'
                : 'background3'
            }
            borderWidth={selectedlanguages.includes(item) ? 1 : 0}
            borderRadius={'rounded4'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            borderColor={'violetVibrant'}>
            <Text color={'textSecondary'} variant={'bodySmall'}>
              {t(item)}
            </Text>
          </Flex>
        </Touchable>
      ) : (
        <Touchable
          style={{
            marginRight: (index + 1) % 3 == 0 ? 0 : 5,
            marginTop: index > 2 ? 10 : 0,
          }}
          onPress={onSearch2}>
          <Flex
            height={40}
            width={(SCREEN_WIDTH - 52) / 3}
            backgroundColor={'background0'}
            borderRadius={'rounded4'}
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

  return (
    <Flex
      backgroundColor={'background0'}
      ref={bottomSheetRef}
      style={styles.bsheet}>
      <Flex
        borderBottomWidth={1}
        height={50}
        borderBottomColor={'background3'}
        py={'spacing10'}
        alignItems={'center'}>
        <Text color={'textPrimary'} variant={'subheadLarge'}>
          {t('filter')}
        </Text>
      </Flex>
      <BottomSheetScrollView
        bounces={false}
        contentContainerStyle={styles.containStyle}>
        <Flex
          p={'spacing10'}
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mx={'spacing10'}
          borderWidth={1}
          borderColor={'background3'}>
          <Text variant={'bodySmall'} color={'textSecondary'}>
            {t('gender')}
          </Text>
          <Flex flexDirection={'row'} justifyContent={'center'}>
            {renderGenderItem({item: 'man'})}
            {renderGenderItem({item: 'woman'})}
            {renderGenderItem({item: 'other'})}
          </Flex>
        </Flex>
        <Text
          px={'spacing14'}
          mt={'spacing16'}
          fontWeight={'bold'}
          color={'textPrimary'}
          variant={'bodySmall'}>
          {t('advanced_filter')}
        </Text>
        <Flex
          p={'spacing10'}
          mt={'spacing10'}
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mx={'spacing10'}
          borderWidth={1}
          borderColor={'background3'}>
          <Text variant={'bodySmall'} color={'textSecondary'}>
            {t('i_want_them_to_come_from')}...
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
          p={'spacing10'}
          mt={'spacing18'}
          borderRadius={'rounded8'}
          justifyContent={'center'}
          mx={'spacing10'}
          borderWidth={1}
          borderColor={'background3'}>
          <Text variant={'bodySmall'} color={'textSecondary'}>
            {t('i_want_them_to_speak')}...
          </Text>
          <FlatList
            bounces={false}
            renderItem={renderLanguage}
            numColumns={3}
            data={languageList}
            keyExtractor={i => i}
          />
        </Flex>
      </BottomSheetScrollView>
      {footerComponent()}
    </Flex>
  );
};

export default SelectCountryScreen;

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
    paddingTop: 20,
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
