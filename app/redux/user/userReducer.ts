import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  Certificate,
  Education,
  Experience,
} from 'app/routes/screens/Screens.types';
import {Alert} from 'react-native';

export type NetUserInfo = {
  id: string;
  username: string;
  email: string;
  thematics: string[];
  categories: string[];
  achievments: string[];
  deleted_at?: number;
  registered_at: number;
  languages: string[];
  country: string;
  free_access_ending_at?: number;
  subscription_period_ending_at?: number;
  trial_ending_at?: number;
  access_type: 'basic' | 'premium';
  push_notification_settings: 'daily' | 'never';
  saved_books: {bookId: string; completion: number}[];
  history: {
    bookId: string;
    completion: number;
    last_updated: number;
  }[];
  finished: {bookId: string}[];
};

export type Review = {
  user: string;
  rate: number;
  content: string;
  date: number;
  reply?: {
    date: number;
    content: string;
  };
};

export type TutorObj = {
  descriptionDesc?: string;
  experienceDesc?: string;
  motivationDesc?: string;
  headline?: string;
  topic?: string;
  subTopics?: string[];
  subTopicsDesc?: {subTopic: string; description: string};
  video?: string;
  videoThumb?: string;
  schedule: Record<string, string[]>;
  rate?: number;
  holidayMode?: boolean;
  reviews: Review[];
  students: string[];
  avail_index: string[];
};

export type UserInfo = {
  id: string;
  stripeId: string;
  firstName: string;
  lastName: string;
  isTutor?: boolean;
  email?: string;
  following?: string[];
  intro?: string;
  deleted_at?: number;
  phone?: number;
  registered_at?: any;
  isVerified?: boolean;
  languages: string[];
  country: string;
  gender: 'man' | 'woman' | 'other';
  emailVerified?: boolean;
  photos: string[];
  timeZone: string;
  timeZoneOffset: number;
  videos?: string[];
  age?: number;
  videoShow?: string;
  deviceId: string;
  avatar?: string;
  stories?: {thumbnail: string; url: string}[];
  blocked_users?: string[];
  coins: number;
  gifts?: Record<string, number>;
  notifications?: {
    newFollowers: boolean;
    directMessages: boolean;
    videoCalls: boolean;
    reminders: boolean;
    lessonLearning: boolean;
  };
  certificates?: Certificate[];
  experiences?: Experience[];
  favoriteTutors: string[];
  education?: Education[];
  tutorObj?: TutorObj;
  isDeleted: boolean;
  subscriptions: {
    tutorId: string;
    frequence: number;
    unitPrice: number;
  }[];
};

const defaultState = {} as UserInfo;

export interface ErrorAction {
  type: string;
  payload: {
    message: string;
  };
}

const configSlice = createSlice({
  name: 'user',
  initialState: defaultState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      Object.assign(state, action.payload);
    },
    loginFailure: (state, action: PayloadAction<ErrorAction>) => {
      const message = action.payload.payload.message;
      Alert.alert('Error', message);
    },
    registerSuccess: (state, action: PayloadAction<UserInfo>) => {
      Object.assign(state, action.payload);
    },
    registerFailure: (state, action: PayloadAction<ErrorAction>) => {
      const message = action.payload.payload.message;
      Alert.alert('Error', message);
    },
    updateUserSuccess: (state, action: PayloadAction<UserInfo>) => {
      Object.assign(state, action.payload);
    },
    logoutUser: state => {
      //@ts-ignore
      state.id = undefined;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  updateUserSuccess,
  logoutUser,
} = configSlice.actions;

export const userReducer = configSlice.reducer;
