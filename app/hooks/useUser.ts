import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {
  logoutUser,
  updateUserSuccess,
  UserInfo,
} from 'app/redux/user/userReducer';
import {useAppDispatch} from './state/useAppDispatch';
import {useNotif} from './useNotif';
import {getTimeZone, getTimeZoneOffset} from 'app/utils/tools';
//import auth from '@react-native-firebase/auth';

//firestore.FieldValue.serverTimestamp()

export type Notif = {
  id: number;
  userId: string;
  type: string;
  type2: 'follow' | 'gift' | 'verif_notif';
  message: string;
  from: {
    id: string;
    username: string;
  };
  createdAt: FirebaseFirestoreTypes.FieldValue;
  metadata?: string;
  seen: boolean;
};

export const useUser = () => {
  const _ = useAppSelector(state => state).user;
  const [user, setUser] = useState<UserInfo>(_);
  const {addFollowNotif, removeFollowNotif} = useNotif();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    (async () => {
      if (_.id) {
        const req = await firestore().collection('users').doc(`${_.id}`).get();

        const country = await get_Country();

        const options = Intl.DateTimeFormat().resolvedOptions();

        console.log('THE OPTIONS: ', options);

        const _res = req.data() as UserInfo;

        const res: UserInfo = {
          ..._res,
          timeZoneOffset: getTimeZoneOffset(),
          timeZone: getTimeZone(),
          country,
        };
        setUser(res);

        dispatch(updateUserSuccess(res));
      }
    })();
  }, [_.id, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(updateUserSuccess(user));
    }
  }, [user, dispatch]);

  const updateInfo = async (
    _user: UserInfo,
    callback?: () => void,
  ): Promise<void> => {
    await firestore()
      .collection('users')
      .doc(_user.id)
      .set({..._user});
    dispatch(updateUserSuccess(_user));
    callback && callback();

    // Update the local state after updating the user info
    setUser(prevUser => ({
      ...prevUser,
      ..._user,
    }));
  };

  const updateTimeZone = async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    updateInfo({...user, timeZone});

    // Update the local state after updating the time zone
    setUser(prevUser => ({
      ...prevUser,
      timeZone,
    }));
  };

  const followUser = async (userId: string) => {
    if (!user) {
      return;
    }
    if (user.following?.includes(userId)) {
      const res = {
        ...user,
        following: user.following?.filter(u => u !== userId),
      };
      updateInfo(res);
      removeFollowNotif(userId);
    } else {
      const res = {...user, following: [...(user.following || []), userId]};
      updateInfo(res);
      addFollowNotif(userId);
    }

    // Update the local state after following a user
    setUser(prevUser => ({
      ...prevUser,
      following: prevUser.following?.includes(userId)
        ? prevUser.following?.filter(u => u !== userId)
        : [...(prevUser.following || []), userId],
    }));
  };

  const getFollowers = async () => {
    const db = firestore();
    const req = await db
      .collection('users')
      .where('following', 'array-contains', user.id)
      .get();
    const followers = req.docs
      .map(doc => doc.data() as UserInfo)
      .filter(u => u.isDeleted === false);
    return followers as UserInfo[];
  };

  const updateFavTutor = async (tutorId: string) => {
    const db = firestore();
    if ((user.favoriteTutors || []).includes(tutorId)) {
      const temp = (user.favoriteTutors || []).filter(t => t !== tutorId);
      await db.collection('users').doc(_.id).update({favoriteTutors: temp});
    } else {
      const temp = [...(user.favoriteTutors || []), tutorId];
      await db.collection('users').doc(_.id).update({favoriteTutors: temp});
    }

    // Update the local state after updating the favorite tutors
    setUser(prevUser => ({
      ...prevUser,
      favoriteTutors: prevUser.favoriteTutors.includes(tutorId)
        ? prevUser.favoriteTutors.filter(t => t !== tutorId)
        : [...prevUser.favoriteTutors, tutorId],
    }));
  };

  const getFollowing = async () => {
    const db = firestore();
    const req = await db
      .collection('users')
      .where('id', 'in', user.following)
      .get();
    const followers = req.docs.map(doc => doc.data());
    return followers as UserInfo[];
  };

  const logout = async () => {
    try {
      console.log('NOW WE LOGOUT');
      //await auth().signOut();
      console.log('NOW WE LOGOUT NOW');
      dispatch(logoutUser());
    } catch (e) {
      console.log('ERROR WHEN WE LOGOUT', e);
    }
  };

  const deleteMedia = async (photo: string) => {
    const db = firestore();
    await db
      .collection('users')
      .doc(_.id)
      .update({
        photos: firestore.FieldValue.arrayRemove(photo),
      });

    // Update the local state after deleting the media
    setUser(prevUser => ({
      ...prevUser,
      photos: prevUser.photos.filter(p => p !== photo),
    }));
  };

  return {
    user,
    updateInfo,
    followUser,
    getFollowers,
    updateTimeZone,
    updateFavTutor,
    deleteMedia,
    logout,
  };
};

const get_Country = async (): Promise<string> => {
  const _ = Intl.DateTimeFormat().resolvedOptions().locale;
  const res = _.split('-')[1] || 'US';
  return res;
};
