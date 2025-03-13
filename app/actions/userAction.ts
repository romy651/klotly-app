import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AnyAction, Dispatch} from '@reduxjs/toolkit';
import {
  NetUserInfo,
  UserInfo,
  updateUserSuccess,
} from 'app/redux/user/userReducer';
import {getStripeId, getTimeZone, getTimeZoneOffset} from 'app/utils/tools';
import DeviceCountry, {TYPE_ANY} from 'react-native-device-country';
import DeviceInfo from 'react-native-device-info';

export const registerRequest = async (
  firstName: string,
  lastName: string,
  email: string,
  gender: 'man' | 'woman' | 'other',
  languages: string[],
  avatar: string,
  onError: (e: string) => void,
  onDone: (u: UserInfo) => void,
  password?: string,
): Promise<void> => {
  try {
    const id = new Date().getTime().toString();
    const country = await get_Country();
    const deviceId = await DeviceInfo.getUniqueId();
    password && (await auth().createUserWithEmailAndPassword(email, password));
    const stripeId = await getStripeId(`${firstName} ${lastName}`, email);
    console.log('the stripeId: ');
    const userDetail: UserInfo = {
      id,
      stripeId,
      firstName,
      lastName,
      email,
      gender,
      languages,
      country: country.toUpperCase(),
      avatar,
      timeZoneOffset: getTimeZoneOffset(),
      timeZone: getTimeZone(),
      registered_at: firestore.FieldValue.serverTimestamp(),
      isTutor: false,
      emailVerified: false,
      age: 24,
      certificates: [],
      education: [],
      experiences: [],
      intro: '',
      photos: [],
      deviceId,
      favoriteTutors: [],
      subscriptions: [],
      videos: [],
      isDeleted: false,
      coins: 40,
      following: [],
      blocked_users: [],
      notifications: {
        newFollowers: true,
        directMessages: true,
        videoCalls: true,
        reminders: true,
        lessonLearning: true,
      },
    };
    console.log('the user: ', userDetail);
    await firestore().collection('users').doc(id).set(userDetail);
    onDone(userDetail);
  } catch (e: any) {
    if (e.code === 'auth/wrong-password') {
      onError('signin_wrong_password');
    } else if (e.code === 'auth/invalid-email') {
      onError('signin_wrong_email');
    } else {
      onError('error_try_later');
    }
  }
};

export const signInRequest = async (
  email: string,
  password: string,
  onError: (e: string) => void,
  onDone: (u: UserInfo) => void,
): Promise<void> => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    const req = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    console.log('the user: ', req.docs);
    if (req.docs[0]) {
      const user = req.docs[0].data() as UserInfo;
      const country = await get_Country();
      onDone({...user, country});
    }
  } catch (e: any) {
    if (e.code === 'auth/wrong-password') {
      onError('signin_wrong_password');
    } else if (e.code === 'auth/invalid-email') {
      onError('signin_wrong_email');
    } else {
      onError('signin_error');
    }
  }
};

const get_Country = (): string => {
  const _ = Intl.DateTimeFormat().resolvedOptions().locale;
  const res = _.split('-')[1] || 'US';
  return res;
};

export const parseUserInfo = (value: NetUserInfo) => {};

export const updateUserInfo = async (
  user: UserInfo,
  dispatch: Dispatch<AnyAction>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> => {
  setLoading && setLoading(true);
  await firestore()
    .collection('users')
    .doc(user.id)
    .set({...user});
  dispatch(updateUserSuccess(user));
  setLoading && setLoading(false);
};

export const refreshUserInfo = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
) => {
  const req = await firestore().collection('users').doc(id).get();
  if (!req.exists) {
    return;
  }
  const data = req.data();
  dispatch(updateUserSuccess(data as UserInfo));
};
11.501346;
