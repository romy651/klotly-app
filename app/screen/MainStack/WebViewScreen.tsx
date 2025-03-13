import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {OnBoardingScreens, Stack} from 'app/routes/screens/Stack';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Alert, TouchableNativeFeedback as Touchable} from 'react-native';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {logoutUser} from 'app/redux/user/userReducer';
import {deleteUser} from 'app/utils/tools';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

type Props = NativeStackScreenProps<AppStackParamList, Stack.WebViewScreen>;

const WebViewScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const {url, title} = route.params;

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader title={title} showBackButton showBorder />
      <Flex p={'spacing20'} backgroundColor={'background0'} flex={1}>
        <Flex
          width={'100%'}
          p={'spacing14'}
          borderRadius={'rounded8'}
          backgroundColor={'accentWarningSoft'}>
          <Text variant={'buttonLabelSmall'} color={'accentWarning'}>
            {t('delete_account_warn')}
          </Text>
        </Flex>
        <Text variant="bodyLarge" color={'textPrimary'}>
          {t('delete_account_desc')}
        </Text>
      </Flex>
    </Screen>
  );
};

export default WebViewScreen;
