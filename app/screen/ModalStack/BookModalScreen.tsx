import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<
  LibraryStackParamList,
  LibraryStackScreens.BookModalScreen
>;

const BookModalScreen: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {book} = route.params;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%'], []);

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
            <Image
              source={{uri: book.image_url}}
              style={{width: 40, height: 40 * 1.439}}
            />
            <Flex gap="none">
              <Text
                color="textPrimary"
                fontWeight="bold"
                style={{width: SCREEN_WIDTH - 100}}
                variant="bodyLarge">
                {book.title}
              </Text>
              <Text
                color="textPrimary"
                mt="spacing4"
                numberOfLines={1}
                style={{width: SCREEN_WIDTH - 100}}
                variant="bodySmall">
                {book.author}
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
              <AntDesign
                color={theme.colors.textPrimary}
                name="staro"
                size={28}
              />
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                fontWeight={'600'}
                variant="bodySmall">
                {t('rate_title')}
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
              <Ionicons
                color={theme.colors.textPrimary}
                name="cloud-download-outline"
                size={28}
              />
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                fontWeight={'600'}
                variant="bodySmall">
                {t('download_audio')}
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
              <Feather
                color={theme.colors.textPrimary}
                name="check-square"
                size={28}
              />
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                fontWeight={'600'}
                variant="bodySmall">
                {t('mark_as_finished')}
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
              <Ionicons
                color={theme.colors.textPrimary}
                name="ios-bookmark-outline"
                size={28}
              />
              <Text
                color="textPrimary"
                mt="spacing2"
                numberOfLines={1}
                fontWeight={'600'}
                variant="bodySmall">
                {t('add_to_saved')}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default BookModalScreen;

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.background0,
    elevation: 5,
  },
});
