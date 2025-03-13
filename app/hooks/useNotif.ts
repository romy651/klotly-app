import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import * as React from 'react';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {getUser, USERS_COLLECTION_NAME} from 'app/actions/chatAction';
import {GiftType} from 'app/constants';
import {dictionaryToMap, sendPushNotif, updateGift} from 'app/utils/tools';
import {UserInfo} from 'app/redux/user/userReducer';
import _ from 'lodash';

//firestore.FieldValue.serverTimestamp()

export type Notif = {
  id: number;
  userId: string;
  type: string;
  type2:
    | 'follow'
    | 'gift'
    | 'verif_notif'
    | 'message'
    | 'booking_confirmed'
    | 'new_booking';
  message: string;
  from: {
    id: string;
    username: string;
  };
  createdAt: FirebaseFirestoreTypes.FieldValue;
  metadata?: string;
  seen: boolean;
};

export const useNotif = () => {
  const [notifs, setNotifs] = React.useState<Notif[]>([]);
  const firebaseUser = useAppSelector(state => state.user);

  React.useEffect(() => {
    if (!firebaseUser) {
      setNotifs([]);
      return;
    }

    const collection = firestore()
      .collection('notifs')
      .where('userId', '==', firebaseUser.id)
      .orderBy('createdAt', 'desc');
    return collection.onSnapshot(async query => {
      const allNotifs = query.docs.map(doc => {
        return doc.data() as Notif;
      });

      setNotifs(allNotifs);
    });
  }, [firebaseUser]);

  const createNotif = async (notif: Notif) => {
    try {
      if (!firebaseUser) {
        return;
      }
      await firestore()
        .collection('notifs')
        .doc(`${notif.id}`)
        .set({...notif});
    } catch (error) {
      console.log('ERROR', error);
    }
    const user = await getUser(notif.userId);
    if (notif.type2 === 'follow') {
      (user.notifications?.newFollowers || true) &&
        sendPushNotif(notif.userId, {
          title: 'New Follower ',
          body: `${notif.from.username} started following you, open the app and start the conversation!`,
        });
    }
    if (notif.type2 === 'gift') {
      sendPushNotif(notif.userId, {
        title: 'New Gift',
        body: `Congratulations! You just received a gift from ${notif.from.username}, open the app and check it out!`,
      });
    }
    if (notif.type2 === 'booking_confirmed') {
      sendPushNotif(notif.userId, {
        title: 'New Gift',
        body: `Congratulations! You session with${notif.from.username} is confirmed!`,
      });
    }
    if (notif.type2 === 'new_booking') {
      sendPushNotif(notif.userId, {
        title: 'New booking',
        body: `Congratulations! You just received a new booking from ${notif.from.username}, open the app and check it out!`,
      });
    }
  };

  const sendMessagesNotif = async (userId: string) => {
    const user = await getUser(userId);
    (user.notifications?.directMessages || true) &&
      sendPushNotif(userId, {
        title: 'New Message',
        body: `You have a new message from ${firebaseUser.firstName}, open the app to continue the chat!`,
      });
  };

  const sendBookingConfirmationNotice = async (
    user: UserInfo,
    tutor: UserInfo,
  ) => {
    console.log('WE PUSH THE LOCAL NOTIF');
    const id = new Date().getTime();
    const notif1: Notif = {
      id,
      userId: user.id,
      type: 'system_notice',
      type2: 'booking_confirmed',
      message: 'booking_confirmed',
      from: {
        id: tutor.id,
        username: tutor.firstName,
      },
      createdAt: firestore.FieldValue.serverTimestamp(),
      seen: false,
    };
    await createNotif(notif1);

    const notif2: Notif = {
      id: new Date().getTime(),
      userId: tutor.id,
      type: 'system_notice',
      type2: 'new_booking',
      message: 'new_booking',
      from: {
        id: user.id,
        username: user.firstName,
      },
      createdAt: firestore.FieldValue.serverTimestamp(),
      seen: false,
    };
    await createNotif(notif2);
  };

  const addFollowNotif = async (userId: string) => {
    if (!firebaseUser) {
      return;
    }
    removeFollowNotif(userId);
    const id = new Date().getTime();
    const notif: Notif = {
      id,
      userId,
      type: 'system_notice',
      type2: 'follow',
      message: 'follow_desc',
      from: {
        id: firebaseUser.id,
        username: firebaseUser.firstName,
      },
      createdAt: firestore.FieldValue.serverTimestamp(),
      seen: false,
    };
    await createNotif(notif);
  };

  const removeFollowNotif = async (userId: string) => {
    if (!firebaseUser) {
      return;
    }
    const query = await firestore()
      .collection('notifs')
      .where('userId', '==', userId)
      .where('type2', '==', 'follow')
      .where('from', '==', firebaseUser.id)
      .get();
    query.docs[0]?.ref.delete();
  };

  const addGiftNotif = async (userId: string, gift: GiftType) => {
    if (!firebaseUser) {
      return;
    }
    console.log('NOW WE SEND THE GIFT');
    const id = new Date().getTime();
    const notif: Notif = {
      id,
      userId,
      type: 'system_notice',
      type2: 'gift',
      message: 'got_gift_desc',
      from: {
        id: firebaseUser.id,
        username: firebaseUser.firstName,
      },
      createdAt: firestore.FieldValue.serverTimestamp(),
      metadata: gift.id.toString(),
      seen: false,
    };
    await createNotif(notif);
    const user = await getUser(userId);
    if (user) {
      const userGifts = dictionaryToMap(user.gifts);
      console.log('NOW WE SEND THE GIFT WITH THE MAP, ', userGifts);
      const gifts = updateGift(userGifts, gift.id.toString());
      const _g: any = {};
      gifts.forEach((v, k) => {
        const _k = parseInt(k);
        _g[_k] = v;
      });
      await firestore()
        .collection(USERS_COLLECTION_NAME)
        .doc(`${userId}`)
        .update({coins: (user.coins || 0) + gift.price, gifts: _g});
    }
  };

  const setNotifSeen = async () => {
    if (!firebaseUser) {
      return;
    }
    notifs.forEach(async notif => {
      await firestore()
        .collection('notifs')
        .doc(`${notif.id}`)
        .update({seen: true});
    });
  };

  return {
    notifs,
    addFollowNotif,
    addGiftNotif,
    removeFollowNotif,
    setNotifSeen,
    sendMessagesNotif,
    sendBookingConfirmationNotice,
  };
};
