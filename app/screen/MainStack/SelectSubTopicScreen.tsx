import React, {useCallback, useState} from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../routes/screens/Screens.types';
import {Stack} from '../../routes/screens/Stack';
import {useTranslation} from 'react-i18next';
import Animated from 'react-native-reanimated';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
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
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {Platform} from 'react-native';

type Props = NativeStackScreenProps<AppStackParamList, Stack.SelectSubTopic>;

const SelectSubTopicScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const s_topic = useAppSelector(state => state.application.subTopics) || [];
  const {topic} = route.params;
  //@ts-ignore
  const subTopics: string[] = AVAILABLE_TOPICS[topic];
  const [value, setValue] = useState<string[]>([]);
  const dispatch = useDispatch();

  const defaultValue = (s_topic || [])
    .map(val => subTopics.findIndex(el => el === val))
    .filter(l => l > -1);

  const onChange = (val: number[]) => {
    const res = val.map(elt => subTopics[elt]) as string[];
    setValue(res);
  };

  const onDone = useCallback(() => {
    dispatch(addTopics({topic, subTopics: value}));
    const routes = [
      {
        name: Stack.BottomTabsStack,
      },
    ];
    navigation.reset({
      index: 0,
      routes,
    });
  }, [dispatch, topic, value, navigation]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        style={{paddingBottom: Platform.OS === 'ios' ? inset.bottom : 10}}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'textPrimary'}
          emphasis={ButtonEmphasis.Background}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={onDone}>
          {t('continue')}
        </Button>
      </Flex>
    ),
    [onDone, inset.bottom, t],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader showBackButton showBorder />
      <Flex flex={1} backgroundColor={'background0'}>
        <Animated.ScrollView
          bounces
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
              {t('welcome_learn_subtopic')}
            </Text>
            <Flex mt={'spacing20'}>
              <CheckBox
                labels={subTopics.map(elt => t(elt))}
                values={subTopics.map((_, key) => key)}
                onChange={onChange}
                defaultSelected={defaultValue}
              />
            </Flex>
          </Flex>
        </Animated.ScrollView>
        {footerComponent()}
      </Flex>
    </Screen>
  );
};

export default SelectSubTopicScreen;
