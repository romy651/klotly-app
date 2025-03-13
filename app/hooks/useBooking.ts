import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import React, {useCallback, useState} from 'react';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {MeetingPlace} from 'app/routes/screens/Screens.types';
import {UserInfo} from 'app/redux/user/userReducer';
import {convertTimezone, getConvertedDate} from 'app/utils/tools';
import moment from 'moment';

//firestore.FieldValue.serverTimestamp()

export type Booking = {
  id: number;
  created_at: number;
  updated_at: number;
  tutorId: string;
  studentId: string[];
  whopaidId: string;
  optedOutList: {id: string; time: string; timeZone: string}[];
  topic: string;
  type: 'in_person' | 'audio_call' | 'video_call';
  location?: MeetingPlace;
  date: string;
  time: string;
  timeZone: string;
  price: number;
  isPaid: boolean;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled' | 'completed';
  rejectedReason?: string;
  changingReason?: {
    changerId: string;
    reason: string;
    date: string;
    timeZone: string;
  };
  cancelReason?: {
    changerId: string;
    reason: string;
    date: string;
    timeZone: string;
  };
};

export const useBooking = () => {
  const me = useAppSelector(state => state).user;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('onRefresh');
    setRefreshing(true);
    let req: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;
    if (me.isTutor) {
      req = firestore().collection('bookings').where('tutorId', '==', me.id);
    } else {
      req = firestore()
        .collection('bookings')
        .where('studentId', 'array-contains', me.id);
    }

    const _res = await req.get();

    const res = _res.docs.map(b => {
      const _ = b.data() as Booking;
      const time = convertTimezone(
        [_.time],
        _.date,
        _.timeZone,
        me.timeZone,
      )[0] as string;
      const date = getConvertedDate(_.date, _.time, _.timeZone, me.timeZone);
      return {..._, time, date, timeZone: me.timeZone};
    });
    //console.log('res', res);
    setBookings(res);
    setRefreshing(false);
  }, [me]);

  React.useEffect(() => {
    (async () => {
      if (!me) {
        return;
      }
      onRefresh();
    })();
  }, [me, onRefresh]);

  const createBooking = async (tutor: UserInfo, booking: Booking) => {
    await firestore().collection('bookings').doc(`${booking.id}`).set(booking);
    //TODO
    //send notif to tutor
    //send email to tutor

    // Update the bookings state after creating a new booking
    setBookings(prevBookings => [
      ...prevBookings,
      {...booking, timeZone: me.timeZone},
    ]);
  };

  const fetchBooking = (id: number) => {
    const res = bookings.find(b => b.id === id);
    return res;
  };

  const updateBooking = async (
    booking: Partial<Booking>,
    bookingId: number,
  ) => {
    await firestore()
      .collection('bookings')
      .doc(`${bookingId}`)
      .update({...booking});
    //TODO
    //notify the tutor or student

    // Update the bookings state after updating
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {...b, ...booking};
      }
      return b;
    });
    setBookings(updatedBookings);
  };

  const deleteBooking = async (id: number) => {
    await firestore().collection('bookings').doc(`${id}`).delete();

    // Update the bookings state after deletion
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    setBookings(updatedBookings);

    // TODO: Notify the tutor or student about the cancellation
  };

  const fetchBookedTime = async (tutorId: string) => {
    const res: Record<string, string[]> = {};
    const req = await firestore()
      .collection('bookings')
      .where('tutorId', '==', tutorId)
      .where('status', '==', 'confirmed')
      .get();

    req.docs.map(_ => {
      const book = _.data() as Booking;
      res[book.date] = [...(res[book.date] || []), book.time];
    });
    return res;
  };

  const canCancelBooking = (booking: Booking): boolean => {
    // Get the current time in UTC
    const now = moment.utc();

    // Create a moment object for the booking time in its timezone
    const bookingDateTime = moment.tz(
      `${booking.date} ${booking.time}`,
      'YYYY-MM-DD HH:mm',
      booking.timeZone,
    );

    // Convert booking time to UTC for comparison
    const bookingDateTimeUTC = bookingDateTime.clone().utc();

    // Calculate the difference in hours
    const hoursDifference = bookingDateTimeUTC.diff(now, 'hours', true);

    // Check if the difference is at least 12 hours
    return hoursDifference >= 12;
  };

  return {
    bookings,
    fetchBooking,
    deleteBooking,
    updateBooking,
    createBooking,
    fetchBookedTime,
    canCancelBooking,
    onRefresh,
    refreshing,
  };
};
