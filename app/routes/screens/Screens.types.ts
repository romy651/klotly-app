/**
 * @Project Summarised
 * @File Screens.GradientType.ts
 * @Path app/routes
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import {
  BookingStackScreens,
  BottomTabsScreens,
  CallStackScreens,
  ChatStackScreens,
  ExploreStackScreens,
  FilterStackScreens,
  HomeStackScreens,
  LibraryStackScreens,
  ModalScreens,
  OnBoardingScreens,
  Stack,
  VideoStackScreens,
} from './Stack';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/core';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {ICategory, IThematic} from '../../domain/interface/IThematic';
import {IAuthor} from '../../domain/interface/IAuthor';
import {BookInfo} from 'app/redux/book/bookReducer';
import {
  CategoryInfo,
  ChallengeInfo,
  CollectionInfo,
  RecommendationInfo,
} from 'app/constants/OnBoarding';
import {UserInfo} from 'app/redux/user/userReducer';
import {InstagramStoryProps} from 'react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import firestore from '@react-native-firebase/firestore';
import {Room} from 'app/actions/chatType';
import {Asset, ImagePickerResponse} from 'react-native-image-picker';
import {Image, Video} from 'react-native-image-crop-picker';
import {Booking} from 'app/hooks/useBooking';

export type Experience = {
  uid: number;
  title: string;
  employmentType: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  area: string;
  description?: string;
  stillWorking: boolean;
  verified?: boolean;
  image?: string;
};

export type Certificate = {
  uid: number;
  name: string;
  issuingOrganisation: string;
  issueDate: string;
  verificationUrl?: string;
  description?: string;
  verified?: boolean;
  image?: string;
};

export type Education = {
  uid: number;
  school: string;
  degree: string;
  fieldStudy: string;
  startDate: string;
  endDate: string;
  verificationUrl?: string;
  description?: string;
  verified?: boolean;
  image?: string;
};

export type MeetingPlace = {
  description: string;
  lat: number;
  lng: number;
};

export type OnBoardingStackParamList = {
  [OnBoardingScreens.UpdateProfile]: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  [OnBoardingScreens.LanguagesScreen]: {
    languages: string[];
    callback: (languages: string[]) => void;
  };
  [OnBoardingScreens.LandingScreen]: undefined;
  [OnBoardingScreens.SelectThematicScreen]: undefined;
  [OnBoardingScreens.EmailSignUpScreen]: undefined;
  [OnBoardingScreens.ForgotPassword]: undefined;
  [OnBoardingScreens.WelcomeScreen]: undefined;
  [OnBoardingScreens.SelectAchievments]: undefined;
  [OnBoardingScreens.PricingScreen]: undefined;
  [OnBoardingScreens.EmailValidateScreen]: {email?: string};
  [OnBoardingScreens.PasswordSignUpScreen]: {email?: string};
  [OnBoardingScreens.SelectCategoriesScreen]: {
    thematics: IThematic[];
  };
  [OnBoardingScreens.SelectAuthorScreen]: {
    categories?: Array<ICategory>;
    email?: string;
    password?: string;
  };
  [OnBoardingScreens.SelectBooksScreen]: {
    categories?: Array<ICategory>;
    authors?: Array<IAuthor>;
    email?: string;
    password?: string;
  };
  [OnBoardingScreens.NotificationSetupScreen]: undefined;
  [OnBoardingScreens.OnboardingCompleteScreen]: undefined;
  [OnBoardingScreens.ChooseTopicScreen]: undefined;
  [OnBoardingScreens.ChooseSubTopicScreen]: {topic: string};
  [OnBoardingScreens.SignInScreen]: undefined;
  [OnBoardingScreens.SignUpScreen]: undefined;
  [OnBoardingScreens.HomeSignInScreen]: undefined;
  [OnBoardingScreens.HomeSignUpScreen]: undefined;
  [OnBoardingScreens.AddPhotoScreen]: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    languages: string[];
    gender: 'other' | 'man' | 'woman';
  };
  [OnBoardingScreens.AddNotificationScreen]: undefined;
};

export type HomeStackParamList = {
  [HomeStackScreens.ReportScreen]: {
    user: UserInfo;
    callback?: () => void;
    type: 'post' | 'user';
    postId?: number;
  };
  [HomeStackScreens.HomeScreen]: undefined;
  [HomeStackScreens.SearchScreen]: undefined;
  [HomeStackScreens.BookmarkScreen]: undefined;
};

export type CallStackParamList = {
  [CallStackScreens.CallScreen]: undefined;
  [CallStackScreens.CommunityScreen]: undefined;
};

export type ChatStackParamList = {
  [ChatStackScreens.DirectScreen]: undefined;
};

export type ExploreStackParamList = {
  [ExploreStackScreens.ExploreScreen]: undefined;
  [ExploreStackScreens.SearchScreen]: undefined;
  [ExploreStackScreens.SettingScreen]: undefined;
  [ExploreStackScreens.TopicScreen]: undefined;
  [ExploreStackScreens.ListBookScreen]: {
    title: string;
    list: BookInfo[] | CategoryInfo[];
    type?: 'book' | 'collection' | 'historyBook';
    withSorting?: boolean;
  };
  [ExploreStackScreens.CategoryScreen]: {category: ICategory};
  [ExploreStackScreens.BookDetailScreen]: {
    bookInfo: BookInfo;
  };
  [ExploreStackScreens.CollectionDetailScreen]: {
    collectionInfo: CollectionInfo;
  };
  [ExploreStackScreens.RecommendationDetailScreen]: {
    recommendationInfo: RecommendationInfo;
  };
};

export type FilterStackParamList = {
  [FilterStackScreens.FilterScreen]: {
    callback: (tutor: UserInfo[], title: string) => void;
    close: () => void;
  };
  [FilterStackScreens.CountrySearchScreen]: {
    callBack: (res: string[]) => void;
  };
  [FilterStackScreens.SelectLanguageScreen]: {
    callBack: (res: string[]) => void;
  };
};

export type BookingStackParamList = {
  [BookingStackScreens.BookingScreen]: {
    tutor: UserInfo;
    callback: () => void;
    booking?: Booking;
  };
  [BookingStackScreens.BookingConfirmationScreen]: {
    tutor: UserInfo;
    date: string;
    slot: string;
    type: string;
    location?: MeetingPlace;
    callback?: () => void;
    booking?: Booking;
  };
  [BookingStackScreens.AddLocationScreen]: {
    tutor: UserInfo;
    date: string;
    slot: string;
    type: string;
    booking?: Booking;
  };
};

export type LibraryStackParamList = {
  [LibraryStackScreens.AccountScreen]: undefined;
  [LibraryStackScreens.EditProfileScreen]: {callback: () => void};
  [LibraryStackScreens.AddCertificateScreen]: {
    data?: Certificate;
    onDone: (experience: Certificate) => void;
  };
  [LibraryStackScreens.AddEducationScreen]: {
    data?: Education;
    onDone: (experience: Education) => void;
  };
  [LibraryStackScreens.AddWorkExperienceScreen]: {
    data?: Experience;
    onDone: (experience: Experience) => void;
  };
  [LibraryStackScreens.CVEditScreen]: {
    title: string;
  };
};

export type VideoStackParamList = {
  [VideoStackScreens.VideoCallHomeScreen]: undefined;
};

export type AuthStackParamList = {};

export type SortType =
  | 'price_low_high'
  | 'price_high_low'
  | 'popularity'
  | 'reviews'
  | 'best_rating'
  | 'pertinence';

export type BottomTabsStackParamList = {
  [BottomTabsScreens.ExploreScreen]: undefined;
  [BottomTabsScreens.LibraryScreen]: undefined;
  [BottomTabsScreens.HomeStack]: undefined;
  [BottomTabsScreens.DirectStack]: undefined;
  [BottomTabsScreens.AgendaSreen]: undefined;
};

export type AppStackParamList = {
  [Stack.WebViewScreen]: {url: string; title: string};
  [Stack.OnboardMentorMain]: undefined;
  [Stack.BookingMenuScreen]: {booking: Booking; other: UserInfo};
  [Stack.ScheduleDateScreen]: {
    reason: string;
    booking: Booking;
    tutor: UserInfo;
  };
  [Stack.RescheduleScreen]: {
    booking: Booking;
    reason: 'reject' | 'reschedule' | 'cancel';
    tutor: UserInfo;
  };
  [Stack.StoryScreen]: {story: InstagramStoryProps};
  [Stack.ProfileScreen]: {id: string; user?: UserInfo};
  [Stack.SettingScreen]: undefined;
  [Stack.ChatScreen]: {room: Room};
  [Stack.GalleryScreen]: {photos: string[]; index: number};
  [Stack.FilterNavigation]: {
    callback: (tutor: UserInfo[], title: string) => void;
  };
  [Stack.BookingNavigation]: {
    callback: () => void;
    tutor: UserInfo;
    booking?: Booking;
  };
  [Stack.OnBoardingStack]: NavigatorScreenParams<OnBoardingStackParamList>;
  [Stack.ModalStack]: NavigatorScreenParams<ModalStackParamList>;
  [Stack.AuthStack]: NavigatorScreenParams<AuthStackParamList>;
  [Stack.BottomTabsStack]: NavigatorScreenParams<BottomTabsStackParamList>;
  [Stack.UploadImageScreen]: {
    callback: (uri: string | ImagePickerResponse) => void;
    fullData?: boolean;
  };
  [Stack.UploadMediaScreen]: {
    callback: (uri: string, type: 'image' | 'video') => void;
  };
  [Stack.BottomInputValue]: {
    type:
      | 'firstName'
      | 'lastName'
      | 'seeking'
      | 'age'
      | 'email'
      | 'language'
      | 'intro';
    value: string;
    callback: (value: string) => void;
  };
  [Stack.HomeLanguageScreen]: {
    languages: string[];
    callback: (languages: string[]) => void;
  };
  [Stack.DisplayLanguageScreen]: undefined;
  [Stack.NotificationScreen]: undefined;
  [Stack.BlockedUsersScreen]: undefined;
  [Stack.DislikeUsersScreen]: undefined;
  [Stack.FeedbackScreen]: undefined;
  [Stack.EmailVerificationScreen]: undefined;
  [Stack.PlanScreen]: undefined;
  [Stack.CoinScreen]: undefined;
  [Stack.NoticeScreen]: undefined;
  [Stack.GiftScreen]: {userId: string};
  [Stack.FollowScreen]: {
    userId: string | string[];
    type: 'followers' | 'following' | 'list_participants' | 'likes';
  };
  [Stack.OutGoingCall]: {user: UserInfo};
  [Stack.OngoingCallScreen]: {bookingId: number; userIds: string[]};
  [Stack.UserProfileScreen]: {userId: string; user?: UserInfo};
  [Stack.UploadProfileScreen]: {callback: (uri: string) => void};
  [Stack.SelectVariantScreen]: {
    initValue: {
      key: string;
      value: string[];
      type: 'select' | 'choice';
    };
    initChecked: string[];
    onDone: (res: string[]) => void;
  };
  [Stack.AppointmentScreen]: {
    booking: Booking;
    tutor: UserInfo;
    students: UserInfo[];
  };
  [Stack.BookingScreen]: {
    tutor: UserInfo;
    callback: () => void;
    booking?: Booking;
  };
  [Stack.BookingConfirmationScreen]: {
    id: number;
    tutor: UserInfo;
    date: string;
    slot: string;
    type: string;
    location?: MeetingPlace;
    callback?: () => void;
    booking?: Booking;
  };
  [Stack.AddLocationScreen]: {
    id: number;
    tutor: UserInfo;
    date: string;
    slot: string;
    type: string;
    booking?: Booking;
  };
  [Stack.SortScreen]: {
    callback: (sort: SortType) => void;
    sort: SortType;
  };
  [Stack.SelectTopic]: {forced?: boolean};
  [Stack.SelectSubTopic]: {topic: string};
  [Stack.ResumeScreen]: {user: UserInfo; isNew: boolean};
  [Stack.LeaveFeedbackScreen]: {tutor: UserInfo};
  [Stack.ReviewScreen]: {tutor: UserInfo; isNew?: boolean};
  [Stack.RescheduleConfirmed]: {name: string; date: string; topic: string};
  [Stack.CancelationConfirmed]: undefined;
  [Stack.FavoriteScreen]: undefined;
  [Stack.CreatePostScreen]: undefined;
  [Stack.CommentSheetScreen]: {
    postId: string;
    onComment: (text: string) => Promise<void>;
    focus?: boolean;
  };
  [Stack.PostsScreen]: {userId: string};
  [Stack.DeleteAccountScreen]: undefined;
  [Stack.ScanQRCodeScreen]: undefined;
};

export type ModalStackParamList = {
  [ModalScreens.Plan]: undefined;
  [ModalScreens.Book]: {book: BookInfo};
};

export type AppStackNavigationProp =
  NativeStackNavigationProp<AppStackParamList>;
export type AppStackScreenProps = NativeStackScreenProps<AppStackParamList>;
export type AppStackScreenProp<Screen extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, Screen>;

export type ModalStackNavigationProp =
  NativeStackNavigationProp<ModalStackParamList>;

export type OnBoardingStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<OnBoardingStackParamList>,
  AppStackNavigationProp
>;
export type AuthStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  AppStackNavigationProp
>;

export type MainStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<BottomTabsStackParamList>,
  AppStackNavigationProp
>;

export type RootParamList = AppStackParamList &
  OnBoardingStackParamList &
  ModalStackParamList &
  AuthStackParamList &
  MainStackNavigationProp;

export const useAppStackNavigation = (): AppStackNavigationProp =>
  useNavigation<AppStackNavigationProp>();

export const useModalStackNavigation = (): ModalStackNavigationProp =>
  useNavigation<ModalStackNavigationProp>();

export const useOnboardStackNavigation = (): OnBoardingStackNavigationProp =>
  useNavigation<OnBoardingStackNavigationProp>();

export const useAuthStackNavigation = (): AuthStackNavigationProp =>
  useNavigation<AuthStackNavigationProp>();

export const useMainStackNavigation = (): MainStackNavigationProp =>
  useNavigation<MainStackNavigationProp>();
