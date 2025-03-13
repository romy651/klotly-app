import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {HomeStackParamList} from 'app/routes/screens/Screens.types';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {theme as _theme} from 'app/themes/Theme';
import {Flex} from 'app/components/layout/Flex';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {sendReport} from 'app/utils/tools';
import Toast from 'react-native-toast-message';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {TextInput} from 'react-native-paper';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  HomeStackScreens.ReportScreen
>;

const reasons = [
  'offensive_language',
  'pornographic',
  'nudity',
  'violence',
  'no_face',
  'screen_recording',
  'bloodiness',
  'underage',
  'harassment',
  'other',
];

const ReportScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const me = useAppSelector(state => state.user);
  const snapPoints = useMemo(() => ['80%'], []);
  const [selectedReason, setSelectedReason] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //const {user, type, postId} = route.params;

  const isCorrect = useCallback(() => {
    return selectedReason.length > 0;
  }, [selectedReason]);

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

  const addItem = useCallback(
    (index: string) => {
      const _id = selectedReason.findIndex(elt => elt == index);
      let _temp = [...selectedReason];
      if (_temp.includes(index)) {
        _temp.splice(_id, 1);
      } else if (selectedReason.length < 3) {
        _temp = [..._temp, index];
      }
      setSelectedReason(_temp);
    },
    [setSelectedReason, selectedReason],
  );

  const onSend = useCallback(async () => {
    setLoading(true);
    console.log(input);
    await sendReport(selectedReason, input.trim(), me.id, route.params.user.id);
    setLoading(false);
    Toast.show({
      type: 'success',
      text1: t('report_sent') as string,
      text2: t('report_sent_desc') as string,
    });
    navigation.goBack();
    route.params.callback && route.params.callback();
  }, [input, selectedReason, me.id, t, navigation, route.params]);

  const renderItem = useCallback(
    ({item, index}: {item: string; index: number}) => (
      <Touchable key={index} onPress={() => addItem(item)}>
        <Flex
          height={40}
          width={(SCREEN_WIDTH - 57) / 2}
          backgroundColor={
            selectedReason.includes(item) ? 'background3' : 'background0'
          }
          mx={'spacing4'}
          borderRadius={'rounded8'}
          alignItems={'center'}
          justifyContent={'center'}
          my={'spacing4'}
          borderColor={
            selectedReason.includes(item) ? 'textSecondary' : 'background3'
          }
          borderWidth={1.5}>
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {t(item)}
          </Text>
        </Flex>
      </Touchable>
    ),
    [selectedReason],
  );

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        style={{paddingBottom: isAndroid ? 10 : insets.bottom}}
        px={'spacing20'}
        width="100%">
        <Button
          loading={loading}
          backgroundColor={isCorrect() ? 'accentAction' : 'background3'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 10}}
          onPress={onSend}>
          {t('confirm')}
        </Button>
      </Flex>
    ),
    [onSend, loading, insets.bottom, isCorrect, t],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: theme.colors.background2}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
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
          {t('report')}
        </Text>
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <BottomSheetScrollView
          contentContainerStyle={{
            backgroundColor: theme.colors.background0,
            paddingBottom: 100,
          }}>
          <Text
            marginHorizontal={'spacing10'}
            marginVertical={'spacing10'}
            variant={'bodyMicro'}
            color={'textPrimary'}>
            <Ionicons
              name="warning-outline"
              size={14}
              color={theme.colors.accentCritical}
            />
            {' ' + t('report_desc')}
          </Text>
          <Text
            px={'spacing10'}
            fontWeight={'bold'}
            variant={'bodySmall'}
            color={'textSecondary'}>
            {t('report_supp')}
          </Text>
          <Flex
            p={'spacing10'}
            minHeight={80}
            style={{borderRadius: 5}}
            borderColor={'background3'}>
            <TextInput
              multiline
              numberOfLines={5}
              value={input}
              onChangeText={setInput}
              placeholder={t('report_reason') as string}
            />
          </Flex>
          <Text
            mt={'spacing16'}
            px={'spacing10'}
            fontWeight={'bold'}
            variant={'bodySmall'}
            color={'textSecondary'}>
            {t('report_type')}
          </Text>
          <FlatList
            bounces={false}
            renderItem={renderItem}
            style={{...styles.list, borderColor: theme.colors.background3}}
            numColumns={2}
            data={reasons}
            keyExtractor={i => i}
          />
        </BottomSheetScrollView>
      </Flex>
      {footerComponent()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  list: {
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bsheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7,
    backgroundColor: _theme.colors.background0,
    elevation: 12,
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
});

export default ReportScreen;
