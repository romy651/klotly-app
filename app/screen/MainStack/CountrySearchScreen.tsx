import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useBackHandler} from '@react-native-community/hooks';
import {BottomSheetFlatList, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FilterStackParamList} from 'app/routes/screens/Screens.types';
import {FilterStackScreens} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {allCountries, CountryItem} from 'app/constants/languages';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {array_move, sleep} from 'app/utils/tools';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import CountryFlag from 'react-native-country-flag';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {updateUserFilter} from 'app/redux/config/config.reducer';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  FilterStackParamList,
  FilterStackScreens.CountrySearchScreen
>;

const SearchCountryScreen: React.FC<Props> = ({navigation, route}) => {
  //@ts-ignore
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const inset = useSafeAreaInsets();
  const theme = useAppTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAppSelector(state => state.user);
  const user_country_index = allCountries.findIndex(c => {
    if (c) {
      return c.code === user.country.toUpperCase();
    }
  });
  console.log('THE COUNTRY INDEX', user_country_index);
  const appState = useAppSelector(state => state.application);
  const bottomSheetRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const [List, setList] = useState<CountryItem[]>(
    array_move(allCountries, user_country_index, 0),
  );

  console.log('THE LIST', List);

  useEffect(() => {
    console.log('app state', appState.userFilter);
    if (query.length == 0) {
      setList(allCountries);
    } else {
      let res = [];
      sleep(100);
      res = allCountries.filter(
        elt =>
          elt.code.toLowerCase().includes(query.toLowerCase()) ||
          elt.name.toLowerCase().includes(query.toLowerCase()),
      );
      setList(res);
    }
  }, [query]);

  const addItem = useCallback(
    (index: string) => {
      console.log('begining: ', selectedLang);
      const _id = selectedLang.findIndex(elt => elt == index);
      let _temp = [...selectedLang];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else if (selectedLang.length < 3) {
        _temp = [..._temp, index];
      }
      setSelectedLang(_temp);
    },
    [setSelectedLang, selectedLang],
  );

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  const onSubmit = useCallback(() => {
    setLoading(true);
    dispatch(
      updateUserFilter({...appState.userFilter, countries: selectedLang}),
    );
    route.params.callBack(selectedLang);
    navigation.goBack();
  }, [selectedLang, loading, setSelectedLang]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          loading={loading}
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 10}}
          onPress={onSubmit}>
          {t('confirm')}
        </Button>
      </Flex>
    ),
    [onSubmit],
  );

  const renderInput = () => (
    <Flex
      style={{marginVertical: -10}}
      alignItems={'center'}
      borderBottomWidth={1}
      borderBottomColor={'background3'}
      flexDirection={'row'}
      width={'100%'}
      px={'spacing10'}>
      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        placeholder={t('search') as string}
        style={{...styles.input, color: theme.colors.textPrimary}}
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && (
        <TouchableIcon
          name="close-circle-sharp"
          Component={Ionicon}
          action={() => setQuery('')}
          color={theme.colors.textSecondary}
          size={18}
          style={{position: 'absolute', right: 35}}
        />
      )}
      <Ionicon
        name="search-outline"
        size={18}
        color={theme.colors.textSecondary}
        style={{position: 'absolute', right: 20}}
      />
    </Flex>
  );

  const renderItem = useCallback(
    ({item, index}: {item: CountryItem; index: number}) => (
      <Touchable key={index} onPress={() => addItem(item.code)}>
        <Flex
          height={40}
          width={(SCREEN_WIDTH - 45) / 3}
          backgroundColor={
            selectedLang.includes(item.code) ? 'background3' : 'background0'
          }
          mx={'spacing4'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          my={'spacing4'}
          borderColor={
            selectedLang.includes(item.code) ? 'textPrimary' : 'background3'
          }
          flexDirection={'row'}
          borderWidth={1.5}>
          <CountryFlag
            style={{marginRight: -10, borderRadius: 3, marginTop: -2}}
            isoCode={item.code}
            size={14}
          />
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {item.code}
          </Text>
        </Flex>
      </Touchable>
    ),
    [selectedLang],
  );

  return (
    <Flex
      backgroundColor={'background0'}
      ref={bottomSheetRef}
      style={styles.bsheet}>
      <ViewHeader
        title={t('choose_country') as string}
        showBorder
        showBackButton
      />
      {renderInput()}
      <BottomSheetFlatList
        bounces={false}
        renderItem={renderItem}
        contentContainerStyle={styles.containStyle}
        numColumns={3}
        data={List}
      />
      {footerComponent()}
    </Flex>
  );
};

export default SearchCountryScreen;

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
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  bsheet: {
    width: '100%',
    height: '100%',
  },
});
