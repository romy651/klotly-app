import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {UserInfo} from 'app/redux/user/userReducer';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  PermissionStatus,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {Stack} from 'app/routes/screens/Stack';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {getUser, getUsers} from 'app/actions/chatAction';
import {Booking} from 'app/hooks/useBooking';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Octicon from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {presentEventCreatingDialog} from 'react-native-add-calendar-event';
import FastImage from 'react-native-fast-image';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIos} from 'app/utils/PlatformUtils';

interface BookingItemProps {
  booking: Booking;
}

const BookingItem: React.FC<BookingItemProps> = ({booking}) => {
  const me = useAppSelector(state => state.user);
  const [tutor, setTutor] = useState<UserInfo>();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const now = moment();
  const date = moment(booking.date).format('dddd, MMM D');
  //const [time, setTime] = useState<string>('-')
  const [students, setStudents] = useState<UserInfo[]>([]);

  const meetingStartTime = moment.tz(
    `${booking.date} ${booking.time}`,
    'YYYY-MM-DD HH:mm',
    me.timeZone,
  );

  const diffMinutes = meetingStartTime.diff(now, 'minutes');

  const meetingEndTime = meetingStartTime.clone().add(50, 'minutes');

  const isOngoing = now.isBetween(meetingStartTime, meetingEndTime);

  const upcoming = diffMinutes > 0 && diffMinutes <= 5;

  useEffect(() => {
    (async () => {
      if (me.isTutor) {
        const oth = await getUsers(booking.studentId);
        //console.log('the students: ', oth)
        setStudents(oth);
      } else {
        const oth = await getUser(booking.tutorId);
        setTutor(oth);
      }
    })();
  }, [booking.studentId, booking.tutorId, me.isTutor]);

  const onCall = () => {
    navigation?.push(Stack.OngoingCallScreen, {
      bookingId: booking.id,
      userIds: [...booking.studentId, booking.tutorId],
    });
  };

  const addToCalendar = () => {
    const startDate = moment
      .utc(`${booking.date} ${booking.time}`, 'YYYY-MM-DD HH:mm')
      .format();
    const endDate = moment
      .utc(`${booking.date} ${booking.time}`, 'YYYY-MM-DD HH:mm')
      .add(50, 'minutes')
      .format();
    const otherName = me.isTutor
      ? `${students[0]?.firstName} ${students[0]?.lastName}`
      : `${tutor?.firstName} ${tutor?.lastName}`;
    presentEventCreatingDialog({
      title: 'Klotly Meeting with ' + otherName,
      startDate: startDate,
      endDate: endDate,
      location: t(booking.type) as string,
      notes: t('meeting_note') as string,
    });
  };

  const requestPermission = async () => {
    if (isIos) {
      const result = (await request(
        PERMISSIONS.IOS.CALENDARS_WRITE_ONLY,
      )) as PermissionStatus;
      console.log('the reuslt: ', result);
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission',
          'Please grant permission to access calendar or this feature is not available',
        );
        return;
      }
      addToCalendar();
    } else {
      const result = (await request(
        PERMISSIONS.ANDROID.WRITE_CALENDAR,
      )) as PermissionStatus;
      console.log('the result: ', result);
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission',
          'Please grant permission to access calendar or this feature is not available',
        );
        return;
      }
      addToCalendar();
    }
  };

  if (!me.isTutor && !tutor) {
    return null;
  } else {
    return (
      <Touchable
        onPress={() =>
          navigation.navigate(Stack.AppointmentScreen, {
            booking,
            tutor,
            students,
          })
        }>
        <Flex
          gap={'spacing6'}
          pt={'spacing16'}
          backgroundColor={isOngoing ? 'background2' : 'background0'}
          paddingHorizontal={'spacing18'}
          mt={'spacing14'}
          borderColor={'background3'}
          borderWidth={1}
          borderRadius={'rounded8'}>
          <Text
            textTransform={'capitalize'}
            variant={'buttonLabelMicro'}
            color={'textSecondary'}>
            {isOngoing ? t('on_going') : meetingStartTime.fromNow()}
          </Text>
          <Flex
            borderBottomWidth={me.isTutor ? 0 : 1}
            borderBottomColor={'background3'}
            pb={'spacing14'}
            gap={'none'}
            justifyContent={'space-between'}
            pt={'spacing2'}
            flexDirection={'row'}>
            <Flex gap={'spacing8'}>
              <Text
                fontWeight={'bold'}
                style={{width: SCREEN_WIDTH - 160}}
                variant={'headlineSmall'}
                color={'textPrimary'}>
                {t(booking.topic) || ''} {t('with')}{' '}
                {!me.isTutor && (
                  <Text
                    variant={'headlineSmall'}
                    color={
                      'textPrimary'
                    }>{`${tutor?.firstName} ${tutor?.lastName}`}</Text>
                )}
                {me.isTutor && (
                  <Text variant={'headlineSmall'} color={'textPrimary'}>
                    {`${students[0]?.firstName}`}
                  </Text>
                )}
              </Text>
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Octicon
                  color={theme.colors.textSecondary}
                  name="id-badge"
                  size={16}
                />
                <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                  #{booking.id}
                </Text>
              </Flex>
              <Flex
                width={SCREEN_WIDTH - 140}
                justifyContent={'space-between'}
                flexDirection={'row'}
                style={{marginTop: -5}}
                alignItems={'center'}>
                <Flex flexDirection={'row'} alignItems={'center'}>
                  <Ionicon
                    color={theme.colors.textSecondary}
                    name="calendar-outline"
                    size={16}
                  />
                  <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                    {date} - {booking.time}
                  </Text>
                </Flex>
                <Flex
                  height={30}
                  px={'spacing10'}
                  backgroundColor={'background2'}
                  borderRadius={'rounded4'}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
                    {t(booking.type)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {!me.isTutor && (
              <Flex
                width={80}
                height={80}
                borderRadius={'rounded8'}
                overflow={'hidden'}
                backgroundColor={'accentActionSoft'}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.push(Stack.UserProfileScreen, {
                      user: tutor,
                      userId: tutor?.id,
                    })
                  }>
                  <View>
                    <FastImage
                      source={{uri: tutor?.avatar}}
                      style={styles.avatar}
                    />
                  </View>
                </TouchableOpacity>
              </Flex>
            )}
            {me.isTutor && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.push(Stack.FollowScreen, {
                    type: 'list_participants',
                    userId: students.map(u => u.id),
                  })
                }>
                <View style={styles.imageBox}>
                  {students.slice(0, 3).map((st, i) => (
                    <View key={i}>
                      <FastImage
                        source={{uri: st.avatar}}
                        style={{
                          ...styles.avatar,
                          position: 'absolute',
                          width: 60 - i * 10,
                          height: 60 - i * 10,
                          left: -i * 5 + 7,
                          zIndex: -i,
                        }}
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            )}
          </Flex>
          {!me.isTutor && !booking.isPaid && (
            <Flex
              gap={'none'}
              justifyContent={'space-between'}
              flexDirection={'row'}
              alignItems={'center'}>
              <Text variant={'bodyMicro'} color={'textSecondary'}>
                {t('paiment_pending_desc')}
              </Text>
              {
                <Touchable>
                  <Flex
                    height={35}
                    gap={'spacing6'}
                    flexDirection={'row'}
                    px={'spacing18'}
                    backgroundColor={'accentCritical'}
                    borderRadius={'roundedFull'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    my={'spacing4'}>
                    <Text color={'white'} variant={'buttonLabelMicro'}>
                      {t('pay_now')}
                    </Text>
                  </Flex>
                </Touchable>
              }
            </Flex>
          )}
          {(isOngoing || upcoming) && (
            <Flex gap={'none'}>
              <Touchable onPress={onCall}>
                <Flex
                  py={'spacing10'}
                  borderRadius={'rounded8'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  flexDirection={'row'}
                  mb={'spacing14'}
                  mt={'spacing10'}
                  borderColor={'textSecondary'}
                  borderWidth={1.5}>
                  <Feather
                    name="smartphone"
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                  <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
                    {t('join_from_phone')}
                  </Text>
                </Flex>
              </Touchable>
              <Touchable
                onPress={() => navigation.navigate(Stack.ScanQRCodeScreen)}>
                <Flex
                  py={'spacing10'}
                  borderRadius={'rounded8'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexDirection={'row'}
                  mb={'spacing14'}
                  mt={'spacing10'}
                  borderColor={'textSecondary'}
                  borderWidth={1.5}>
                  <Octicon
                    name="browser"
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                  <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
                    {t('join_from_browser')}
                  </Text>
                </Flex>
              </Touchable>
            </Flex>
          )}
          {diffMinutes > 10 && !isOngoing && (
            <Flex gap={'none'}>
              <Touchable onPress={requestPermission}>
                <Flex
                  py={'spacing10'}
                  borderRadius={'rounded8'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  flexDirection={'row'}
                  mb={'spacing14'}
                  mt={'spacing10'}
                  borderColor={'textSecondary'}
                  borderWidth={1.5}>
                  <FontAwesome
                    name="calendar-plus-o"
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                  <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
                    {t('add_to_calendar')}
                  </Text>
                </Flex>
              </Touchable>
            </Flex>
          )}
        </Flex>
      </Touchable>
    );
  }
};

export default BookingItem;

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  imageBox: {
    width: 70,
    height: 60,
    backgroundColor: 'accentActionSoft',
    paddingTop: 5,
  },
});
