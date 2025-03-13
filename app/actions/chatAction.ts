import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {FirebaseChatCoreConfig, Room} from './chatType';
import {UserInfo as User, UserInfo} from 'app/redux/user/userReducer';

export let ROOMS_COLLECTION_NAME = 'rooms';
export let USERS_COLLECTION_NAME = 'users';

/** Sets custom config to change default names for rooms
 * and users collections. Also see {@link FirebaseChatCoreConfig}. */

/** Creates {@link User} in Firebase to store name and avatar used on rooms list */

/** Removes {@link User} from `users` collection in Firebase */
export const deleteUserFromFirestore = async (userId: string) => {
  await firestore().collection(USERS_COLLECTION_NAME).doc(userId).delete();
};

/** Fetches user from Firebase and returns a promise */
export const fetchUser = async (userId: string) => {
  const doc = await firestore()
    .collection(USERS_COLLECTION_NAME)
    .doc(userId)
    .get();

  const data = doc.data()! as UserInfo;

  const user = {
    registered_at: data.registered_at,
    username: `${data.firstName ?? ''} • ${data.lastName ?? ''}`.trim(),
    avatar: data.avatar,
    id: data.id,
    photos: data.photos,
    age: data.age,
  };

  return user;
};

export const getUser = async (userId: string) => {
  const doc = await firestore()
    .collection(USERS_COLLECTION_NAME)
    .doc(userId)
    .get();
  return doc.data() as User;
};

export const getUsers = async (userIds: string[]): Promise<UserInfo[]> => {
  const userPromises = userIds.map(id => getUser(id));
  const res = await Promise.all(userPromises);
  return res.filter(u => (u.isDeleted || false) === false);
};

/** Returns an array of {@link Room}s created from Firebase query.
 * If room has 2 participants, sets correct room name and image. */
export const processRoomsQuery = async ({
  firebaseUser,
  query,
}: {
  firebaseUser: UserInfo;
  query: FirebaseFirestoreTypes.QuerySnapshot;
}) => {
  const promises = query.docs.map(async doc =>
    processRoomDocument({doc, firebaseUser}),
  );

  return await Promise.all(promises);
};

/** Returns a {@link Room} created from Firebase document */
export const processRoomDocument = async ({
  doc,
  firebaseUser,
}: {
  doc:
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
    | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  firebaseUser: UserInfo;
}) => {
  const data = doc.data()!;

  // Ignore types here, not provided by the Firebase library
  // type-coverage:ignore-next-line
  const createdAt = data.createdAt?.toMillis() ?? undefined;
  const id = doc.id;
  // type-coverage:ignore-next-line
  const updatedAt = data.updatedAt?.toMillis() ?? undefined;

  // type-coverage:ignore-next-line
  let imageUrl = data.imageUrl ?? undefined;
  let lastMessages;
  // type-coverage:ignore-next-line
  let name = data.name ?? undefined;
  // type-coverage:ignore-next-line
  const metadata = data.metadata ?? undefined;
  // type-coverage:ignore-next-line
  //const userIds = data.userIds as string[]

  const users = data.users;
  const otherUser = users.find(
    (u: any) => u.id !== firebaseUser.id,
  ) as UserInfo;

  const req = await firestore()
    .collection('rooms')
    .doc(id)
    .collection('messages')
    .get();

  const messages: any[] = req.docs.map(doc => {
    return doc.data();
  });

  //const messages = data.messages || []

  if (otherUser) {
    imageUrl = otherUser.avatar;
    name = `${otherUser.firstName ?? ''} • ${otherUser.lastName ?? ''}`.trim();
  }

  // type-coverage:ignore-next-line
  if (data.lastMessages && data.lastMessages instanceof Array) {
    // type-coverage:ignore-next-line
    lastMessages = data.lastMessages.map((lm: any) => {
      // type-coverage:ignore-next-line
      const author = users.find((u: any) => u.id === lm.authorId) ?? {
        // type-coverage:ignore-next-line
        id: lm.authorId as string,
      };

      return {
        // type-coverage:ignore-next-line
        ...(lm ?? {}),
        author,
        // type-coverage:ignore-next-line
        createdAt: lm.createdAt?.toMillis() ?? undefined,
        // type-coverage:ignore-next-line
        id: lm.id ?? '',
        // type-coverage:ignore-next-line
        updatedAt: lm.updatedAt?.toMillis() ?? undefined,
      };
    });
  }

  const room: Room = {
    createdAt,
    id,
    imageUrl,
    lastMessages,
    metadata,
    name,
    updatedAt,
    users,
    messages,
    otherUser,
  };

  return room;
};
