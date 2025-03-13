import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {calendarLocal} from 'app/lang/calendar';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {
  convertTimezone,
  convertToGMTFormat,
  organizeTimeSlots,
} from 'app/utils/tools';
import moment from 'moment';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import Octicon from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import {useBooking} from 'app/hooks/useBooking';
import {FadeIn} from 'react-native-reanimated';
import {isAndroid} from 'app/utils/PlatformUtils';

calendarLocal();

type Props = NativeStackScreenProps<AppStackParamList, Stack.BookingScreen>;

const BookingScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const {fetchBookedTime} = useBooking();
  const me = useAppSelector(state => state.user);
  const {tutor, booking} = route.params;
  //@ts-ignore
  const firs_date = Object.keys(tutor.tutorObj?.schedule)[0];
  const [loading, setLoading] = useState<boolean>(true);
  const currentDate = moment().format('YYYY-MM-DD');
  const [selected, setSelected] = useState<string>(
    booking?.date || (firs_date ? getClosestDate(firs_date) : currentDate),
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(booking?.time || '');
  const [Type, setType] = useState<string>(booking?.type || 'video_call');
  const [availSlots, setAvailSlots] = useState<any>({});
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [bookedTime, setBookedTime] = useState<Record<string, string[]>>({});
  const insets = useSafeAreaInsets();
  useEffect(() => {
    (async () => {
      const _ = await fetchBookedTime(tutor.id);
      setBookedTime(_);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
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
      setIsEmpty(temp.length === 0);
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
    }
  }, [selected, loading]);

  const onSubmit = () => {
    const ID = new Date().getTime();
    console.log('the type is: ', type);
    if (selected.length == 0 || selectedSlot == '' || Type.length == 0) {
      Alert.alert(t('error'), t('booking_error') as string);
      return;
    }
    const slot = convertTimezone(
      [selectedSlot],
      selected,
      me.timeZone,
      tutor.timeZone,
    )[0] as string;
    if (Type == 'in_person') {
      navigation.push(Stack.AddLocationScreen, {
        id: ID,
        date: selected,
        type: Type,
        slot,
        tutor,
        booking,
      });
    } else {
      navigation.push(Stack.BookingConfirmationScreen, {
        id: ID,
        date: selected,
        type: Type,
        slot,
        tutor,
        booking,
      });
    }
  };

  const addItem = useCallback(
    (index: string) => {
      setSelectedSlot(index);
    },
    [setSelectedSlot, selectedSlot],
  );

  const footerComponent = useCallback(
    () => (
      <AnimatedFlex
        entering={FadeIn.delay(100)}
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Touchable onPress={onSubmit}>
          <Flex
            alignItems={'center'}
            borderRadius={'rounded8'}
            justifyContent={'center'}
            width={'100%'}
            height={45}
            backgroundColor={'accentActive'}>
            <Text variant={'buttonLabelLarge'} color={'white'}>
              {t('continue')}
            </Text>
          </Flex>
        </Touchable>
      </AnimatedFlex>
    ),
    [onSubmit],
  );

  return (
    <Screen edges={['top']} backgroundColor={'background2'}>
      <ViewHeader title={t('schedule') as string} showBackButton showBorder />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.background0,
        }}>
        <Flex px={'spacing10'} backgroundColor={'background0'}>
          <Text
            mt={'spacing16'}
            variant={'buttonLabelMedium'}
            color={'textPrimary'}>
            {t('type')}
          </Text>
          <Flex gap={'spacing8'} flexDirection={'row'} alignItems={'center'}>
            {type.map((e, i) => (
              <Touchable key={i} onPress={() => setType(e)}>
                <Flex
                  style={{
                    backgroundColor:
                      Type === e
                        ? theme.colors.background2
                        : theme.colors.background0,
                    borderRadius: 10,
                    padding: 10,
                    borderWidth: 1.5,
                    borderColor:
                      Type === e
                        ? theme.colors.textPrimary
                        : theme.colors.background3,
                  }}>
                  <Text
                    color={Type === e ? 'textPrimary' : 'textSecondary'}
                    variant={'buttonLabelSmall'}>
                    {t(e)}
                  </Text>
                </Flex>
              </Touchable>
            ))}
          </Flex>
          <Text
            marginVertical={'spacing12'}
            variant={'buttonLabelMedium'}
            color={'textPrimary'}>
            {t('pick_date')}
          </Text>
          <Calendar
            style={{borderRadius: 15, overflow: 'hidden', marginTop: -7.5}}
            theme={{
              calendarBackground: theme.colors.background2,
              textSectionTitleColor: theme.colors.textPrimary,
              selectedDayBackgroundColor: theme.colors.textPrimary,
              selectedDayTextColor: theme.colors.background0,
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
            mt={'spacing12'}
            variant={'buttonLabelMedium'}
            color={'textPrimary'}>
            {t('pick_time')}
          </Text>
          <Text
            marginVertical={'spacing6'}
            variant={'bodyMicro'}
            style={{marginTop: -5}}
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
            <Flex gap={'spacing10'} px={'spacing4'} key={key}>
              <Flex flexDirection={'row'} alignItems={'center'}>
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
                <Touchable key={key} onPress={() => addItem(time)}>
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
        </Flex>
      </ScrollView>
      {!loading && footerComponent()}
    </Screen>
  );
};

export default BookingScreen;

const type = ['in_person', 'audio_call', 'video_call'];

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
