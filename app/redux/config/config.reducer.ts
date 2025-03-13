/**
 * @Project Summarised
 * @File config.reducer.ts
 * @Path app/redux/config
 * @Author BRICE ZELE
 * @Date 11/03/2023
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppareanceType, ThemeType} from '../../themes/Theme';
import i18nBase from 'i18next';
//import {BookInfo} from '../book/bookReducer'

export interface IAppTutorial {
  app: boolean;
  post: boolean;
  imageDetail: boolean;
}

export interface IScreenViewCount {
  post: number;
}

export interface IAppConfiguration {
  payload?: any;
  theme: ThemeType;
  font: AppareanceType | null;
  forceDark: boolean | null;
  language: string | null;
  introSlidesShow: boolean;
  lowDataMode: boolean;
  appTutorialShow: IAppTutorial;
  showPrivacyPolicy: boolean;
  popupMessageOrComponent: string | null | boolean;
  searchHistory: Array<any>;
  videoPlayerFullscreen: boolean;
  homeDisposition: Array<Record<any, any>> | null;
  userFilter: UserFilterType;
  appLanguage: string;
  notification: {
    newFollowers: boolean;
    directMessages: boolean;
    videoCalls: boolean;
    reminders: boolean;
  };
  exchangeRate: number;
  topic?: string;
  subTopics?: string[];
}

export type AppConfigurationType = Readonly<IAppConfiguration>;

export type UserFilterType = {
  gender?: 'man' | 'woman' | 'other';
  countries: string[];
  languages: string[];
};

const initialConfigState: AppConfigurationType = {
  theme: 'blue',
  font: null,
  forceDark: null,
  language: null,
  lowDataMode: false,
  introSlidesShow: true,
  appTutorialShow: {
    app: false,
    post: true,
    imageDetail: true,
  },
  showPrivacyPolicy: false,
  popupMessageOrComponent: null,
  searchHistory: [],
  videoPlayerFullscreen: false,
  homeDisposition: null,
  userFilter: {
    countries: ['us', 'uk', 'fr', 'de'],
    languages: [],
  },
  appLanguage: 'en',
  notification: {
    newFollowers: true,
    directMessages: true,
    videoCalls: true,
    reminders: true,
  },
  exchangeRate: 1,
};

const configSlice = createSlice({
  name: 'config',
  initialState: initialConfigState,
  reducers: {
    changeTheme: (state, action: PayloadAction<ThemeType>) => {
      const theme = action.payload;
      state.theme = theme;
    },
    changeAppareance: (state, action: PayloadAction<boolean>) => {
      const appareance = action.payload;
      state.forceDark = appareance;
    },
    updateUserFilter: (state, action: PayloadAction<UserFilterType>) => {
      state.userFilter = action.payload;
    },
    changeAppLanguage: (state, action: PayloadAction<string>) => {
      state.appLanguage = action.payload;
      i18nBase.changeLanguage(action.payload);
    },
    changeNotification: (
      state,
      action: PayloadAction<IAppConfiguration['notification']>,
    ) => {
      state.notification = action.payload;
    },
    changeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload;
    },
    addTopics: (
      state,
      action: PayloadAction<{topic: string; subTopics: string[]}>,
    ) => {
      state.topic = action.payload.topic;
      state.subTopics = action.payload.subTopics;
    },
    cleanData: state => {
      Object.assign(state, initialConfigState);
    },
  },
});

export const {
  changeTheme,
  changeAppareance,
  updateUserFilter,
  changeAppLanguage,
  changeNotification,
  changeRate,
  addTopics,
  cleanData,
} = configSlice.actions;

export const configReducer = configSlice.reducer;
