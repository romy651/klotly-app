import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Stack} from 'app/routes/screens/Stack';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {
  EPermissionTypes,
  useCameraPermission,
} from 'app/hooks/useCameraPermission';
import {openSettings, RESULTS} from 'react-native-permissions';
import {Alert, BackHandler} from 'react-native';
import {CameraScanner} from 'app/components/camera/CameraScanner';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {pushSession} from 'app/utils/tools';

type Props = NativeStackScreenProps<AppStackParamList, Stack.ScanQRCodeScreen>;

const ScanQRCodeScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const me = useAppSelector(state => state.user);

  const [cameraShown, setCameraShown] = useState(false);
  const [qrText, setQrText] = useState('');

  const {askPermissions} = useCameraPermission(EPermissionTypes.CAMERA);

  const handleBackButtonClick = useCallback(() => {
    if (cameraShown) {
      setCameraShown(false);
    }
    return false;
  }, [cameraShown, navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [handleBackButtonClick]);

  useEffect(() => {
    takePermissions();
  }, []);

  const takePermissions = async () => {
    askPermissions()
      .then(response => {
        //permission given for camera
        if (
          response.type === RESULTS.LIMITED ||
          response.type === RESULTS.GRANTED
        ) {
          setCameraShown(true);
        }
      })
      .catch(error => {
        //permission is denied/blocked or camera feature not supported
        if ('isError' in error && error.isError) {
          Alert.alert(
            error.errorMessage ||
              'Something went wrong while taking camera permission',
          );
        }
        if ('type' in error) {
          if (error.type === RESULTS.UNAVAILABLE) {
            Alert.alert('This feature is not supported on this device');
          } else if (
            error.type === RESULTS.BLOCKED ||
            error.type === RESULTS.DENIED
          ) {
            Alert.alert(t('error'), t('library_permission') as string, [
              {
                text: t('cancel') as string,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: t('open_setting') as string,
                onPress: () => openSettings(),
              },
            ]);
          }
        }
      });
  };

  const submitSession = async (sessionId: string) => {
    const res = await pushSession(sessionId, me.id);
    console.log('res: ', res);
  };

  const handleReadCode = (value: string) => {
    console.log('THERE IS A QR CODE: ', value);
    setQrText(value);
    submitSession(value);
    setCameraShown(false);
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('scan_qr_code') as string}
        showBackButton
        showBorder
      />
      <Flex gap={'none'} backgroundColor={'background0'} flex={1}>
        <Flex
          width={'100%'}
          p={'spacing14'}
          borderRadius={'rounded8'}
          backgroundColor={'background2'}>
          <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
            {t('scan_qr_code_desc')}
          </Text>
        </Flex>
        <Flex
          flex={1}
          justifyContent={'center'}
          alignItems={'center'}
          backgroundColor={'translucentBackground'}>
          {cameraShown && (
            <CameraScanner
              setIsCameraShown={setCameraShown}
              onReadCode={handleReadCode}
            />
          )}
        </Flex>
      </Flex>
    </Screen>
  );
};

export default ScanQRCodeScreen;
