import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import Image from 'app/components/core/Image/Image';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import _ from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

const PROFILES = [
  'https://static.preply.com/static/ssr/_next/static/images/guidelines_tutor_1-3b859e269e479a77315f7ab8b1e55453.jpg',
  'https://static.preply.com/static/ssr/_next/static/images/guidelines_tutor_2-ff60decda70e4590ddd41a2a13678e8c.jpg',
  'https://static.preply.com/static/ssr/_next/static/images/guidelines_tutor_3-6185217e830ab56db0894dd5c98af51f.jpg',
  'https://static.preply.com/static/ssr/_next/static/images/guidelines_tutor_4-f452a6294a2b63332a29793ae10ef1b4.jpg',
];

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.UploadProfileScreen
>;

const UploadProfileScreen: React.FC<Props> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);
  const theme = useAppTheme();

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
        <Image source={{uri: item}} style={styles.image} />
      </Flex>
    ),
    [],
  );

  /*const fromLibrary = () => {
    console.log('WE SHOULD GOBACK NOW 1 ');
    /*await launchImageLibrary({mediaType: 'photo'}).then(result => {
      console.log('WE SHOULD GOBACK NOW 2: ');
      //@ts-ignore
      result && route.params.callback(result.assets[0].uri);
      navigation.goBack();
    });*/

  const handleClick = useCallback(
    _.debounce(async () => {
      console.log('Button clicked');
      await launchImageLibrary({mediaType: 'photo'}).then(result => {
        console.log('WE SHOULD GOBACK NOW 2: ');
        //@ts-ignore
        result && route.params.callback(result.assets[0].uri);
        navigation.goBack();
      });
    }, 300), // 1000ms debounce time
    [],
  );

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        bottom={0}
        borderTopColor={'background3'}
        borderTopWidth={1}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={handleClick}>
          {t('choose_photo')}
        </Button>
      </Flex>
    ),
    [],
  );

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
      <Flex
        width={'100%'}
        borderBottomWidth={2}
        borderBottomColor={'background3'}
        py={'spacing10'}
        alignItems={'center'}>
        <Text
          mx={'spacing10'}
          color={'textPrimary'}
          variant={'buttonLabelLarge'}
          fontWeight={'bold'}>
          {t('profile_photo')}
        </Text>
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <BottomSheetScrollView
          bounces={false}
          contentContainerStyle={{paddingBottom: 30}}
          style={styles.contentContainer}>
          <Text
            mx={'spacing16'}
            mt={'spacing10'}
            variant={'bodySmall'}
            color={'textPrimary'}>
            {t('profile_photo_desc')}
          </Text>
          <Flex
            justifyContent={'center'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            gap={'spacing10'}
            pt={'spacing10'}
            pb={'spacing16'}
            flexDirection={'row'}>
            {PROFILES.map(item => renderImage({item}))}
          </Flex>
          <Text
            style={{width: '100%'}}
            textAlign={'left'}
            ml={'spacing16'}
            mt={'spacing10'}
            variant={'buttonLabelSmall'}
            color={'textPrimary'}>
            {t('requirements_best_photo')}
          </Text>
          <Flex mt={'spacing20'} gap={'spacing10'}>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_1')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_2')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_3')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_4')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_5')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_6')}
              </Text>
            </Flex>
            <Flex px={'spacing16'} flexDirection={'row'}>
              <Entypo name="check" color={theme.colors.textPrimary} size={18} />
              <Text
                style={styles.listText}
                variant={'bodyMicro'}
                color={'textPrimary'}>
                {t('photo_req_7')}
              </Text>
            </Flex>
          </Flex>
        </BottomSheetScrollView>
      </Flex>
      {footerComponent()}
    </BottomSheet>
  );
};

export default UploadProfileScreen;

const styles = StyleSheet.create({
  listText: {
    width: SCREEN_WIDTH - 50,
    marginLeft: -10,
  },
  contentContainer: {
    flex: 1,
  },
  image: {
    width: (SCREEN_WIDTH - 50) / 4,
    height: (SCREEN_WIDTH - 50) / 4,
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
