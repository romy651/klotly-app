import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Alert} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useBooking} from 'app/hooks/useBooking';
import {sendPushNotif} from 'app/utils/tools';
import {TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.RescheduleScreen>;

const RescheduleScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  const _reason = route.params.reason;
  const booking = route.params.booking;
  const me = useAppSelector(state => state.user);
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const [reason, setReason] = useState<string>('');
  const [text, setText] = useState<string>('');
  const {updateBooking} = useBooking();
  const [loading, setLoading] = useState<boolean>(false);
  const date = moment(booking.date).format('dddd, MMM D');

  const disabled = (reason === 'other' && text === '') || reason === '';

  const onSend = async () => {
    if (_reason === 'reschedule') {
      navigation.replace(Stack.ScheduleDateScreen, {
        booking: route.params.booking,
        reason: reason !== 'other' ? reason : text,
        tutor: route.params.tutor,
      });
    } else if (_reason === 'cancel') {
      setLoading(true);
      Alert.alert(t('are_you_sure'), t('sure_cancel_desc') as string, [
        {style: 'destructive', text: t('cancel') as string},
        {
          text: t('am_sure') as string,
          onPress: async () => {
            await updateBooking(
              {
                rejectedReason: reason === 'other' ? text : reason,
                changingReason: {
                  changerId: me.id,
                  reason: reason === 'other' ? text : reason,
                  date: new Date().getTime().toString(),
                  timeZone: me.timeZone,
                },
                status: 'canceled',
                updated_at: new Date().getTime(),
              },
              route.params.booking.id,
            );
            sendPushNotif(route.params.tutor.id, {
              title: 'Session canceled',
              body: `Your session with ${me.id} has been Canceled.`,
            });
            navigation.navigate(Stack.CancelationConfirmed);
            //TODO
            //send notfif to mentee about cancellation
          },
        },
      ]);
      setLoading(false);
    } else {
      setLoading(true);
      Alert.alert(t('sure_reject'), t('sure_reject_desc') as string, [
        {style: 'destructive', text: t('cancel') as string},
        {
          text: t('am_sure') as string,
          onPress: async () => {
            await updateBooking(
              {
                rejectedReason: reason === 'other' ? text : reason,
                status: 'rejected',
                updated_at: new Date().getTime(),
              },
              route.params.booking.id,
            );
            navigation.goBack();
            //TODO
            //send notfif to mentee about rejection
          },
        },
      ]);
      setLoading(false);
    }
  };

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        px={'spacing20'}
        width="100%">
        <Button
          loading={loading}
          disabled={disabled}
          backgroundColor={
            disabled
              ? 'background3'
              : _reason === 'reject' || _reason === 'cancel'
              ? 'accentCritical'
              : 'accentAction'
          }
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 15}}
          onPress={onSend}>
          {_reason === 'cancel' ? t('confirm') : t('continue')}
        </Button>
      </Flex>
    ),
    [onSend, insets.bottom],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader showBackButton showBorder />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT - 50,
          backgroundColor: theme.colors.background0,
        }}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 100,
          width: '100%',
        }}>
        <Flex p={'spacing10'} flex={1} backgroundColor={'background0'}>
          <Text variant={'headlineMedium'} color={'textPrimary'}>
            {t('reschedule_reason')}
          </Text>
          <Text color={'textSecondary'} variant={'bodySmall'}>
            {date} - {booking.time}
          </Text>
          <Flex
            borderRadius={'rounded8'}
            flexDirection={'row'}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'background3'}
            alignItems={'center'}>
            <Touchable onPress={() => setReason('schedule_clash')}>
              <Flex
                paddingVertical={'spacing20'}
                flexDirection={'row'}
                width={'100%'}
                px={'spacing10'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('schedule_clash')}
                </Text>
                <MatIcon
                  name={
                    reason === 'schedule_clash'
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  color={theme.colors.textSecondary}
                  size={20}
                />
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            borderRadius={'rounded8'}
            flexDirection={'row'}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'background3'}
            alignItems={'center'}>
            <Touchable onPress={() => setReason('not_ava_schedule')}>
              <Flex
                paddingVertical={'spacing20'}
                flexDirection={'row'}
                width={'100%'}
                px={'spacing10'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('not_ava_schedule')}
                </Text>
                <MatIcon
                  name={
                    reason === 'not_ava_schedule'
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  color={theme.colors.textSecondary}
                  size={20}
                />
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            borderRadius={'rounded8'}
            flexDirection={'row'}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'background3'}
            alignItems={'center'}>
            <Touchable onPress={() => setReason('have_other_act')}>
              <Flex
                paddingVertical={'spacing20'}
                flexDirection={'row'}
                width={'100%'}
                px={'spacing10'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text
                  style={{width: SCREEN_WIDTH - 100}}
                  variant={'bodySmall'}
                  color={'textPrimary'}>
                  {t('have_other_act')}
                </Text>
                <MatIcon
                  name={
                    reason === 'have_other_act'
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  color={theme.colors.textSecondary}
                  size={20}
                />
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            borderRadius={'rounded8'}
            flexDirection={'row'}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'background3'}
            alignItems={'center'}>
            <Touchable onPress={() => setReason('wont_tell')}>
              <Flex
                paddingVertical={'spacing20'}
                flexDirection={'row'}
                width={'100%'}
                px={'spacing10'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('wont_tell')}
                </Text>
                <MatIcon
                  name={
                    reason === 'wont_tell'
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  color={theme.colors.textSecondary}
                  size={20}
                />
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            borderRadius={'rounded8'}
            flexDirection={'row'}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'background3'}
            alignItems={'center'}>
            <Touchable onPress={() => setReason('other')}>
              <Flex
                paddingVertical={'spacing20'}
                flexDirection={'row'}
                width={'100%'}
                px={'spacing10'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text variant={'bodySmall'} color={'textPrimary'}>
                  {t('other')}
                </Text>
                <MatIcon
                  name={
                    reason === 'other' ? 'radio-button-on' : 'radio-button-off'
                  }
                  color={theme.colors.textSecondary}
                  size={20}
                />
              </Flex>
            </Touchable>
          </Flex>
          {reason === 'other' && (
            <Flex>
              <Text
                mt={'spacing10'}
                variant={'subheadSmall'}
                color={'textPrimary'}>
                {t('specifiy_reason')}{' '}
                <Text
                  mt={'spacing10'}
                  variant={'subheadSmall'}
                  color={'accentCritical'}>
                  *
                </Text>
              </Text>
              <Flex backgroundColor={'background2'} style={styles.textView}>
                <TextInput
                  placeholder={`${t('write_reason_here')}...`}
                  value={text}
                  multiline
                  numberOfLines={5}
                  activeUnderlineColor={theme.colors.textSecondary}
                  onChangeText={setText}
                  style={{...styles.textInput, color: theme.colors.textPrimary}}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      </KeyboardAwareScrollView>
      {footerComponent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  textView: {
    width: SCREEN_WIDTH - 20,
    borderRadius: 10,
  },
});

export default RescheduleScreen;
