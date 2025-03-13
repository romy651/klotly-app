import firestore from '@react-native-firebase/firestore';
import * as React from 'react';

import {UserInfo as User} from 'app/redux/user/userReducer';
import {Room} from './chatType';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {processRoomsQuery} from './chatAction';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {trigger_room_success} from 'app/redux/room/roomReducer';

export const useRooms = () => {
  const _ = useAppSelector(state => state.room) || [];
  const [rooms, setRooms] = React.useState<Room[]>(_);
  const firebaseUser = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  // const {firebaseUser} = useFirebaseUser()

  React.useEffect(() => {
    const collection = firestore()
      .collection('rooms')
      .where('userIds', 'array-contains', firebaseUser.id)
      .orderBy('updatedAt', 'desc');

    return collection.onSnapshot(async query => {
      const newRooms = await processRoomsQuery({firebaseUser, query});
      dispatch(trigger_room_success(newRooms));
      setRooms(newRooms);
    });
  }, []);

  /** Creates a direct chat for 2 people. Add `metadata` for any additional custom data. */
  const createRoom = async (
    otherUser: User,
    metadata?: Record<string, any>,
  ) => {
    try {
      if (!firebaseUser) {
        return;
      }

      console.log('NOW WE START');
      const query = await firestore()
        .collection('rooms')
        .where('userIds', 'array-contains', firebaseUser.id)
        .get();

      const allRooms = await processRoomsQuery({firebaseUser, query});

      const existingRoom = allRooms.find(room => {
        const userIds = room.users.map(u => u.id);
        return (
          userIds.includes(firebaseUser.id) && userIds.includes(otherUser.id)
        );
      });

      if (existingRoom) {
        return existingRoom;
      }

      const currentUser = {
        registered_at: firebaseUser.registered_at,
        username: `${firebaseUser.firstName} ${firebaseUser.lastName}`,
        avatar: firebaseUser.avatar,
        id: firebaseUser.id,
        photos: firebaseUser.photos,
        age: firebaseUser.age || 24,
        country: firebaseUser.country,
      };

      const _otherUser = {
        registered_at: otherUser.registered_at,
        username: `${otherUser.firstName} ${otherUser.lastName}`,
        avatar: otherUser.avatar,
        id: otherUser.id,
        photos: otherUser.photos,
        age: otherUser.age || 24,
        country: otherUser.country,
      };

      const users = [currentUser].concat(_otherUser);

      //console.log('the current users: ', users)
      const id = new Date().getTime().toString();

      const res = {
        id,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        userIds: users.map(u => u.id),
        users,
        messages: [],
      };
      //console.log('RES', res)

      await firestore()
        .collection('rooms')
        .doc(id)
        .set({...res});

      return {
        id,
        metadata,
        users,
        messages: [],
      } as Room;
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const setRoomsSeen = async () => {
    if (!firebaseUser) {
      return;
    }
    rooms.forEach(async room => {
      const messages = await firestore()
        .collection(`rooms/${room.id}/messages`)
        .get();
      messages.docs.forEach(doc => {
        const message = doc.data();
        if (message.authorId !== firebaseUser.id && message.status !== 'seen') {
          doc.ref.update({status: 'seen'});
        }
      });
    });
  };

  const deleteAllRooms = async () => {
    if (!firebaseUser) {
      return;
    }
    rooms.forEach(async room => {
      await firestore().collection('rooms').doc(room.id).delete();
    });
  };

  const deleteRoom = async (roomId: string) => {
    if (!firebaseUser) {
      return;
    }
    await firestore().collection('rooms').doc(roomId).delete();
  };

  const unreadCount = () => {
    if (!firebaseUser) {
      return 0;
    }
    return rooms.reduce((acc, room) => {
      const unread = (room.messages || []).filter(
        //@ts-ignore
        m => m.authorId !== firebaseUser.id && m.status !== 'seen',
      );
      return acc + unread.length;
    }, 0);
  };

  return {
    createRoom,
    rooms,
    setRoomsSeen,
    deleteAllRooms,
    unreadCount,
    deleteRoom,
  };
};
