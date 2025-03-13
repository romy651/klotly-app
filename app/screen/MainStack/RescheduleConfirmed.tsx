import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.RescheduleConfirmed
>;

const RescheduleConfirmed: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {date, name, topic} = route.params;

  const onSend = useCallback(() => {
    const routes = [
      {
        name: Stack.BottomTabsStack,
      },
    ];
    navigation.reset({
      index: 0,
      routes,
    });
  }, [navigation]);

  const footerComponent = useCallback(
    () => (
      <Flex
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        pt={'spacing10'}
        style={{paddingBottom: isAndroid ? 10 : insets.bottom}}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'textPrimary'}
          emphasis={ButtonEmphasis.Background}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={onSend}>
          {t('okay')}
        </Button>
      </Flex>
    ),
    [onSend, insets.bottom, t],
  );

  return (
    <Screen backgroundColor={'accentActiveSoft'} edges={['top']}>
      <Flex pt={'spacing48'} px={'spacing10'} flex={1}>
        <Text variant={'headlineLarge'} color={'textPrimary'}>
          {t('lesson_rescheduled')}
        </Text>
        <Text variant={'subheadSmall'} color={'textPrimary'}>
          {`${t(topic)} ${t('with')} ${name}`}
        </Text>
        <Text variant={'subheadSmall'} color={'textPrimary'}>
          {`${date}`}
        </Text>
      </Flex>
      {footerComponent()}
    </Screen>
  );
};

export default RescheduleConfirmed;
