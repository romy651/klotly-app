/**
 * @Project Summarised
 * @File LandingScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import React from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../routes/screens/Screens.types';
import {Stack} from '../../routes/screens/Stack';
import {useTranslation} from 'react-i18next';
import {Platform, TouchableNativeFeedback as Touchable} from 'react-native';
import Animated from 'react-native-reanimated';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AppStackParamList, Stack.SelectTopic>;

const SelectTopicScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const {forced} = route.params;
  const inset = useSafeAreaInsets();

  const onChoose = (value: string) => {
    navigation.navigate(Stack.SelectSubTopic, {topic: value});
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <Flex backgroundColor={'background2'} height={50} width={'100%'}>
        {!forced && (
          <TouchableIcon
            Component={Ionicon}
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
            color={theme.colors.textPrimary}
            action={navigation.goBack}
            size={24}
          />
        )}
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <Animated.ScrollView
          contentContainerStyle={{
            width: SCREEN_WIDTH,
            marginTop: 25,
            paddingHorizontal: 15,
            paddingBottom: inset.bottom + 80,
          }}>
          <Flex>
            <Text
              fontWeight={'bold'}
              color={'textPrimary'}
              variant={'subheadLarge'}>
              {t('welcome_learn_topic')}
            </Text>
            <Touchable onPress={() => onChoose('languages')}>
              <Flex
                mt={'spacing20'}
                flexDirection={'row'}
                borderWidth={1}
                p={'spacing14'}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderColor={'background3'}
                borderRadius={'rounded8'}>
                <MatIcon
                  name="language"
                  color={theme.colors.textSecondary}
                  size={18}
                />
                <Text
                  style={{marginRight: 'auto'}}
                  color={'textPrimary'}
                  variant={'subheadSmall'}>
                  {t('languages')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  color={theme.colors.textPrimary}
                  size={18}
                />
              </Flex>
            </Touchable>
            <Touchable onPress={() => onChoose('health_wellness')}>
              <Flex
                flexDirection={'row'}
                borderWidth={1}
                p={'spacing14'}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderColor={'background3'}
                borderRadius={'rounded8'}>
                <Ionicon
                  name="medical-outline"
                  color={theme.colors.textSecondary}
                  size={18}
                />
                <Text
                  style={{marginRight: 'auto'}}
                  color={'textPrimary'}
                  variant={'subheadSmall'}>
                  {t('health_wellness')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  color={theme.colors.textPrimary}
                  size={18}
                />
              </Flex>
            </Touchable>
            <Touchable onPress={() => onChoose('humanity')}>
              <Flex
                flexDirection={'row'}
                borderWidth={1}
                p={'spacing14'}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderColor={'background3'}
                borderRadius={'rounded8'}>
                <Ionicon
                  name="reader-outline"
                  color={theme.colors.textSecondary}
                  size={18}
                />
                <Text
                  style={{marginRight: 'auto'}}
                  color={'textPrimary'}
                  variant={'subheadSmall'}>
                  {t('humanity')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  color={theme.colors.textPrimary}
                  size={18}
                />
              </Flex>
            </Touchable>
            <Touchable onPress={() => onChoose('art')}>
              <Flex
                flexDirection={'row'}
                borderWidth={1}
                p={'spacing14'}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderColor={'background3'}
                borderRadius={'rounded8'}>
                <Octicons
                  name="paintbrush"
                  color={theme.colors.textSecondary}
                  size={18}
                />
                <Text
                  style={{marginRight: 'auto'}}
                  color={'textPrimary'}
                  variant={'subheadSmall'}>
                  {t('art')}
                </Text>
                <Ionicon
                  name="chevron-forward"
                  color={theme.colors.textPrimary}
                  size={18}
                />
              </Flex>
            </Touchable>
          </Flex>
        </Animated.ScrollView>
      </Flex>
    </Screen>
  );
};

export default SelectTopicScreen;
