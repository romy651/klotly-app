/**
 * @Project Summarised
 * @File LandingScreen.tsx
 * @Path app/screen/OnBoardingStack
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import React, {useCallback, useState} from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {useAppTheme} from '../../hooks/theme/useAppTheme';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnBoardingStackParamList} from '../../routes/screens/Screens.types';
import {OnBoardingScreens} from '../../routes/screens/Stack';
import {useTranslation} from 'react-i18next';
import Animated from 'react-native-reanimated';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheckBox from 'app/components/Radio/CheckBox';
import {AVAILABLE_TOPICS} from 'app/constants';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useDispatch} from 'react-redux';
import {addTopics} from 'app/redux/config/config.reducer';
import {Platform} from 'react-native';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  OnBoardingStackParamList,
  OnBoardingScreens.ChooseSubTopicScreen
>;

const ChooseSubTopicScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const {topic} = route.params;
  //@ts-ignore
  const subTopics: string[] = AVAILABLE_TOPICS[topic];
  const [value, setValue] = useState<string[]>([]);
  const dispatch = useDispatch();

  const onChange = (val: number[]) => {
    const res = val.map(elt => subTopics[elt]) as string[];
    setValue(res);
  };

  const onDone = useCallback(() => {
    dispatch(addTopics({topic, subTopics: value}));
    navigation.navigate(OnBoardingScreens.HomeSignUpScreen);
  }, [dispatch, topic, value, navigation]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        style={{paddingBottom: Platform.OS === 'ios' ? inset.bottom : 0}}
        px={'spacing20'}
        width="100%">
        <Button
          disabled={value?.length == 0}
          backgroundColor={value?.length == 0 ? 'background3' : 'textPrimary'}
          emphasis={
            value.length == 0
              ? ButtonEmphasis.Secondary
              : ButtonEmphasis.Background
          }
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={onDone}>
          {t('continue')}
        </Button>
      </Flex>
    ),
    [onDone, value, inset.bottom, t],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <Flex
        pl={'spacing10'}
        backgroundColor={'background2'}
        height={50}
        width={'100%'}>
        <TouchableIcon
          Component={Ionicon}
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          color={theme.colors.textPrimary}
          action={navigation.goBack}
          size={24}
        />
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <Animated.ScrollView
          bounces
          contentContainerStyle={{
            width: SCREEN_WIDTH,
            marginTop: 25,
            paddingHorizontal: 15,
            paddingBottom: isAndroid ? 10 : inset.bottom + 80,
          }}>
          <Flex>
            <Text
              fontWeight={'bold'}
              color={'textPrimary'}
              variant={'subheadLarge'}>
              {t('welcome_learn_subtopic')}
            </Text>
            <Flex mt={'spacing20'}>
              <CheckBox
                labels={subTopics.map(elt => t(elt))}
                values={subTopics.map((_, key) => key)}
                onChange={onChange}
                defaultSelected={[]}
              />
            </Flex>
          </Flex>
        </Animated.ScrollView>
        {footerComponent()}
      </Flex>
    </Screen>
  );
};

export default ChooseSubTopicScreen;
