import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Image from 'app/components/core/Image/Image';
import {forbidenImages} from 'app/constants';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

type Props = NativeStackScreenProps<AppStackParamList, Stack.UploadImageScreen>;

const UploadImageScreen: React.FC<Props> = ({navigation, route}) => {
  //@ts-ignore
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [100 + 110 + 50 * 3], []);
  const theme = useAppTheme();
  const {fullData} = route.params;

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={styles.backdrop}
        pressBehavior="close"
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const renderImage = useCallback(
    ({item}: {item: any}) => (
      <Flex
        borderRadius={'rounded4'}
        alignItems={'center'}
        justifyContent={'center'}
        borderColor={'violetVibrant'}>
        <Image source={{uri: item.uri}} style={styles.image} />
        <Text
          style={{marginTop: -15}}
          variant={'bodyMicro'}
          color={'accentCritical'}>
          {t(item.title) + ' '}
          <Ionicon
            style={{marginTop: 2}}
            name="close-circle-sharp"
            color={'red'}
            size={16}
          />
        </Text>
      </Flex>
    ),
    [t],
  );

  const fromCamera = async () => {
    console.log('now we lauch the camera');

    const image = await launchCamera({
      mediaType: 'photo',
    });
    const res = image.assets?.[0]?.uri as string;
    !fullData && route.params.callback(res);
    fullData && route.params.callback(res);
    navigation.goBack();
  };

  const fromLibrary = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    const res = image.assets?.[0]?.uri as string;
    !fullData && route.params.callback(res);
    fullData && route.params.callback(image);
    navigation.goBack();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: theme.colors.background2}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      style={styles.bsheet}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.contentContainer}>
        <Flex py={'spacing10'} alignItems={'center'}>
          <Text mx={'spacing10'} color={'accentCritical'} variant={'bodyMicro'}>
            <Ionicon name="warning-outline" color={'red'} size={16} />
            {t('upload_image_desc')}
          </Text>
        </Flex>
        <Flex
          borderTopWidth={0.5}
          borderTopColor={'backgroundOutline'}
          pt={'spacing10'}
          flexDirection={'row'}>
          {forbidenImages.map(item => renderImage({item}))}
        </Flex>
        <Touchable onPress={fromCamera}>
          <Flex
            justifyContent={'center'}
            width={SCREEN_WIDTH}
            mt={'spacing24'}
            alignItems={'center'}
            height={50}
            borderTopWidth={1}
            borderTopColor={'background0'}>
            <Text color={'textPrimary'} variant={'bodySmall'}>
              {t('camera')}
            </Text>
          </Flex>
        </Touchable>
        <Touchable onPress={fromLibrary}>
          <Flex
            justifyContent={'center'}
            width={SCREEN_WIDTH}
            alignItems={'center'}
            height={50}
            borderTopWidth={1}
            borderTopColor={'background0'}>
            <Text color={'textPrimary'} variant={'bodySmall'}>
              {t('album')}
            </Text>
          </Flex>
        </Touchable>
        <Touchable onPress={navigation.goBack}>
          <Flex
            justifyContent={'center'}
            width={SCREEN_WIDTH}
            alignItems={'center'}
            height={50}
            borderTopWidth={1}
            borderTopColor={'background0'}>
            <Text color={'accentCritical'} variant={'bodySmall'}>
              {t('cancel')}
            </Text>
          </Flex>
        </Touchable>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default UploadImageScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  bottomSheet: {
    alignItems: 'center',
    elevation: 5,
    left: 0,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    width: '100%',
    zIndex: 1,
  },
  fullView: {
    height: '100%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  bsheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
