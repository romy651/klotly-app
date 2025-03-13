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
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.DeleteAccountScreen
>;

const DeleteAccount: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.user);
  const inset = useSafeAreaInsets();
  const onDelete = useCallback(() => {
    Alert.alert(t('are_you_sure') as string, '', [
      {
        text: t('cancel') as string,
        style: 'cancel',
      },
      {
        text: t('proceed') as string,
        onPress: () => {
          dispatch(logoutUser());
          deleteUser(me.id);
          navigation.replace(Stack.OnBoardingStack, {
            screen: OnBoardingScreens.WelcomeScreen,
          });
        },
      },
    ]);
  }, [t, dispatch, navigation, me.id]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopWidth={1}
        borderTopColor={'background3'}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        flexDirection={'row'}
        justifyContent={'center'}
        width="100%">
        <Flex width={SCREEN_WIDTH / 2 - 30}>
          <Touchable onPress={navigation.goBack}>
            <Flex width={'100%'} borderRadius={'rounded16'}>
              <Flex
                backgroundColor={'background3'}
                borderRadius={'rounded12'}
                height={45}
                alignItems={'center'}
                justifyContent={'center'}
                paddingVertical={'spacing10'}
                paddingHorizontal={'spacing20'}>
                <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                  {t('cancel')}
                </Text>
              </Flex>
            </Flex>
          </Touchable>
        </Flex>
        <Flex width={SCREEN_WIDTH / 2 - 30}>
          <Touchable onPress={onDelete}>
            <Flex width={'100%'} borderRadius={'rounded16'}>
              <Flex
                backgroundColor={'accentCritical'}
                borderRadius={'rounded12'}
                height={45}
                alignItems={'center'}
                justifyContent={'center'}
                paddingVertical={'spacing10'}
                paddingHorizontal={'spacing20'}>
                <Text variant={'buttonLabelSmall'} color={'white'}>
                  {t('proceed')}
                </Text>
              </Flex>
            </Flex>
          </Touchable>
        </Flex>
      </Flex>
    ),
    [t, navigation.goBack, onDelete, inset.bottom],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('delete_account') as string}
        showBackButton
        showBorder
      />
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
      {footerComponent()}
    </Screen>
  );
};

export default DeleteAccount;
