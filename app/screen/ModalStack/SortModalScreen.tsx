import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useBackHandler} from '@react-native-community/hooks';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LibraryStackParamList} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens} from 'app/routes/screens/Stack';
import {theme} from 'app/themes/Theme';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = NativeStackScreenProps<
  LibraryStackParamList,
  LibraryStackScreens.SortModalScreen
>;

const SortModalScreen: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(SCREEN_HEIGHT - 390);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const handleSheetChanges = useCallback(
    (ind: number) => {
      if (ind === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

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

  useEffect(() => {
    translateY.value = withTiming(0, {duration: 300});
  }, []);

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: theme.colors.background0}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      style={styles.bsheet}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme.colors.background0}}>
        <Flex
          alignItems="center"
          gap="none"
          justifyContent="center"
          mx="spacing10"
          my="spacing4">
          <Flex
            alignItems="center"
            borderBottomColor="accentActionSoft"
            borderBottomWidth={2}
            flexDirection="row"
            px="spacing16"
            py="spacing10"
            width={SCREEN_WIDTH}>
            <Flex gap="none">
              <Text
                color="textPrimary"
                fontWeight="bold"
                style={{width: SCREEN_WIDTH - 100}}
                variant="bodyLarge">
                {t('sort_by')}
              </Text>
            </Flex>
          </Flex>
          <Touchable>
            <Flex
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-start"
              px="spacing14"
              py="spacing16"
              width={SCREEN_WIDTH}>
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                variant="bodySmall">
                {t('last_saved')}
              </Text>
            </Flex>
          </Touchable>
          <Touchable>
            <Flex
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-start"
              px="spacing14"
              py="spacing16"
              width={SCREEN_WIDTH}>
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                variant="bodySmall">
                {t('first_saved')}
              </Text>
            </Flex>
          </Touchable>
          <Touchable>
            <Flex
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-start"
              px="spacing14"
              py="spacing16"
              width={SCREEN_WIDTH}>
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                variant="bodySmall">
                {t('most_progress')}
              </Text>
            </Flex>
          </Touchable>
          <Touchable>
            <Flex
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-start"
              px="spacing14"
              py="spacing16"
              width={SCREEN_WIDTH}>
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                variant="bodySmall">
                {t('least_progress')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SortModalScreen;

const styles = StyleSheet.create({
  bottomSheet: {
    alignItems: 'center',
    backgroundColor: theme.colors.background1,
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
    backgroundColor: theme.colors.background0,
    elevation: 5,
  },
});
