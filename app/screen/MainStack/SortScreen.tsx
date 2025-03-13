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
import {AppStackParamList, SortType} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<AppStackParamList, Stack.SortScreen>;

const SortScreen: React.FC<Props> = ({navigation, route}) => {
  //@ts-ignore
  const {t} = useTranslation();
  const sort = route.params.sort;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inset = useSafeAreaInsets();
  const snapPoints = useMemo(() => [60 + inset.bottom + 30 + 60 * 6], []);
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

  const setSort = (sort: SortType) => {
    route.params.callback(sort);
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
      <Flex
        borderBottomWidth={1}
        height={45}
        backgroundColor={'background2'}
        borderBottomColor={'background3'}
        py={'spacing10'}
        alignItems={'center'}>
        <Text color={'textPrimary'} variant={'buttonLabelMedium'}>
          {t('sort_tutor_by')}
        </Text>
      </Flex>
      <BottomSheetScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: inset.bottom + 15,
          backgroundColor: theme.colors.background0,
        }}
        style={styles.contentContainer}>
        <Touchable onPress={() => setSort('price_low_high')}>
          <Flex
            flexDirection={'row'}
            alignItems={'center'}
            height={60}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={
                sort == 'price_low_high' ? 'textPrimary' : 'textSecondary'
              }>
              {t('price_low_high')}
            </Text>
            {sort == 'price_low_high' && (
              <Ionicon
                name="checkmark-sharp"
                color={
                  sort == 'price_low_high'
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
                size={22}
              />
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setSort('price_high_low')}>
          <Flex
            flexDirection={'row'}
            height={60}
            alignItems={'center'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={
                sort == 'price_high_low' ? 'textPrimary' : 'textSecondary'
              }>
              {t('price_high_low')}
            </Text>
            {sort == 'price_high_low' && (
              <Ionicon
                name="checkmark-sharp"
                color={theme.colors.textPrimary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setSort('popularity')}>
          <Flex
            flexDirection={'row'}
            height={60}
            alignItems={'center'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={sort == 'popularity' ? 'textPrimary' : 'textSecondary'}>
              {t('popularity')}
            </Text>
            {sort == 'popularity' && (
              <Ionicon
                name="checkmark-sharp"
                color={theme.colors.textPrimary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setSort('reviews')}>
          <Flex
            flexDirection={'row'}
            height={60}
            alignItems={'center'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={sort == 'reviews' ? 'textPrimary' : 'textSecondary'}>
              {t('reviews')}
            </Text>
            {sort == 'reviews' && (
              <Ionicon
                name="checkmark-sharp"
                color={theme.colors.textPrimary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setSort('best_rating')}>
          <Flex
            flexDirection={'row'}
            height={60}
            alignItems={'center'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={sort == 'best_rating' ? 'textPrimary' : 'textSecondary'}>
              {t('best_rating')}
            </Text>
            {sort == 'best_rating' && (
              <Ionicon
                name="checkmark-sharp"
                color={theme.colors.textPrimary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
        <Touchable onPress={() => setSort('pertinence')}>
          <Flex
            flexDirection={'row'}
            height={60}
            alignItems={'center'}
            mx={'spacing10'}
            justifyContent={'space-between'}>
            <Text
              variant={'subheadSmall'}
              color={sort == 'pertinence' ? 'textPrimary' : 'textSecondary'}>
              {t('pertinence')}
            </Text>
            {sort == 'pertinence' && (
              <Ionicon
                name="checkmark-sharp"
                color={theme.colors.textPrimary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SortScreen;

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
