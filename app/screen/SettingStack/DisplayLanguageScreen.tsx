import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, Platform} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import i18nBase from 'i18next';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native-gesture-handler';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {changeAppLanguage} from 'app/redux/config/config.reducer';
import {isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.DisplayLanguageScreen
>;

const DisplayLanguageScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const currentLanguage = i18nBase.language;
  const dispatch = useAppDispatch();
  const [c_lang, setLang] = React.useState<string>(currentLanguage);

  const onChangeLanguage = (language: string) => {
    dispatch(changeAppLanguage(language));
  };

  const onSave = () => {
    navigation.goBack();
    if (c_lang !== currentLanguage) {
      onChangeLanguage(c_lang);
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
            {t('display_language')}
          </Text>
        </Flex>
        <View style={styles.saveButton}>
          <Touchable onPress={onSave}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelMedium'}
              color={'accentAction'}>
              {t('save')}
            </Text>
          </Touchable>
        </View>
      </View>

      <ScrollView
        style={{backgroundColor: theme.colors.background0}}
        showsVerticalScrollIndicator={false}>
        <Touchable onPress={() => setLang('en')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('English')}
              </Text>
            </Flex>
            {c_lang === 'en' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setLang('de')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Deutsch')}
              </Text>
            </Flex>
            {c_lang === 'de' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('fr')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Français')}
              </Text>
            </Flex>
            {c_lang === 'fr' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('es')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Español')}
              </Text>
            </Flex>
            {c_lang === 'es' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('ar')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('العربية')}
              </Text>
            </Flex>
            {c_lang === 'ar' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('vi')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Tiếng việt')}
              </Text>
            </Flex>
            {c_lang === 'vi' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('pt')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Português')}
              </Text>
            </Flex>
            {c_lang === 'pt' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => setLang('tr')}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('Türk')}
              </Text>
            </Flex>
            {c_lang === 'tr' && (
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Entypo
                  color={theme.colors.accentActive}
                  name="check"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 10,
    paddingLeft: 15,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});

export default DisplayLanguageScreen;
