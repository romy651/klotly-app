import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useBackHandler} from '@react-native-community/hooks';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {allLanguages, LanguageType} from 'app/constants/languages';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Button, ButtonEmphasis} from 'app/components/core/Button/Button';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {sleep} from 'app/utils/tools';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.HomeLanguageScreen
>;

const HomeLanguageScreen: React.FC<Props> = ({navigation, route}) => {
  //@ts-ignore
  const {t} = useTranslation();
  const languages = route.params.languages;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['78%'], []);
  const [selectedLang, setSelectedLang] = useState<string[]>(languages);
  const [query, setQuery] = useState<string>('');
  const [List, setList] = useState<LanguageType[]>(allLanguages);
  const theme = useAppTheme();
  const inset = useSafeAreaInsets();
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
    route.params.callback(
      selectedLang.length == 0 ? ['English'] : selectedLang,
    );
    navigation.goBack();
  }, [selectedLang, navigation, route.params]);

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={styles.backdrop}
        pressBehavior="close"
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const footerComponent = useCallback(
    () => (
      <Flex
        px={'spacing20'}
        borderTopWidth={2}
        backgroundColor={'background0'}
        borderTopColor={'background3'}
        bottom={0}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        paddingVertical="spacing10"
        width="100%">
        <Button
          backgroundColor={'accentBranded'}
          emphasis={ButtonEmphasis.Outline}
          onPress={onSubmit}>
          {t('confirm')}
        </Button>
      </Flex>
    ),
    [onSubmit, t, inset.bottom],
  );

  const renderItem = useCallback(
    ({item, index}: {item: LanguageType; index: number}) => (
      <Touchable onPress={() => addItem(item.display)}>
        <Flex
          height={40}
          width={(SCREEN_WIDTH - 40) / 3}
          backgroundColor={
            selectedLang.includes(item.display) ? 'background2' : 'background0'
          }
          mx={'spacing4'}
          borderRadius={'rounded4'}
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
      alignItems={'center'}
      flexDirection={'row'}
      width={'100%'}
      px={'spacing10'}>
      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        placeholder={t('search') as string}
        style={{...styles.input}}
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
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      style={styles.bsheet}
      backgroundStyle={{backgroundColor: theme.colors.background2}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <Flex
        borderBottomWidth={2}
        borderBottomColor={'background3'}
        backgroundColor={'background2'}
        gap={'spacing10'}
        py={'spacing1'}
        alignItems={'center'}>
        <Text
          mx={'spacing10'}
          color={'textPrimary'}
          variant={'buttonLabelLarge'}
          fontWeight={'bold'}>
          {t('ispeak')}
        </Text>
        <Text mx={'spacing10'} color={'textPrimary'} variant={'bodyMicro'}>
          {t('add_language_desc')}
        </Text>
        {renderInput()}
      </Flex>
      <BottomSheetFlatList
        bounces={false}
        renderItem={renderItem}
        contentContainerStyle={{
          ...styles.containStyle,
          backgroundColor: theme.colors.background0,
        }}
        numColumns={3}
        data={List}
        keyExtractor={i => i.display}
      />
      {footerComponent()}
    </BottomSheet>
  );
};

export default HomeLanguageScreen;

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
    paddingTop: 10,
    paddingBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
