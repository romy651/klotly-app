import currencyMap from 'app/constants/currency-map';
import _ from 'lodash';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Alert, NativeModules, Permission, Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import {getModel, getBrand} from 'react-native-device-info';
import database from '@react-native-firebase/database';
import {CountryItem} from 'app/constants/languages';
import firestore from '@react-native-firebase/firestore';
import {TutorObj, UserInfo} from 'app/redux/user/userReducer';
import {createThumbnail} from 'react-native-create-thumbnail';
import ImagePicker, {Image, Video} from 'react-native-image-crop-picker';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import moment from 'moment-timezone';
import {SortType} from 'app/routes/screens/Screens.types';
import axios from 'axios';
import {PostItem} from 'app/hooks/usePost';
import {Booking} from 'app/hooks/useBooking';
import dayjs from 'dayjs';

interface DetectLanguageResponse {
  data: {
    detections: [
      [
        {
          language: string;
          isReliable: boolean;
          confidence: number;
        },
      ],
    ];
  };
}

type TimeSlot = string;
type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';
type OrganizedSlots = Partial<Record<DayPeriod, TimeSlot[]>>;

export const getVerboseDateTimeRepresentation = (time: any) => {
  const formattedDate = dayjs(time).format('MMM D');

  const formattedTime = dayjs(time).format('HH:mm');

  const localDateTime = dayjs(time);
  const now = dayjs();

  if (
    localDateTime.isSame(now, 'day') &&
    localDateTime.isSame(now, 'month') &&
    localDateTime.isSame(now, 'year')
  ) {
    return formattedTime;
  }

  return `${formattedDate}, ${formattedTime}`;
};

const payment_sheet_api =
  'https://createpaymentrequests-nxanhzb2pa-uc.a.run.app';

const create_stripe_cust_api = 'https://createcustomer-nxanhzb2pa-uc.a.run.app';

const auth_session_api = 'https://authsession-nxanhzb2pa-uc.a.run.app';

export const getStripeId = async (name: string, email: string) => {
  const response = await fetch(`${create_stripe_cust_api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name, email}),
  });
  console.log('the response: ', response);
  const {customer} = await response.json();
  return customer as string;
};

export const pushSession = async (sessionId: string, userId: string) => {
  const response = await fetch(`${auth_session_api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({sessionId, userId}),
  });
  const res = await response.json();
  return res;
};

export const fetchPaymentSheetParams = async (data: any) => {
  const response = await fetch(`${payment_sheet_api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const {paymentIntent, ephemeralKey, customer} = await response.json();
  return {
    paymentIntent,
    ephemeralKey,
    customer,
  };
};

export const getLanguage = () => {
  const deviceLanguage = (
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier
  ) as string;
  return deviceLanguage.split('_')[0];
};

export const validateEmail = (email: string): boolean => {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
};

export const emailExist = async (email: string): Promise<boolean> => {
  const ref = firestore().collection('users').where('email', '==', email);
  const doc = await ref.get();
  return doc.size > 0;
};

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchUnsplashProfile = (callback: (uri: string) => void) => {
  const accessKey = 'H9Zh7UJrZfb22w85xOFaolcwY8rM00vPHKsXN0OsbKk';
  fetch(
    `https://api.unsplash.com/photos/random?query=${'profile nature'}&client_id=${accessKey}`,
  )
    .then(response => response.json())
    .then(data => {
      callback(data.urls.regular);
    })
    .catch(error => console.error('Error fetching image:', error));
};

export const getCurrency = (code: string): any => {
  const item = Object.entries(currencyMap).find(
    a => a[1].abbreviation === code,
  ) as [
    string,
    {
      abbreviation: string;
      currency: string;
      rate: number;
    },
  ];
  return item[1];
};

export const getTimeZoneOffset = () => {
  const t = new Date();
  const currentTimezone = (t.getTimezoneOffset() / 60) * -1;
  return currentTimezone;
};

export const createTimeSlots = (
  start: string,
  end: string,
  step: number = 30,
): string[] => {
  const timeSlots: string[] = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  let hour = startHour as number;
  let minute = startMinute as number;

  while (
    hour < (endHour as number) ||
    (hour === endHour && minute < (endMinute as number))
  ) {
    const timeSlot = `${String(hour).padStart(2, '0')}:${String(
      minute,
    ).padStart(2, '0')}`;
    timeSlots.push(timeSlot);
    minute += step;
    if (minute >= 60) {
      minute -= 60;
      hour++;
    }
  }

  return timeSlots;
};

export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getCurrentCountryFromTimezone = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // This is a simplified mapping. A more comprehensive solution would use a full timezone database.
  const timezoneToCountry: {[key: string]: string} = {
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Asia/Tokyo': 'JP',
    'Australia/Sydney': 'AU',
    // Add more mappings as needed
  };

  return timezoneToCountry[timezone] || 'Unknown';
};

export const organizeTimeSlots = (slots: TimeSlot[]): OrganizedSlots => {
  const tempOrganizedSlots: Record<DayPeriod, TimeSlot[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };
  slots.forEach(slot => {
    //@ts-ignore
    const hour = parseInt(slot.split(':')[0], 10);

    if (hour >= 5 && hour < 12) {
      tempOrganizedSlots.morning.push(slot);
    } else if (hour >= 12 && hour < 17) {
      tempOrganizedSlots.afternoon.push(slot);
    } else if (hour >= 17 && hour <= 23) {
      tempOrganizedSlots.evening.push(slot);
    } else {
      tempOrganizedSlots.night.push(slot);
    }
  });
  const organizedSlots: OrganizedSlots = Object.entries(
    tempOrganizedSlots,
  ).reduce((acc, [key, value]) => {
    if (value.length > 0) {
      acc[key as DayPeriod] = value;
    }
    return acc;
  }, {} as OrganizedSlots);

  return organizedSlots;
};

export const convertTimezone = (
  timeSlots: string[],
  date: string,
  fromTimezone: string,
  toTimezone: string,
): string[] => {
  const convertedTimeSlots: string[] = [];

  timeSlots.forEach(time => {
    // Combine the user's selected date with the time for conversion
    const dateTimeString = `${date} ${time}`;

    // Parse the time in the instructor's timezone
    const timeInInstructorTimezone = moment.tz(dateTimeString, fromTimezone);

    // Convert it to the user's timezone
    const timeInUserTimezone = timeInInstructorTimezone.tz(toTimezone);

    convertedTimeSlots.push(timeInUserTimezone.format('HH:mm'));

    // Check if the converted time is within the user's selected date
    /*if (timeInUserTimezone.format('YYYY-MM-DD') === date) {
            // Add the converted time in 'HH:mm' format to the result array
            convertedTimeSlots.push(timeInUserTimezone.format('HH:mm'))
        }*/
  });
  return convertedTimeSlots.sort((a, b) => {
    return moment(a, 'HH:mm').diff(moment(b, 'HH:mm'));
  });
  //return convertedTimeSlots
};

export const getConvertedDate = (
  date: string,
  time: string,
  fromTimezone: string,
  toTimezone: string,
): string => {
  const dateTimeString = `${date} ${time}`;

  // Parse the time in the instructor's timezone
  const timeInInstructorTimezone = moment.tz(dateTimeString, fromTimezone);

  // Convert it to the user's timezone
  const timeInUserTimezone = timeInInstructorTimezone.tz(toTimezone);

  return timeInUserTimezone.format('YYYY-MM-DD');
};

export const getlibraryImage = async (
  callback: (uri: Image | Video) => void,
  onError: () => void,
  type: 'photo' | 'video' = 'photo',
  cropping?: boolean,
) => {
  if (Platform.OS === 'ios') {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async res => {
      console.log('we launch with the type: ', type);
      if (res == RESULTS.GRANTED) {
        if (type == 'video') {
          const result = await ImagePicker.openPicker({
            mediaType: 'video',
          });
          result && callback(result as Video);
        } else {
          const result = await ImagePicker.openPicker({
            compressImageQuality: 1,
            mediaType: type ? type : 'photo',
            cropping,
          });
          result && callback(result);
        }
      } else {
        console.log('it is denied');
        console.log('we request again');
        request(PERMISSIONS.IOS.PHOTO_LIBRARY)
          .then(async res => {
            console.log(res);
            if (res == RESULTS.GRANTED) {
              if (type == 'video') {
                const result = await ImagePicker.openPicker({
                  mediaType: 'video',
                });
                result && callback(result);
              } else {
                const result = await ImagePicker.openPicker({
                  compressImageQuality: 0.7,
                  mediaType: type ? type : 'photo',
                });
                result && callback(result);
              }
            } else {
              onError();
            }
          })
          .catch(e => console.log('error: ', e));
      }
    });
  } else {
    if (type === 'video') {
      const result = await ImagePicker.openPicker({
        mediaType: 'video',
      });
      callback(result);
    } else {
      const result = await ImagePicker.openPicker({
        compressImageQuality: 0.7,
        mediaType: type ? type : 'photo',
        cropping,
      });
      callback(result);
    }
  }
};

export const transalteText = async (text: string, targetLanguage: string) => {
  const API = 'YOUR OPEN AI API KEY';

  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant that translates text.',
    },
    {
      role: 'user',
      content: `Translate the following text to ${targetLanguage} and return only the translation: ${text}`,
    },
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    console.log('THE ANSWER:', data);
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const generateText = async (
  question: string,
  text: string,
  targetLanguage: string,
) => {
  const API = 'YOUR OPEN AI API KEY';

  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful assistant that help people to create a stunning online profile.',
    },
    {
      role: 'user',
      content: `I am trying to create a profile as an instructor who want to mentor new students. Asuming the language is ${targetLanguage}, I want you provide a clear description (without asking a question) to this question: ${question}, based on this answer: ${text} in a language ${targetLanguage}. I want you to make your answer more attractive to news students, whitouth hashtags.`,
    },
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    console.log('THE ANSWER:', data);
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fecth_user = async (id: string) => {
  const ref = firestore().collection('users').doc(id);
  const doc = await ref.get();
  return doc.data() as UserInfo;
};

export const uploadAvatar = async (
  uri: string,
  uid: string,
  onProgress: (progress: number) => void,
  onError: () => void,
  onDone: (uri: string) => void,
) => {
  const ID = new Date().getTime();
  console.log('WE CREATE THE REF');
  const uploadTask = storage().ref(`avatar/${uid}/${ID}`);
  console.log('WE TRY TO PUT THE FILE');
  uploadTask.putFile(uri).on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    error => {
      onError();
      console.log(error);
    },
    async () => {
      console.log('NOW WE TRY TO GET URI');
      //const downloadUri = await uploadTask.getDownloadURL()
      const downloadUri = await storage()
        .ref(`avatar/${uid}/${ID}`)
        .getDownloadURL();
      onDone(downloadUri);
    },
  );
};

export const detectLanguage = async (text: string): Promise<string> => {
  const API_URL =
    'https://translation.googleapis.com/language/translate/v2/detect';
  const API_KEY = 'AIzaSyCV1oOgj7nfSHXc1di2idwPFHmW9fNETgs';

  try {
    const response = await axios.post<DetectLanguageResponse>(
      `${API_URL}?key=${API_KEY}`,
      {q: text},
    );

    const detectedLanguage = response.data.data.detections[0][0].language;
    return detectedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
};

export const getPosts = async (userId: string) => {
  const db = firestore();
  const posts = await db
    .collection('posts')
    .where('ownerId', '==', userId)
    .get();
  return posts.docs.map(doc => doc.data() as PostItem);
};

export const getPostsLenght = async (userId: string) => {
  const db = firestore();
  const postsCount = await db
    .collection('posts')
    .where('ownerId', '==', userId)
    .count()
    .get();
  return postsCount.data().count;
};

export const isMeetingUpcoming = (booking: Booking, myTimeZone: string) => {
  const now = moment();
  const meetingStartTime = moment.tz(
    `${booking.date} ${booking.time}`,
    'YYYY-MM-DD HH:mm',
    myTimeZone,
  );

  const meetingEndTime = meetingStartTime.clone().add(50, 'minutes');

  const diffMinutes = meetingStartTime.diff(now, 'minutes');

  console.log('first condition', diffMinutes > 0 && diffMinutes <= 5);
  console.log(
    'second condition',
    now.isBetween(meetingStartTime, meetingEndTime),
  );
  return (
    (diffMinutes > 0 && diffMinutes <= 5) ||
    now.isBetween(meetingStartTime, meetingEndTime) ||
    booking.status === 'confirmed'
  );
};

export const uploadImages = async (
  uris: string[],
  type: string,
  uid: string,
  onProgress: (progress: number) => void,
  onError: () => void,
  onDone: (uris: string[]) => void,
) => {
  const uploadedUris: string[] = [];
  let totalProgress = 0;

  try {
    for (let i = 0; i < uris.length; i++) {
      const uri = uris[i];
      if (uri.includes('https')) {
        uploadedUris.push(uri);
        totalProgress += 100;
        onProgress(totalProgress / uris.length);
        continue;
      }

      const uploadTask = storage().ref(
        `${type}/${uid}/${new Date().getTime()}_${i}`,
      );
      await new Promise<void>((resolve, reject) => {
        uploadTask.putFile(uri).on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            totalProgress += progress - (totalProgress % 100);
            onProgress(totalProgress / uris.length);
          },
          error => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadUri = await uploadTask.getDownloadURL();
              uploadedUris.push(downloadUri);
              resolve();
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          },
        );
      });
    }

    onDone(uploadedUris);
  } catch (error) {
    console.error('Error in uploadImages:', error);
    onError();
  }
};

export const uploadImage = async (
  uri: string,
  uid: string,
  onProgress: (progress: number) => void,
  onError: () => void,
  onDone: (uri: string) => void,
) => {
  if (uri.includes('https')) {
    onDone(uri);
    return;
  }
  const uploadTask = storage().ref(`photo/${uid}/${new Date().getTime()}`);
  uploadTask.putFile(uri).on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    error => {
      onError();
      console.log(error);
    },
    async () => {
      const downloadUri = await uploadTask.getDownloadURL();
      onDone(downloadUri);
    },
  );
};

export const getRate = async (toCurrency: string): Promise<number> => {
  const apiUrl = 'https://open.er-api.com/v6/latest/USD';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.result !== 'success') {
      Alert.alert('Error', 'Unable to fetch exchange rates.');
    }

    const rate = data.rates[toCurrency];
    return rate;
  } catch (error) {
    Alert.alert('Error', 'Exchange rate not available: ' + error);
    throw error;
  }
};

export const uploadVideo = async (
  uri: string,
  uid: string,
  onProgress: (progress: number) => void,
  onError: () => void,
  onDone: (uri: string, thumb_url: string) => void,
) => {
  if (uri.includes('https')) {
    onDone(uri, '');
    return;
  }
  const uploadTask = storage().ref(`video/${uid}/${new Date().getTime()}`);
  uploadTask.putFile(uri).on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    error => {
      onError();
      console.log(error);
    },
    async () => {
      const downloadUri = await uploadTask.getDownloadURL();
      const thumb = await createThumbnail({url: downloadUri, timeStamp: 1000});
      const task2 = storage().ref(`thumbnail/${uid}/${new Date().getTime()}`);
      await task2.putFile(thumb.path);
      const thumb_url = await task2.getDownloadURL();
      onDone(downloadUri, thumb_url);
    },
  );
};

export const isNewIphone = (): boolean => {
  if (getBrand() == 'Apple') {
    const modelName = getModel();
    const number = parseInt(modelName.split(' ')[1] as string);
    if (Number.isNaN(number)) {
      if (
        ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max'].includes(
          getModel(),
        )
      ) {
        return true;
      }
      return false;
    } else if (number > 8) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const convertToFirebaseDatabasePathName = (text: string) => {
  return text
    .replace(/\./g, '!')
    .replace(/#/g, '@')
    .replace(/\$/g, '%')
    .replace(/\[/g, '&')
    .replace(/\]/g, '*');
};

export type OnlineStatus = {
  status: 0 | 1 | 2;
  last_online: number;
};

const listenMyStatus = (userId: string) => {
  const myUsernamePath = convertToFirebaseDatabasePathName(userId);

  const dbRef = database();
  const state: OnlineStatus = {
    status: 1,
    last_online: new Date().getTime(),
  };

  dbRef
    .ref(`online/${myUsernamePath}`)
    .set(state)
    .then(() => console.log('user online'));
  dbRef
    .ref(`online/${myUsernamePath}`)
    .onDisconnect()
    .set({status: 0, last_online: new Date().getTime()})
    .then(() => {
      console.log('a user is disconnected');
    });
};

const listentUserStatus = (
  userId: string,
  callback: (state: boolean) => void,
) => {
  const dbRef = database();
  const name = convertToFirebaseDatabasePathName(userId);
  dbRef.ref(`/online/${name}`).once('value', snap => {
    const current_state = snap.val() as OnlineStatus;
    callback(current_state.status == 1);
  });
  dbRef.ref(`/online/${name}`).on('child_changed', (snap: any) => {
    if (snap.val() == 0 || snap.val() == 1) {
      callback(snap.val() == 1);
    }
  });
};

export const array_move = (
  arr: CountryItem[],
  old_index: number,
  new_index: number,
) => {
  var element = arr[old_index] as CountryItem;
  arr.splice(old_index, 1);
  arr.splice(new_index, 0, element);
  return arr;
};

export const sendFeedback = async (
  user: string,
  message: string,
  image: string,
  callBack: () => void,
) => {
  const db = firestore();
  db.collection('feedbacks')
    .add({
      user,
      message,
      image,
      date: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      callBack();
    });
};

export const updateGift = (gifts: Map<string, number>, gift: string) => {
  gifts.set(gift, (gifts.get(gift) || 0) + 1);
  return gifts;
};

export const dictionaryToMap = (dictionary: any) => {
  const map = new Map();

  for (let key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      map.set(key, dictionary[key]);
    }
  }
  return map;
};

export async function requestUserPermission() {
  if (Platform.OS == 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  if (Platform.OS == 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS as Permission,
    );
  }
}

export async function registerToken(userId: string) {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  console.log('WE GOT THE TOKEN: ', token);

  const myUsernamePath = convertToFirebaseDatabasePathName(userId);

  const dbRef = firebase
    .app()
    .database(
      'https://buzzmeet-3999d-default-rtdb.europe-west1.firebasedatabase.app/',
    );

  dbRef.ref(`${myUsernamePath}/token`).set(token);
}

export const listenStatus = (userId: string) => {
  const myUsernamePath = convertToFirebaseDatabasePathName(userId);

  const dbRef = firebase
    .app()
    .database(
      'https://buzzmeet-3999d-default-rtdb.europe-west1.firebasedatabase.app/',
    );

  const state: OnlineStatus = {
    status: 1,
    last_online: new Date().getTime(),
  };

  console.log('we try to set now: ', state);

  dbRef
    .ref(`${myUsernamePath}/online`)
    .set(state)
    .then(() => console.log('user online'));

  console.log('it is already set');

  dbRef
    .ref(`${myUsernamePath}/online`)
    .onDisconnect()
    .set({status: 0, last_online: new Date().getTime()})
    .then(() => {
      console.log('a user is disconnected');
    });
};

export const getOnlineStatus = async (userId: string) => {
  const name = convertToFirebaseDatabasePathName(userId);

  const dbRef = firebase
    .app()
    .database(
      'https://buzzmeet-3999d-default-rtdb.europe-west1.firebasedatabase.app/',
    );

  const snap = await dbRef.ref(`${name}/online`).once('value');

  const current_state = snap.val() as OnlineStatus;

  return current_state.status;
};

type NotifData = {
  title: string;
  body: string;
};

export const sendNotif = async (data: {data: NotifData; token: string}) => {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({data}),
  };
  await fetch(
    'https://sendfcmnotification-nxanhzb2pa-uc.a.run.app',
    requestOptions,
  )
    .catch(e => console.log('there is an error: ', e))
    .then(() => console.log('it has been sent nows!!: '));
};

export const sendPushNotif = async (userId: string, _data: NotifData) => {
  const dbRef = firebase
    .app()
    .database(
      'https://buzzmeet-3999d-default-rtdb.europe-west1.firebasedatabase.app/',
    );

  dbRef
    .ref(`${convertToFirebaseDatabasePathName(userId)}/token`)
    .once('value', async snap => {
      const token = snap.val();
      const data = {
        title: _data.title,
        body: _data.body,
      };
      const res = {
        data,
        token,
      };
      sendNotif(res);
    });
};

export const sendReport = async (
  reasons: string[],
  sup: string,
  from: string,
  to: string,
) => {
  const db = firestore();
  console.log('we try to send the report now: ', reasons, sup);
  await db.collection('reports').add({
    from,
    to,
    reasons,
    sup,
    date: firestore.FieldValue.serverTimestamp(),
  });
};

export const getUserfollowers = async (userId: string) => {
  const db = firestore();
  const req = await db
    .collection('users')
    .where('following', 'array-contains', userId)
    .get();
  const followers = req.docs
    .map(doc => doc.data() as UserInfo)
    .filter(u => (u.isDeleted || false) === false);
  return followers as UserInfo[];
};

export const getFollowing = async (userId: string) => {
  const db = firestore();
  const req_user = (
    await db.collection('users').doc(`${userId}`).get()
  ).data() as UserInfo;
  const following = req_user.following || [];

  const users = await Promise.all(
    following.map(async (id: string) => await fecth_user(id)),
  );

  return users.filter(u => (u.isDeleted || false) === false);
};

export const deleteUser = async (userId: string) => {
  const db = firestore();
  await db.collection('users').doc(userId).update({isDeleted: true});
};

export const getStreamToken = async (userId: string) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('uid', `${userId}`);

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const rq = await fetch(
    'https://streamtoken-nxanhzb2pa-uc.a.run.app',
    requestOptions,
  );
  const data = await rq.json();
  return data;
};

/**
 * Evaluates if a tutor is a "super tutor" based on their reviews
 * @param {Array<number>} reviews - Array of review scores (1-5)
 * @returns {boolean} Evaluation result
 */
export const isSuperTutor = (reviews: number[]): boolean => {
  const minReviews = 10;
  const minAverageRating = 4.5;
  const minFiveStarPercentage = 0.6;
  if (!reviews || reviews.length === 0) {
    return false;
  }

  const totalReviews = reviews.length;
  const averageRating = _.mean(reviews);
  const fiveStarReviews = reviews.filter(rating => rating === 5).length;
  const fiveStarPercentage = fiveStarReviews / totalReviews;

  // Check against criteria
  if (totalReviews < minReviews) {
    return false;
  }

  if (averageRating < minAverageRating) {
    return false;
  }

  if (fiveStarPercentage < minFiveStarPercentage) {
    return false;
  }

  return true;
};

export const convertToGMTFormat = (timezone: string): string => {
  // Get the current moment in the specified time zone
  const now = moment().tz(timezone);

  // Get the offset in minutes
  const offsetMinutes = now.utcOffset();

  // Convert offset to hours and minutes
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;

  // Determine the sign
  const sign = offsetMinutes >= 0 ? '+' : '-';

  // Format the offset string
  const offsetString = `${sign}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  // Construct the final GMT string
  return `GMT ${offsetString}`;
};

/**
 * Calculates the average review score from an array of review scores.
 *
 * @param {number[]} reviews - An array of review scores (numbers).
 * @returns {number} The average review score, rounded to two decimal places.
 */
export const calculateAverageReview = (reviews: number[]) => {
  // Calculate the sum of all reviews
  const sum = reviews.reduce((acc, score) => acc + score, 0);

  // Calculate the average
  const average = sum / (reviews.length || 1);

  // Round to two decimal places and return
  return Math.round(average);
};

export const getTutorLessons = async (tutorId: string) => {
  const req = await firestore()
    .collection('bookings')
    .where('tutorId', '==', tutorId)
    .where('status', '==', 'completed')
    .get();
  return req.size;
};

/**
 * Generate availability index for an instructor based on their schedule
 * @param {Object} schedule The instructor's schedule object
 * @returns {string[]} Array of availability index strings
 */

export const generateAvailabilityIndex = (
  schedule: Record<string, string[]>,
) => {
  const availIndex = [];
  const timeSlots = [
    {name: 'day-time-1', start: '09:00', end: '12:00'},
    {name: 'day-time-2', start: '12:00', end: '15:00'},
    {name: 'day-time-3', start: '15:00', end: '18:00'},
    {name: 'evening-night-1', start: '18:00', end: '21:00'},
    {name: 'evening-night-2', start: '21:00', end: '00:00'},
    {name: 'evening-night-3', start: '00:00', end: '03:00'},
    {name: 'morning-1', start: '03:00', end: '06:00'},
    {name: 'morning-2', start: '06:00', end: '09:00'},
  ];

  for (const day in schedule) {
    const daySchedule = schedule[day] as string[];

    for (const slot of timeSlots) {
      if (isAvailableForTimeSlot(daySchedule, slot.start, slot.end)) {
        availIndex.push(`${slot.name}`);
      }
    }
  }

  return availIndex;
};

/**
 * Check if the instructor is available for a specific time slot
 * @param {string[]} daySchedule Array of available times for a day
 * @param {string} start Start time of the slot
 * @param {string} end End time of the slot
 * @returns {boolean}
 */
function isAvailableForTimeSlot(
  daySchedule: string[],
  start: string,
  end: string,
) {
  const startTime = timeToMinutes(start);
  const endTime = end === '00:00' ? 24 * 60 : timeToMinutes(end);

  for (const slot of daySchedule) {
    const slotTime = timeToMinutes(slot);
    if (slotTime >= startTime && slotTime < endTime) {
      return true; // Found at least one available slot within the range
    }
  }

  return false;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  //@ts-ignore
  return hours * 60 + minutes;
}

type FilterTutor = {
  gender?: 'man' | 'woman' | 'other';
  countries?: string[];
  languages?: string[];
  timeSlots?: string[];
  days?: string[];
  topic?: string;
  subTopics?: string[];
};
/**
 * Filter tutors based on multiple criteria
 * @param {FilterTutor} filters - An object containing all filter criteria
 * @param {string} [filters.gender] - 'male', 'female', or 'other'
 * @param {string[]} [filters.countries] - Array of countries
 * @param {string[]} [filters.languages] - Array of languages
 * @param {string[]} [filters.timeSlots] - Array of time slots (e.g., ['evening-night-1', 'morning-2'])
 * @param {sring[]} [filters.days] - Array of days (e.g., ['monday', 'tuesday'])
 * @param {number} [limit=20] - Maximum number of results to return
 * @returns {Promise<Array>} Array of matching tutor documents
 */
export const filterTutors = async (filters: FilterTutor, limit = 20) => {
  const db = firestore();
  try {
    let query = db.collection('users').where('isTutor', '==', true);

    // Apply gender filter if specified
    if (filters.gender) {
      query = query.where('gender', '==', filters.gender);
    }

    if (filters.topic) {
      query = query.where('tutorObj.topic', '==', filters.topic);
    }

    // Apply country filter if specified
    if (filters.countries && filters.countries.length > 0) {
      query = query.where('country', 'in', filters.countries);
    }

    // Apply language filter if specified
    if (filters.languages && filters.languages.length > 0) {
      query = query.where('languages', 'array-contains-any', filters.languages);
    }

    // Fetch the results
    let snapshot = await query.get();

    // Post-query filtering for time slots and days
    let filteredTutors = snapshot.docs
      .map(doc => doc.data() as UserInfo)
      .filter(u => {
        const tutor = u.tutorObj as TutorObj;

        // Filter by time slots
        if (filters.timeSlots && filters.timeSlots.length > 0) {
          if (
            !tutor.avail_index ||
            !filters.timeSlots.some(slot => tutor.avail_index.includes(slot))
          ) {
            return false;
          }
        }

        // Filter by days
        if (filters.days && filters.days.length > 0) {
          if (
            !tutor.schedule ||
            !filters.days.every(
              (day: string) =>
                tutor.schedule[day] && tutor.schedule[day].length > 0,
            )
          ) {
            return false;
          }
        }

        // Filter by subtopics
        if (filters.subTopics && filters.subTopics.length > 0) {
          if (
            !tutor.subTopics ||
            !filters.subTopics.some((_: string) => tutor.subTopics?.includes(_))
          ) {
            return false;
          }
        }

        return true;
      });

    return filteredTutors;
  } catch (error) {
    console.error('Error filtering tutors:', error);
    throw error;
  }
};

/**
 * Calculate the popularity index of a tutor
 * @param {TutorObj} tutor
 * @returns {number}
 */
const calculatePopularityIndex = (tutor: TutorObj) => {
  if (tutor) {
    const reviewCount = tutor.reviews.length;
    const studentCount = tutor.students.length;
    return reviewCount * 0.4 + studentCount * 0.4;
  }
  // You can adjust these weights based on what you consider most important for popularity
  return 0;
};

/**
 * Calculate the average review score of a tutor
 * @param {TutorObj} tutor
 * @returns {number}
 */
const calculateAverageReviewScore = (tutor: TutorObj) => {
  if (tutor) {
    if (tutor.reviews.length === 0) {
      return 0;
    }
    const totalScore = tutor.reviews.reduce(
      (sum, review) => sum + review.rate,
      0,
    );
    return totalScore / tutor.reviews.length;
  }
  return 0;
};

/**
 * Sort tutors based on specified criteria
 * @param {Tutor[]} tutors - Array of tutor objects
 * @param {string} sortCriteria - Sorting criteria ('rate_low_high', 'price_high_low', 'popularity', 'reviews', 'best_rate')
 * @returns {Tutor[]} Sorted array of tutors
 */
export const sortTutors = (tutors: UserInfo[], sortCriteria: SortType) => {
  const sortedTutors = [...tutors]; // Create a copy to avoid modifying the original array

  switch (sortCriteria) {
    case 'price_low_high':
      //@ts-ignore
      return sortedTutors.sort(
        (a, b) => (a.tutorObj.rate || 0) - (b.tutorObj.rate || 0),
      );

    case 'price_high_low':
      //@ts-ignore
      return sortedTutors.sort(
        (a, b) => (b.tutorObj.rate || 0) - (a.tutorObj.rate || 0),
      );

    case 'popularity':
      return sortedTutors.sort(
        (
          a,
          b, //@ts-ignore
        ) =>
          calculatePopularityIndex(b.tutorObj) -
          calculatePopularityIndex(a.tutorObj),
      );

    case 'reviews':
      return sortedTutors.sort(
        //@ts-ignore
        (a, b) => b.tutorObj.reviews.length - a.tutorObj.reviews.length,
      );

    case 'best_rating':
      return sortedTutors.sort(
        (a, b) =>
          //@ts-ignore
          calculateAverageReviewScore(b.tutorObj) - //@ts-ignore
          calculateAverageReviewScore(a.tutorObj),
      );
    default:
      return sortedTutors;
  }
};
