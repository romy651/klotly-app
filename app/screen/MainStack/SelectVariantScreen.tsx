import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {theme} from 'app/themes/Theme';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.SelectVariantScreen
>;

const SelectVariantScreen: React.FC<Props> = ({navigation, route}) => {
  const params = route.params;
  const {t} = useTranslation();
  const _theme = useAppTheme();

  const _onDone = (value: string) => {
    params.onDone([value]);
    navigation.goBack();
  };

  const isIn = (val: string, arr: String[]) => {
    'worklet';
    return arr.includes(val);
  };

  return (
    <Screen edges={['top']} backgroundColor={'background2'}>
      <ViewHeader
        showBorder
        showBackButton
        title={t(params.initValue.key) as string}
      />
      <Flex backgroundColor={'background0'} flex={1}>
        <FlatList
          data={params.initValue.value}
          contentContainerStyle={{
            height: '100%',
            width: '100%',
            paddingBottom: params.initValue.type == 'select' ? 70 : 0,
          }}
          renderItem={({item, index}) => {
            const sar = isIn(item, params.initChecked || ([] as string[]));
            return (
              <Touchable onPress={() => _onDone(item)} key={index}>
                <Flex
                  flexDirection={'row'}
                  paddingHorizontal={'spacing10'}
                  gap={'none'}
                  height={60}
                  borderWidth={1}
                  alignItems={'center'}
                  borderColor={'background3'}>
                  {sar ? (
                    <MaterialIcon
                      style={{marginLeft: 10, marginRight: 25}}
                      {...{
                        name: 'check-circle',
                        size: 23,
                        color: _theme.colors.textSecondary,
                      }}
                    />
                  ) : (
                    <View style={styles.nonChecked} />
                  )}
                  <Text
                    variant={'bodyLarge'}
                    color={sar ? 'textPrimary' : 'textSecondary'}
                    numberOfLines={1}>
                    {t(item) as string}
                  </Text>
                </Flex>
              </Touchable>
            );
          }}
        />
      </Flex>
    </Screen>
  );
};

export default SelectVariantScreen;

const styles = StyleSheet.create({
  container: {},
  selectText: {},
  viewItem: {
    width: '100%',
    paddingHorizontal: 7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  textInput: {
    width: SCREEN_WIDTH - 30 - 44,
    height: '100%',
  },
  title: {},
  description: {},
  text: {},
  nonChecked: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.background3,
    marginLeft: 10,
    marginRight: 25,
  },
});
