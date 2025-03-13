import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView, Alert} from 'react-native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {Calendar} from 'react-native-calendars';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import Toast from 'react-native-toast-message';
import {useBooking} from 'app/hooks/useBooking';
import moment from 'moment';
import Octicon from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import {
  convertTimezone,
  convertToGMTFormat,
  organizeTimeSlots,
  sendPushNotif,
} from 'app/utils/tools';
import {useNotif} from 'app/hooks/useNotif';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.ScheduleDateScreen
>;

const ScheduleDateScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  const {booking, reason, tutor} = route.params;
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const {t} = useTranslation();
  const {} = useNotif();
  const {fetchBookedTime} = useBooking();
  const [loading, setLoading] = useState<boolean>(true);
  //@ts-ignore
  const firs_date = Object.keys(tutor.tutorObj?.schedule)[0];
  const currentDate = moment().format('YYYY-MM-DD');
  const [selected, setSelected] = useState<string>(
    booking?.date || (firs_date ? getClosestDate(firs_date) : currentDate),
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(booking?.time || '');
  const {updateBooking} = useBooking();
  const inset = useSafeAreaInsets();
  const [availSlots, setAvailSlots] = useState<any>({});
  const [bookedTime, setBookedTime] = useState<Record<string, string[]>>({});
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const onSend = () => {
    Alert.alert(t('are_you_sure'), t('are_you_sure_reschedule') as string, [
      {text: t('cancel') as string, style: 'destructive'},
      {
        text: t('yes') as string,
        onPress: () => {
          setLoading(true);
          Toast.show({text1: t('meeting_rescheduled') as string});
          const slot = convertTimezone(
            [selectedSlot],
            selected,
            me.timeZone,
            tutor.timeZone,
          )[0] as string;
          updateBooking(
            {
              changingReason: {
                changerId: me.id,
                reason,
                date: new Date().getTime().toString(),
                timeZone: me.timeZone,
              },
              time: slot,
              date: selected,
              updated_at: new Date().getTime(),
            },
            booking.id,
          );
          navigation.navigate(Stack.RescheduleConfirmed, {
            date: `${selected} - ${selectedSlot} ${me.timeZone}`,
            name: tutor.firstName,
            topic: booking.topic,
          });
          sendPushNotif(tutor.id, {
            title: 'Session postponed',
            body: `Your session with ${me.id} has been postponed.`,
          });
          setLoading(false);
          //TODO
          //Notify the metee
        },
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      const _ = await fetchBookedTime(booking.tutorId);
      setBookedTime(_);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    //console.log('THE BOOKED TIME: ', bookedTime)
    const date = moment(selected, 'YYYY-MM-DD').format('dddd').toLowerCase();
    // setAvailSlots(tutor.tutorObj?.schedule[date] || [])
    const _ = tutor.tutorObj?.schedule[date] || [];
    let temp: string[] = [];
    if (moment(selected, 'YYYY-MM-DD').isBefore(moment(), 'day')) {
      temp = [];
    } else {
      temp = convertTimezone(_, selected, tutor.timeZone, me.timeZone);
    }
    setIsEmpty(temp.length == 0);
    let slots: string[] = [];
    if ((bookedTime[selected] || [])?.length > 0) {
      const converted = convertTimezone(
        bookedTime[selected] || [],
        selected,
        tutor.timeZone,
        me.timeZone,
      );
      slots = temp.filter(_ => !converted?.includes(_));
    } else {
      slots = temp;
    }
    const List = organizeTimeSlots(slots);
    setAvailSlots(List);
  }, [selected, loading]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{
          paddingBottom: isAndroid ? 10 : inset.bottom,
        }}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          loading={loading}
          style={{borderRadius: 15}}
          onPress={onSend}>
          {t('submit')}
        </Button>
      </Flex>
    ),
    [onSend],
  );

  const addItem = useCallback(
    (index: string) => {
      setSelectedSlot(index);
    },
    [setSelectedSlot, selectedSlot],
  );

  return (
    <Screen gap={'none'} backgroundColor={'background2'}>
      <ViewHeader title={t('schedule') as string} showBackButton showBorder />
      <Flex flex={1} backgroundColor={'background0'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            marginTop: 30,
            paddingHorizontal: 10,
            backgroundColor: theme.colors.background0,
          }}>
          <Text
            marginHorizontal={'spacing10'}
            mb={'spacing12'}
            variant={'subheadSmall'}
            color={'textPrimary'}>
            {t('pick_date')}
          </Text>
          <Calendar
            style={{borderRadius: 15, overflow: 'hidden'}}
            theme={{
              calendarBackground: theme.colors.background2,
              textSectionTitleColor: theme.colors.textPrimary,
              selectedDayBackgroundColor: theme.colors.accentActive,
              selectedDayTextColor: theme.colors.white,
              todayTextColor: theme.colors.accentActive,
              dayTextColor: theme.colors.textPrimary,
              monthTextColor: theme.colors.textPrimary,
              arrowColor: theme.colors.accentActive,
              contentStyle: {paddinghorizontal: 10},
              textDayStyle: {},
            }}
            onDayPress={(day: any) => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
              },
            }}
          />
          <Text
            marginHorizontal={'spacing10'}
            mt={'spacing24'}
            variant={'subheadSmall'}
            color={'textPrimary'}>
            {t('pick_time')}
          </Text>
          <Text
            marginHorizontal={'spacing10'}
            marginVertical={'spacing16'}
            variant={'bodyMicro'}
            style={{marginTop: 5}}
            color={'textPrimary'}>
            {t('time_slot_time_zone')}{' '}
            {`${me.timeZone || 'Europe/Stockholm'} (${
              convertToGMTFormat(me.timeZone) || 0
            })`}
          </Text>
          {(isEmpty || loading) && (
            <Flex
              backgroundColor={'accentWarningSoft'}
              p={'spacing10'}
              borderRadius={'rounded8'}
              gap={'spacing10'}>
              <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
                {t('no_avail_slots')}
              </Text>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {`${tutor.firstName} ${t('no_avail_slots_desc')}`}
              </Text>
            </Flex>
          )}
          {Object.entries(availSlots).map((slot: any, key) => (
            <Flex mt={'spacing10'} gap={'spacing10'} px={'spacing4'} key={key}>
              <Flex
                mt={'spacing10'}
                flexDirection={'row'}
                alignItems={'center'}>
                {slot[0] == 'night' && (
                  <Octicon
                    color={theme.colors.textPrimary}
                    name="moon"
                    size={18}
                  />
                )}
                {slot[0] == 'morning' && (
                  <Feather
                    color={theme.colors.textPrimary}
                    name="sunrise"
                    size={18}
                  />
                )}
                {slot[0] == 'afternoon' && (
                  <Feather
                    color={theme.colors.textPrimary}
                    name="sun"
                    size={18}
                  />
                )}
                {slot[0] == 'evening' && (
                  <Feather
                    color={theme.colors.textPrimary}
                    name="sunset"
                    size={18}
                  />
                )}
                <Text variant={'buttonLabelSmall'}>{t(slot[0])}</Text>
              </Flex>
              {slot[1].map((time: any, key: any) => (
                <Touchable
                  key={key}
                  onPress={() => addItem(time)}
                  activeOpacity={0.8}>
                  <Flex
                    alignItems={'center'}
                    justifyContent={'center'}
                    borderWidth={1.5}
                    backgroundColor={
                      selectedSlot.includes(time)
                        ? 'background2'
                        : 'background0'
                    }
                    p={'spacing10'}
                    borderRadius={'rounded8'}
                    borderColor={
                      selectedSlot.includes(time)
                        ? 'textPrimary'
                        : 'background2'
                    }>
                    <Text
                      key={key}
                      variant={'buttonLabelMicro'}
                      color={
                        selectedSlot.includes(time)
                          ? 'textPrimary'
                          : 'textSecondary'
                      }>
                      {time}
                    </Text>
                  </Flex>
                </Touchable>
              ))}
            </Flex>
          ))}
        </ScrollView>
      </Flex>
      {footerComponent()}
    </Screen>
  );
};

export default ScheduleDateScreen;

function getClosestDate(targetDay: string): string {
  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  // Normalize the input
  const targetDayIndex = daysOfWeek.indexOf(targetDay.toLowerCase());
  if (targetDayIndex === -1) {
    throw new Error('Invalid day name');
  }

  const today = moment();
  const currentDayIndex = today.day();

  // Calculate days to add
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  // Get the closest date
  const closestDate = today.add(daysToAdd, 'days');

  // Return the date in YYYY-MM-DD format
  return closestDate.format('YYYY-MM-DD');
}
