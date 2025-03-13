import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useBackHandler} from '@react-native-community/hooks';
import BottomSheet, {
  BottomSheetFlatList,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FilterStackParamList} from 'app/routes/screens/Screens.types';
import {FilterStackScreens} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {allLanguages, LanguageType} from 'app/constants/languages';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {sleep} from 'app/utils/tools';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  FilterStackParamList,
  FilterStackScreens.SelectLanguageScreen
>;

const SelectLanguageScreen: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const appState = useAppSelector(state => state.application);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedLang, setSelectedLang] = useState<string[]>(
    appState.userFilter.languages || [],
  );
  const [query, setQuery] = useState<string>('');
  const [List, setList] = useState<LanguageType[]>(allLanguages);

  useEffect(() => {
    if (query.length == 0) {
      setList(allLanguages);
    } else {
      let res = [];
      sleep(100);
      res = allLanguages.filter(elt => elt.display.includes(query));
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
    route.params.callBack(
      selectedLang.length == 0 ? ['English'] : selectedLang,
    );
    navigation.goBack();
  }, [selectedLang, setSelectedLang]);

  const footerComponent = useCallback(
    () => (
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

  const renderItem = useCallback(
    ({item, index}: {item: LanguageType; index: number}) => (
      <Touchable key={index} onPress={() => addItem(item.display)}>
        <Flex
          height={40}
          width={(SCREEN_WIDTH - 40) / 3}
          backgroundColor={
            selectedLang.includes(item.display) ? 'background3' : 'background0'
          }
          mx={'spacing4'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          my={'spacing4'}
          borderColor={
            selectedLang.includes(item.display) ? 'textPrimary' : 'background3'
          }
          borderWidth={1.5}>
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {item.display}
          </Text>
        </Flex>
      </Touchable>
    ),
    [selectedLang],
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

  return (
    <Flex
      backgroundColor={'background0'}
      ref={bottomSheetRef}
      style={styles.bsheet}>
      <ViewHeader
        title={t('choose_language') as string}
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
        keyExtractor={i => i.display}
      />
      {footerComponent()}
    </Flex>
  );
};

export default SelectLanguageScreen;

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
    paddingLeft: 7.5,
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
  bsheet: {
    width: '100%',
    height: '100%',
  },
});
