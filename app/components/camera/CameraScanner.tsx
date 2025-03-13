import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {RNHoleView} from 'react-native-hole-view';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {useAppStateListener} from '../../hooks/useAppStateListener';
import {isIos} from 'app/utils/PlatformUtils';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {Flex} from '../layout/Flex';

interface ICameraScannerProps {
  setIsCameraShown: (value: boolean) => void;
  onReadCode: (value: string) => void;
}

export const CameraScanner = ({
  setIsCameraShown,
  onReadCode,
}: ICameraScannerProps) => {
  //@ts-ignore
  const {t} = useTranslation();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const [isCameraInitialized, setIsCameraInitialized] = useState(isIos);
  const [isActive, setIsActive] = useState(isIos);
  const [flash, setFlash] = useState<'on' | 'off'>(isIos ? 'off' : 'on');
  const {appState} = useAppStateListener();
  const [codeScanned, setCodeScanned] = useState<string | undefined>();

  useEffect(() => {
    if (codeScanned) {
      onReadCode(codeScanned);
    }
  }, [codeScanned, onReadCode]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isCameraInitialized) {
      timeout = setTimeout(() => {
        setIsActive(true);
        setFlash('off');
      }, 1000);
    }
    setIsActive(false);
    return () => {
      clearTimeout(timeout);
    };
  }, [isCameraInitialized]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        console.log('CODES: ', codes);
        if (codes[0].value) {
          setIsActive(false);
          setTimeout(() => setCodeScanned(codes[0]?.value), 500);
        }
      }
      return;
    },
  });

  const onCrossClick = () => {
    setIsCameraShown(false);
  };

  const onError = (error: CameraRuntimeError) => {
    Alert.alert(t('error'), error.message);
  };

  if (device == null) {
    Alert.alert(t('error'), t('camera_error') as string);
  }

  if (isFocused && device) {
    return (
      <Flex padding={'none'}>
        <Camera
          torch={flash}
          onInitialized={onInitialized}
          ref={camera}
          onError={onError}
          photo={false}
          style={styles.fullScreenCamera}
          device={device}
          codeScanner={codeScanner}
          isActive={
            isActive &&
            isFocused &&
            appState === 'active' &&
            isCameraInitialized
          }
        />
        <RNHoleView
          holes={[
            {
              x: SCREEN_WIDTH * 0.1,
              y: SCREEN_HEIGHT * 0.18,
              width: SCREEN_WIDTH * 0.8,
              height: SCREEN_HEIGHT * 0.4,
              borderRadius: 10,
            },
          ]}
          style={[styles.rnholeView, styles.holeView]}
        />
      </Flex>
    );
  }
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: 200,
  },
  fullScreenCamera: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flex: 1,
    zIndex: 100,
  },
  holeView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flex: 1,
    zIndex: 100,
    marginTop: -17,
  },
  rnholeView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraControls: {
    height: '10%',
    top: 15,
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  icon: {
    height: 45,
    width: 45,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
