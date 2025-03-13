import {UserInfo} from 'app/redux/user/userReducer';
import {store} from 'app/store';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type SetContext = (v: UserInfo) => void;

// Create a context for the user state
const UserContext = createContext<UserInfo | null>(null);
const setContext = createContext<SetContext>((_: UserInfo) => {});

// Create a provider component
export function UserProvider({children}: {children: React.ReactNode}) {
  const currentUser = store.getState().user;
  const [user, setUser] = useState<UserInfo>(currentUser);

  // Function to update user state
  const updateUser = useCallback(
    async (_: UserInfo) => {
      setUser(_);
      await firestore()
        .collection('users')
        .doc(user.id)
        .set({...user});
    },
    [setUser],
  );

  // You can add more functions here, like login, logout, etc.
  const login = (userData: UserInfo) => {
    // Perform login logic here
    setUser(userData);
  };

  const logout = () => {
    //setUser(null);
  };

  // You can add effects here to fetch user data on app start, listen to auth state changes, etc.
  useEffect(() => {
    // Example: fetch user data on component mount
    // fetchUserData().then(userData => setUser(userData));
  }, []);

  return (
    <UserContext.Provider value={{user, updateUser, login, logout}}>
      {children}
    </UserContext.Provider>
  );
}

// Create a custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
