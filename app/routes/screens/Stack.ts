/**
 * @Project Summarised
 * @File Screens.ts
 * @Path app/routes
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */

export enum Stack {
  StoryScreen = 'StoryScreen',
  FilterNavigation = 'FilterNavigation',
  BookingNavigation = 'BookingNavigation',
  OnBoardingStack = 'OnBoardingStack',
  ModalStack = 'ModalStack',
  AuthStack = 'AuthStack',
  BottomTabsStack = 'MaintStack',
  GalleryScreen = 'GalleryScreen',
  ProfileScreen = 'ProfileScreen',
  ChatScreen = 'ChatScreen',
  UploadImageScreen = 'UploadImageScreen',
  UploadMediaScreen = 'UploadMediaScreen',
  BottomInputValue = 'BottomInputValue',
  HomeLanguageScreen = 'HomeLanguageScreen',
  SettingScreen = 'SettingScreen',
  DisplayLanguageScreen = 'DisplayLanguageScreen',
  NotificationScreen = 'NotificationScreen',
  BlockedUsersScreen = 'BlockedUsersScreen',
  DislikeUsersScreen = 'DislikeUsersScreen',
  FeedbackScreen = 'FeedbackScreen',
  EmailVerificationScreen = 'EmailVerificationScreen',
  PlanScreen = 'PlanScreen',
  CoinScreen = 'CoinScreen',
  NoticeScreen = 'NoticeScreen',
  GiftScreen = 'GiftScreen',
  FollowScreen = 'FollowScreen',
  OutGoingCall = 'OutGoingCall',
  OngoingCallScreen = 'OngoingCallScreen',
  UserProfileScreen = 'UserProfileScreen',
  UploadProfileScreen = 'UploadProfileScreen',
  SelectVariantScreen = 'SelectVariantScreen',
  AppointmentScreen = 'AppointmentScreen',
  RescheduleScreen = 'RescheduleScreen',
  ScheduleDateScreen = 'ScheduleDateScreen',
  BookingMenuScreen = 'BookingMenuScreen',
  OnboardMentorMain = 'OnboardMentorMain',
  BookingScreen = 'BookingScreen',
  BookingConfirmationScreen = 'BookingConfirmationScreen',
  AddLocationScreen = 'AddLocationScreen',
  SortScreen = 'SortScreen',
  SelectTopic = 'SelectTopic',
  SelectSubTopic = 'SelectSubTopic',
  ResumeScreen = 'ResumeScreen',
  LeaveFeedbackScreen = 'LeaveFeedbackScreen',
  ReviewScreen = 'ReviewScreen',
  RescheduleConfirmed = 'RescheduleConfirmed',
  CancelationConfirmed = 'CancelationConfirmed',
  FavoriteScreen = 'FavoriteScreen',
  CreatePostScreen = 'CreatePostScreen',
  CommentSheetScreen = 'CommentSheetScreen',
  PostsScreen = 'PostsScreen',
  DeleteAccountScreen = 'DeleteAccountScreen',
  ScanQRCodeScreen = 'ScanQRCodeScreen',
  WebViewScreen = 'WebViewScreen',
}

export enum OnBoardingScreens {
  //Tutorial
  UpdateProfile = 'UpdateProfile',
  LanguagesScreen = 'LanguagesScreen',
  EmailSignUpScreen = 'EmailSignUpScreen',
  EmailValidateScreen = 'EmailValidateScreen',
  PasswordSignUpScreen = 'PasswordSignUpScreen',
  LandingScreen = 'LandingScreen',
  SelectThematicScreen = 'SelectThematicScreen',
  SelectCategoriesScreen = 'SelectCategoriesScreen',
  SelectAuthorScreen = 'SelectAuthorScreen',
  SelectBooksScreen = 'SelectBooksScreen',
  NotificationSetupScreen = 'NotificationSetupScreen',
  OnboardingCompleteScreen = 'OnboardingCompleteScreen',
  SignInScreen = 'SignInScreen',
  SignUpScreen = 'SignUpScreen',
  ForgotPassword = 'ForgotPassword',
  WelcomeScreen = 'WelcomeScreen',
  SelectAchievments = 'SelectAchievments',
  PricingScreen = 'PricingScreen',
  ChooseTopicScreen = 'ChooseTopicScreen',
  ChooseSubTopicScreen = 'ChooseSubTopicScreen',
  HomeSignInScreen = 'HomeSignInScreen',
  HomeSignUpScreen = 'HomeSignUpScreen',
  AddPhotoScreen = 'AddPhotoScreen',
  AddNotificationScreen = 'AddNotificationScreen',
}

export enum HomeStackScreens {
  HomeScreen = 'HomeScreen',
  SearchScreen = 'SearchScreen',
  ReportScreen = 'ReportScreen',
  BookmarkScreen = 'BookmarkScreen',
}

export enum FilterStackScreens {
  FilterScreen = 'FilterScreen',
  CountrySearchScreen = 'CountrySearchScreen',
  SelectLanguageScreen = 'SelectLanguageScreen',
}

export enum BookingStackScreens {
  BookingScreen = 'BookingScreen',
  BookingConfirmationScreen = 'BookingConfirmationScreen',
  AddLocationScreen = 'AddLocationScreen',
}

export enum CallStackScreens {
  CallScreen = 'CallScreen',
  CommunityScreen = 'CommunityScreen',
}

export enum ChatStackScreens {
  DirectScreen = 'DirectScreen',
}

export enum ExploreStackScreens {
  ExploreScreen = 'ExploreScreen',
  BookDetailScreen = 'BookDetailScreen',
  CollectionDetailScreen = 'CollectionDetailScreen',
  RecommendationDetailScreen = 'RecommendationDetailScreen',
  SearchScreen = 'SearchScreen',
  SettingScreen = 'SettingScreen',
  TopicScreen = 'TopicScreen',
  CategoryScreen = 'CategoryScreen',
  ListBookScreen = 'ListBookScreen',
}

export enum AuthScreens {}

export enum LibraryStackScreens {
  AccountScreen = 'AccountScreen',
  EditProfileScreen = 'EditProfileScreen',
  AddCertificateScreen = 'AddCertificateScreen',
  AddEducationScreen = 'AddEducationScreen',
  AddWorkExperienceScreen = 'AddWorkExperienceScreen',
  CVEditScreen = 'CVEditScreen',
}

export enum VideoStackScreens {
  VideoCallHomeScreen = 'VideoCallHomeScreen',
}

export enum BottomTabsScreens {
  HomeStack = 'HomeStack',
  ExploreScreen = 'ExploreScreen',
  AgendaSreen = 'AgendaSreen',
  DirectStack = 'DirectStack',
  LibraryScreen = 'LibraryScreen',
}

export enum ModalScreens {
  Plan = 'Plan',
  Book = 'Book',
}

export type AppScreen =
  | OnBoardingScreens
  | ModalScreens
  | AuthScreens
  | BottomTabsScreens;
