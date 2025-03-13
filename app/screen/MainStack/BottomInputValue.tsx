import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useBackHandler} from '@react-native-community/hooks';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {validateEmail} from 'app/utils/tools';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.BottomInputValue>;

const BottomInputValue: React.FC<Props> = ({navigation, route}) => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [value, setValue] = useState<string>(route.params.value);
  const [email, setEmail] = useState<string>(route.params.value);
  const [gender, setGender] = useState<'man' | 'woman' | 'other'>(
    route.params.value as any,
  );
  const inset = useSafeAreaInsets();
  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  useEffect(() => {
    if (
      route.params.type === 'firstName' ||
      route.params.type === 'lastName' ||
      route.params.type === 'email' ||
      route.params.type === 'intro'
    ) {
      if ((value || '').length > 4) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    }
  }, [value]);

  useEffect(() => {
    if (validateEmail(email)) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }, [email]);

  useEffect(() => {
    if (gender !== route.params.value) {
      setIsCorrect(true);
    }
  }, [gender]);

  const ondDone = useCallback(() => {
    console.log('what we return', email);
    route.params.type == 'firstName'
      ? route.params.callback(value)
      : route.params.type == 'lastName'
      ? route.params.callback(value)
      : route.params.type == 'email'
      ? route.params.callback(email)
      : route.params.type == 'intro'
      ? route.params.callback(value)
      : route.params.callback(gender);
    navigation.goBack();
  }, [value, gender, email]);

  const renderGenderItem = useCallback(
    ({item}: {item: 'man' | 'woman' | 'other'}) => (
      <Touchable onPress={() => setGender(item)}>
        <Flex
          width={(SCREEN_WIDTH - 100) / 3}
          backgroundColor={item == gender ? 'background3' : 'background3'}
          borderRadius={'rounded4'}
          alignItems={'center'}
          justifyContent={'center'}
          py={'spacing10'}
          mt={'spacing60'}
          borderColor={'violetVibrant'}
          borderWidth={item == gender ? 1 : 0}>
          <Text color={'textSecondary'} variant={'headlineLarge'}>
            {item == 'man' ? '👱🏼‍♂️' : item == 'woman' ? '👱🏼‍♀️' : '⚧️'}
          </Text>
          <Text
            style={{marginTop: -10}}
            color={'textSecondary'}
            variant={'bodySmall'}>
            {item}
          </Text>
        </Flex>
      </Touchable>
    ),
    [gender],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        showBackButton
        showBorder
        title={t(route.params.type) as string}
      />
      <Flex
        paddingHorizontal={'spacing10'}
        flex={1}
        pt={'spacing10'}
        backgroundColor={'background0'}>
        {(route.params.type === 'firstName' ||
          route.params.type === 'lastName') && (
          <Flex flexDirection={'row'} alignItems={'center'}>
            <TextInput
              onChangeText={setValue}
              value={value}
              autoCapitalize="none"
              textColor={theme.colors.textPrimary}
              activeUnderlineColor={'transparent'}
              cursorColor={theme.colors.textSecondary}
              style={{
                ...styles.input,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.background1,
                borderColor: theme.colors.textSecondary,
              }}
            />
          </Flex>
        )}
        {route.params.type === 'intro' && (
          <Flex flexDirection={'row'}>
            <TextInput
              onChangeText={setValue}
              value={value}
              multiline
              maxLength={200}
              cursorColor={theme.colors.textSecondary}
              numberOfLines={5}
              placeholder={t('input_here') as string}
              autoCapitalize="none"
              textColor={theme.colors.textPrimary}
              activeUnderlineColor={'transparent'}
              style={{
                ...styles.input,
                color: theme.colors.textPrimary,
                minHeight: 100,
                backgroundColor: theme.colors.background1,
                borderColor: theme.colors.textSecondary,
              }}
            />
          </Flex>
        )}
        {route.params.type === 'email' && (
          <Flex flexDirection={'row'} alignItems={'center'}>
            <TextInput
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              textColor={theme.colors.textPrimary}
              activeUnderlineColor={'transparent'}
              cursorColor={theme.colors.textSecondary}
              style={{
                ...styles.input,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.background1,
                borderColor: theme.colors.textSecondary,
              }}
            />
          </Flex>
        )}
        {route.params.type === 'seeking' && (
          <Flex
            mx={'spacing10'}
            flexDirection={'row'}
            justifyContent={'center'}>
            {renderGenderItem({item: 'man'})}
            {renderGenderItem({item: 'woman'})}
            {renderGenderItem({item: 'other'})}
          </Flex>
        )}
        <Flex
          position={'absolute'}
          bottom={0}
          width={SCREEN_WIDTH}
          borderTopWidth={1.5}
          style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
          px={'spacing10'}
          paddingVertical={'spacing10'}
          borderColor={'background3'}>
          <Touchable onPress={() => isCorrect && ondDone()}>
            <Flex
              backgroundColor={isCorrect ? 'accentActive' : 'background3'}
              borderRadius={'rounded8'}
              alignItems={'center'}
              justifyContent={'center'}
              height={45}>
              <Text variant={'buttonLabelMedium'} color={'white'}>
                {t('submit')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </Flex>
    </Screen>
  );
};

export default BottomInputValue;

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    top: 22,
    right: 32,
    width: 14,
    height: 14,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    width: '100%',
  },
  headerView: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },

  backButton: {
    position: 'absolute',
    left: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
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
    marginHorizontal: 15,
  },
});
