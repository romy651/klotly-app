import React, {useCallback, useMemo, useRef} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useAppTheme} from '../hooks/theme/useAppTheme';
import LandingScreen from '../screen/OnBoardingStack/LandingScreen';
import {HeaderTitleProps} from '@react-navigation/elements';
import OnboardingHeader from '../screen/OnBoardingStack/components/OnboardingHeader';
import {
  AppStackParamList,
  BottomTabsStackParamList,
  CallStackParamList,
  ChatStackParamList,
  FilterStackParamList,
  HomeStackParamList,
  LibraryStackParamList,
  ModalStackParamList,
  OnBoardingStackParamList,
  VideoStackParamList,
} from '../routes/screens/Screens.types';
import {
  BottomTabsScreens,
  CallStackScreens,
  ChatStackScreens,
  FilterStackScreens,
  HomeStackScreens,
  LibraryStackScreens,
  OnBoardingScreens,
  Stack,
  VideoStackScreens,
} from '../routes/screens/Stack';
//import SignInScreen from '../screen/AuthStack/SignInScreen'
import EmailSignUpScreen from '../screen/OnBoardingStack/EmailSignUpScreen';
import HomeScreen from '../screen/MainStack/HomeScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from 'app/screen/AuthStack/SignUpScreen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SearchScreen from 'app/screen/MainStack/SearchScreen';
import LanguagesScreen from 'app/screen/AuthStack/LanguagesScreen';
import UploadImageScreen from 'app/screen/AuthStack/UploadImageScreen';
import UpdateProfile from 'app/screen/AuthStack/UpdateProfile';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import FilterScreen from 'app/screen/MainStack/FilterScreen';
import {NavigationContainer} from '@react-navigation/native';
import {Flex} from 'app/components/layout/Flex';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {Platform, StyleSheet} from 'react-native';
import SearchCountryScreen from 'app/screen/MainStack/CountrySearchScreen';
import SelectLanguageScreen from 'app/screen/MainStack/SelectLanguageScreen';
import ProfileScreen from 'app/screen/MainStack/ProfileScreen';
import ReportScreen from 'app/screen/MainStack/ReportScreen';
import GalleryScreen from 'app/screen/MainStack/GalleryScreen';
import StoryScreen from 'app/screen/MainStack/StoryScreen';
import ChatScreen from 'app/screen/MainStack/ChatScreen';
import DirectScreen from 'app/screen/MainStack/DirectScreen';
import AccountScreen from 'app/screen/MainStack/AccountScreen';
import UploadMediaScreen from 'app/screen/MainStack/UploadMediaScreen';
import EditProfileScreen from 'app/screen/MainStack/EditProfileScreen';
import BottomInputValue from 'app/screen/MainStack/BottomInputValue';
import HomeLanguageScreen from 'app/screen/MainStack/HomeLanguageScreen';
import SettingScreen from 'app/screen/MainStack/SettingScreen';
import DisplayLanguageScreen from 'app/screen/SettingStack/DisplayLanguageScreen';
import NotificationScreen from 'app/screen/SettingStack/NotificationScreen';
import BlockedUsersScreen from 'app/screen/SettingStack/BlockedUsersScreen';
import DislikeUsersScreen from 'app/screen/SettingStack/DisLikedUserScreen';
import FeedbackScreen from 'app/screen/SettingStack/FeedbackScreen';
import EmailVerificationScreen from 'app/screen/SettingStack/EmailVerificationScreen';
import VideoCallHomeScreen from 'app/screen/MainStack/VideoCallHomeScreen';
import PlanScreen from 'app/screen/MainStack/PlanScreen';
import CoinScreen from 'app/screen/MainStack/CoinScreen';
import NoticeScreen from 'app/screen/MainStack/NoticeScreen';
import GiftScreen from 'app/screen/MainStack/GiftScreen';
import {useRooms} from 'app/actions/roomAction';
import FollowScreen from 'app/screen/MainStack/FollowScreen';
import OngoingCallScreen from 'app/screen/MainStack/OnGoingCallScreen';
import CommunityScreen from 'app/screen/MainStack/CommunityScreen';
import {useTranslation} from 'react-i18next';
import UserProfileScreen from 'app/screen/MainStack/UserProfileScreen';
import UploadProfileScreen from 'app/screen/AuthStack/UploadProfileScreen';
import AddCertificateScreen from 'app/screen/AccountStack/AddCertificateScreen';
import AddEducationScreen from 'app/screen/AccountStack/AddEducationScreen';
import AddWorkExperience from 'app/screen/AccountStack/AddWorkExperienceScreen';
import SelectVariantScreen from 'app/screen/MainStack/SelectVariantScreen';
import CVEditScreen from 'app/screen/AccountStack/CVEditScreen';
import BookingScreen from 'app/screen/MainStack/BookingScreen';
import BookingConfirmationScreen from 'app/screen/MainStack/BookingConfirmScreen';
import AddLocationScreen from 'app/screen/MainStack/AddLocationScreen';
import AgendaScreen from 'app/screen/MainStack/AgendaScreen';
import AppointmentScreen from 'app/screen/MainStack/AppoitmentScreen';
import RescheduleScreen from 'app/screen/MainStack/RescheduleScreen';
import ScheduleDateScreen from 'app/screen/MainStack/ScheduleDateScreen';
import BookingMenuScreen from 'app/screen/MainStack/BookingMenuScreen';
import OnboardMentorMain from 'app/screen/OnBoardingStack/OnboardMentorMain';
import ChooseTopicScreen from 'app/screen/OnBoardingStack/ChooseTopicScreen';
import ChooseSubTopicScreen from 'app/screen/OnBoardingStack/ChooseSubTopicScreen';
import HomeSignInScreen from 'app/screen/OnBoardingStack/HomeSignInScreen';
import HomeSignUpScreen from 'app/screen/OnBoardingStack/HomeSignUpScreen';
import SignInScreen from 'app/screen/AuthStack/SignInScreen';
import AddPhotoScreen from 'app/screen/AuthStack/AddPhotoScreen';
import ForgotPasswordScreen from 'app/screen/AuthStack/ForgotPasswordScreen';
import BookmarkScreen from 'app/screen/MainStack/BookmarkScreen';
import SortScreen from 'app/screen/MainStack/SortScreen';
import SelectTopicScreen from 'app/screen/MainStack/SelectTopicScreen';
import SelectSubTopicScreen from 'app/screen/MainStack/SelectSubTopicScreen';
import ResumeScreen from 'app/screen/MainStack/ResumeScreen';
import LeaveFeedbackScreen from 'app/screen/MainStack/LeaveReviewScreen';
import ReviewScreen from 'app/screen/MainStack/ReviewScreen';
import RescheduleConfirmed from 'app/screen/MainStack/RescheduleConfirmed';
import CancelationConfirmed from 'app/screen/MainStack/CancelationConfirmed';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteScreen from 'app/screen/MainStack/FavoriteScreen';
import CreatePostScreen from 'app/screen/MainStack/CreatePostScreen';
import CommentSheetScreen from 'app/screen/MainStack/CommentSheetScreen';
import PostsScreen from 'app/screen/MainStack/PostsScreen';
import DeleteAccount from 'app/screen/MainStack/DeleteAccount';
import ScanQRCodeScreen from 'app/screen/MainStack/ScanQRCodeScreen';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import TabBarComponent from './TabBarComponent';
//import OutGoingCall from 'app/screen/MainStack/OutgoingCall'

const AppStack = createNativeStackNavigator<
  AppStackParamList & ModalStackParamList
>();
const OnBoardingStack = createNativeStackNavigator<OnBoardingStackParamList>();
//const MainStack = createNativeStackNavigator<BottomTabsStackParamList>()
const BottomTabStack =
  createMaterialBottomTabNavigator<BottomTabsStackParamList>();

const BottomTabStackIOS = createBottomTabNavigator<BottomTabsStackParamList>();

const renderHeaderTitle = (props: HeaderTitleProps): JSX.Element => (
  <OnboardingHeader {...props} />
);

export const OnBoardingStackNavigator: React.FC = (): JSX.Element => {
  const theme = useAppTheme();

  return (
    <OnBoardingStack.Navigator
      initialRouteName={OnBoardingScreens.LandingScreen}
      screenOptions={{
        headerTitle: renderHeaderTitle,
        headerBackTitle: '',
        //headerStatusBarHeight: insets.top + theme.spacing.spacing8,
        headerTransparent: true,
        headerTintColor: theme.colors.textPrimary,
        headerShown: false,
        //headerLeftContainerStyle: {paddingLeft: theme.spacing.spacing16},
        //headerRightContainerStyle: {paddingRight: theme.spacing.spacing24},
      }}>
      <OnBoardingStack.Screen
        component={LandingScreen}
        name={OnBoardingScreens.LandingScreen}
        options={{headerShown: false}}
      />
      {/*<OnBoardingStack.Screen
                component={LandingScreen}
                name={OnBoardingScreens.LandingScreen}
                options={{headerShown: false}}
            />*/}
      <OnBoardingStack.Screen
        component={EmailSignUpScreen}
        name={OnBoardingScreens.EmailSignUpScreen}
        options={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />
      <OnBoardingStack.Screen
        component={SignInScreen}
        name={OnBoardingScreens.SignInScreen}
      />
      <OnBoardingStack.Screen
        component={SignUpScreen}
        name={OnBoardingScreens.SignUpScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <OnBoardingStack.Screen
        component={UpdateProfile}
        name={OnBoardingScreens.UpdateProfile}
        options={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />
      <OnBoardingStack.Screen
        component={LanguagesScreen}
        name={OnBoardingScreens.LanguagesScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />
      <OnBoardingStack.Screen
        component={ChooseTopicScreen}
        name={OnBoardingScreens.ChooseTopicScreen}
      />
      <OnBoardingStack.Screen
        component={ChooseSubTopicScreen}
        name={OnBoardingScreens.ChooseSubTopicScreen}
      />
      <OnBoardingStack.Screen
        component={HomeSignInScreen}
        name={OnBoardingScreens.HomeSignInScreen}
      />
      <OnBoardingStack.Screen
        component={HomeSignUpScreen}
        name={OnBoardingScreens.HomeSignUpScreen}
      />
      <OnBoardingStack.Screen
        component={AddPhotoScreen}
        name={OnBoardingScreens.AddPhotoScreen}
      />
      <OnBoardingStack.Screen
        component={ForgotPasswordScreen}
        name={OnBoardingScreens.ForgotPassword}
      />
    </OnBoardingStack.Navigator>
  );
};

export const AuthStackNavigator: React.FC = (): JSX.Element => {
  return <></>;
};

const MyComponent = ({
  descriptors,
  insets,
  navigation,
  state,
}: BottomTabBarProps) => (
  <TabBarComponent
    descriptors={descriptors}
    insets={insets}
    navigation={navigation}
    state={state}
  />
);

export const BottomTabsStackNavigator: React.FC = (): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {unreadCount} = useRooms();
  const u_count = unreadCount();
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const me = useAppSelector(state => state.user);

  return Platform.OS === 'android' ? (
    <BottomTabStack.Navigator
      barStyle={{
        backgroundColor: theme.colors.background1,
        borderTopWidth: 1,
        borderTopColor: theme.colors.background3,
      }}
      safeAreaInsets={insets}
      activeColor={theme.colors.textPrimary}
      inactiveColor={theme.colors.textSecondary}
      activeIndicatorStyle={{backgroundColor: theme.colors.background3}}
      screenOptions={{}}>
      {!me.isTutor && (
        <BottomTabStack.Screen
          component={HomeStackNavigator}
          name={BottomTabsScreens.HomeStack}
          options={{
            title: t('search') as string,
            tabBarIcon: ({color}) => (
              <MatComIcon color={color} name="text-search" size={24} />
            ),
          }}
        />
      )}
      <BottomTabStack.Screen
        component={CallStackNavigator}
        name={BottomTabsScreens.ExploreScreen}
        options={{
          title: t('Connect') as string,
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="people-outline" size={28} />
          ),
        }}
      />
      <BottomTabStack.Screen
        component={AgendaScreen}
        name={BottomTabsScreens.AgendaSreen}
        options={{
          title: t('n_schedule') as string,
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="calendar-outline" size={24} />
          ),
        }}
      />
      <BottomTabStack.Screen
        component={ChatStackNavigator}
        name={BottomTabsScreens.DirectStack}
        options={{
          ...(u_count > 0 && {tabBarBadge: u_count}),
          title: 'Chat',
          tabBarIcon: ({color}) => (
            <MatComIcon
              color={color}
              name="message-reply-text-outline"
              size={24}
            />
          ),
        }}
      />
      <BottomTabStack.Screen
        component={LibraryStackNavigator}
        name={BottomTabsScreens.LibraryScreen}
        options={{
          title: 'Library',
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="person-outline" size={24} />
          ),
        }}
      />
    </BottomTabStack.Navigator>
  ) : (
    <BottomTabStackIOS.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'red',
          borderTopWidth: 5,
          borderTopColor: theme.colors.accentCritical,
        },
      }}
      tabBar={MyComponent}>
      <BottomTabStackIOS.Screen
        component={HomeStackNavigator}
        name={BottomTabsScreens.HomeStack}
        options={{
          title: t('search') as string,
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="search" size={24} />
          ),
        }}
      />
      <BottomTabStackIOS.Screen
        component={CallStackNavigator}
        name={BottomTabsScreens.ExploreScreen}
        options={{
          title: t('Connect') as string,
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="people-outline" size={24} />
          ),
        }}
      />
      <BottomTabStackIOS.Screen
        component={AgendaScreen}
        name={BottomTabsScreens.AgendaSreen}
        options={{
          title: t('n_schedule') as string,
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="calendar-outline" size={24} />
          ),
        }}
      />
      <BottomTabStackIOS.Screen
        component={ChatStackNavigator}
        name={BottomTabsScreens.DirectStack}
        options={{
          ...(u_count > 0 && {tabBarBadge: u_count}),
          tabBarBadgeStyle: {width: 50},
          title: 'Chat',
          tabBarIcon: ({color}) => (
            <MatComIcon
              color={color}
              name="message-reply-text-outline"
              size={24}
            />
          ),
        }}
      />
      <BottomTabStackIOS.Screen
        component={LibraryStackNavigator}
        name={BottomTabsScreens.LibraryScreen}
        options={{
          title: 'Library',
          tabBarIcon: ({color}) => (
            <Ionicon color={color} name="person-outline" size={24} />
          ),
        }}
      />
    </BottomTabStackIOS.Navigator>
  );
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = (): JSX.Element => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        component={HomeScreen}
        name={HomeStackScreens.HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        component={SearchScreen}
        name={HomeStackScreens.SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        component={BookmarkScreen}
        name={HomeStackScreens.BookmarkScreen}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

const CallStack = createStackNavigator<CallStackParamList>();

export const CallStackNavigator: React.FC = (): JSX.Element => {
  return (
    <CallStack.Navigator initialRouteName={CallStackScreens.CommunityScreen}>
      <CallStack.Screen
        component={CommunityScreen}
        name={CallStackScreens.CommunityScreen}
        options={{headerShown: false, animationEnabled: true}}
      />
      {/* <CallStack.Screen
                component={CallScreen}
                name={CallStackScreens.CallScreen}
                options={{headerShown: false}}
            />*/}
    </CallStack.Navigator>
  );
};

const ChatStack = createStackNavigator<ChatStackParamList>();

export const ChatStackNavigator: React.FC = (): JSX.Element => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        component={DirectScreen}
        name={ChatStackScreens.DirectScreen}
        options={{headerShown: false}}
      />
    </ChatStack.Navigator>
  );
};

const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryStackNavigator: React.FC = (): JSX.Element => {
  return (
    <LibraryStack.Navigator>
      <LibraryStack.Screen
        component={AccountScreen}
        name={LibraryStackScreens.AccountScreen}
        options={{headerShown: false}}
      />
      <LibraryStack.Screen
        component={EditProfileScreen}
        name={LibraryStackScreens.EditProfileScreen}
        options={{headerShown: false}}
      />
      <LibraryStack.Screen
        component={AddCertificateScreen}
        name={LibraryStackScreens.AddCertificateScreen}
        options={{headerShown: false}}
      />
      <LibraryStack.Screen
        component={AddEducationScreen}
        name={LibraryStackScreens.AddEducationScreen}
        options={{headerShown: false}}
      />
      <LibraryStack.Screen
        component={AddWorkExperience}
        name={LibraryStackScreens.AddWorkExperienceScreen}
        options={{headerShown: false}}
      />
      <LibraryStack.Screen
        component={CVEditScreen}
        name={LibraryStackScreens.CVEditScreen}
        options={{headerShown: false}}
      />
    </LibraryStack.Navigator>
  );
};

const VideoStack = createStackNavigator<VideoStackParamList>();

export const VideoStackNavigator: React.FC = (): JSX.Element => {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen
        component={VideoCallHomeScreen}
        name={VideoStackScreens.VideoCallHomeScreen}
        options={{headerShown: false}}
      />
    </VideoStack.Navigator>
  );
};

const RootNavigator: React.FC = (): JSX.Element => {
  const user = useAppSelector(state => state.user);
  const topic = useAppSelector(state => state.application.topic);
  //console.log('SHOULD CHOOSE TOPICs: ', topic)
  const shouldOnboard = user.isTutor && !user.tutorObj;
  //console.log('NOW HE ONBOARD: ', user.tutorObj);
  if (shouldOnboard) {
    console.log('NOW WE SHOULD ONBOARD');
  }

  return (
    <>
      <AppStack.Navigator
        screenOptions={{
          gestureEnabled: true,
        }}>
        {!user.id ? (
          <AppStack.Screen
            component={OnBoardingStackNavigator}
            name={Stack.OnBoardingStack}
            options={{
              headerShown: false,
            }}
          />
        ) : shouldOnboard ? (
          <AppStack.Screen
            component={OnboardMentorMain}
            name={Stack.OnboardMentorMain}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
        ) : typeof topic === 'undefined' ? (
          <AppStack.Screen
            component={SelectTopicScreen}
            name={Stack.SelectTopic}
            initialParams={{forced: true}}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
        ) : (
          <>
            <AppStack.Screen
              component={BottomTabsStackNavigator}
              name={Stack.BottomTabsStack}
              options={{headerShown: false}}
            />
            <AppStack.Screen
              component={OnboardMentorMain}
              name={Stack.OnboardMentorMain}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
              }}
            />
            <AppStack.Screen
              component={SelectTopicScreen}
              name={Stack.SelectTopic}
              options={{
                animation:
                  Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
                headerShown: false,
              }}
            />
          </>
        )}
        {/*<AppStack.Screen
                    component={OnBoardingStackNavigator}
                    name={Stack.OnBoardingStack}
                    options={{
                        headerShown: false,
                    }}
                />*/}
        <AppStack.Screen
          component={SettingScreen}
          name={Stack.SettingScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={SelectSubTopicScreen}
          name={Stack.SelectSubTopic}
          options={{
            headerShown: false,
            animation: 'ios',
          }}
        />
        <AppStack.Screen
          component={DisplayLanguageScreen}
          name={Stack.DisplayLanguageScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={BlockedUsersScreen}
          name={Stack.BlockedUsersScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={DislikeUsersScreen}
          name={Stack.DislikeUsersScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={EmailVerificationScreen}
          name={Stack.EmailVerificationScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={FeedbackScreen}
          name={Stack.FeedbackScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={FavoriteScreen}
          name={Stack.FavoriteScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={NotificationScreen}
          name={Stack.NotificationScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={PlanScreen}
          name={Stack.PlanScreen}
          options={{
            animation: 'slide_from_right',
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <AppStack.Screen
          component={CoinScreen}
          name={Stack.CoinScreen}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={GiftScreen}
          name={Stack.GiftScreen}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={NoticeScreen}
          name={Stack.NoticeScreen}
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={OngoingCallScreen}
          name={Stack.OngoingCallScreen}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={FollowScreen}
          name={Stack.FollowScreen}
          options={{
            headerShown: false,
            animation: 'ios',
          }}
        />
        <AppStack.Screen
          component={GalleryScreen}
          name={Stack.GalleryScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={UploadImageScreen}
          name={Stack.UploadImageScreen}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={UploadProfileScreen}
          name={Stack.UploadProfileScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={UploadMediaScreen}
          name={Stack.UploadMediaScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />

        <AppStack.Screen
          component={BottomInputValue}
          name={Stack.BottomInputValue}
          options={{headerShown: false, presentation: 'transparentModal'}}
        />
        <AppStack.Screen
          component={StoryScreen}
          name={Stack.StoryScreen}
          options={{
            gestureEnabled: false,
            headerShown: true,
          }}
        />
        <AppStack.Screen
          component={ChatScreen}
          name={Stack.ChatScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
          }}
        />
        <AppStack.Screen
          component={ProfileScreen}
          name={Stack.ProfileScreen}
          options={{headerShown: false}}
        />
        <HomeStack.Screen
          component={ReportScreen}
          name={HomeStackScreens.ReportScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={FilterNavigator}
          name={Stack.FilterNavigation}
          options={{
            animation: 'fade',
            headerShown: false,
            presentation: 'transparentModal',
          }}
        />
        <AppStack.Screen
          component={BookingMenuScreen}
          name={Stack.BookingMenuScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            presentation: 'transparentModal',
          }}
        />
        <AppStack.Screen
          component={HomeLanguageScreen}
          name={Stack.HomeLanguageScreen}
          options={{
            gestureEnabled: true,
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <AppStack.Screen
          component={UserProfileScreen}
          name={Stack.UserProfileScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          component={SelectVariantScreen}
          name={Stack.SelectVariantScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          component={AppointmentScreen}
          name={Stack.AppointmentScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          component={RescheduleScreen}
          name={Stack.RescheduleScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          component={ScheduleDateScreen}
          name={Stack.ScheduleDateScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name={Stack.BookingScreen}
          options={{headerShown: false}}
          component={BookingScreen}
        />
        <AppStack.Screen
          name={Stack.AddLocationScreen}
          options={{headerShown: false}}
          component={AddLocationScreen}
        />
        <AppStack.Screen
          name={Stack.BookingConfirmationScreen}
          options={{headerShown: false}}
          component={BookingConfirmationScreen}
        />
        <AppStack.Screen
          name={Stack.ResumeScreen}
          options={{headerShown: false}}
          component={ResumeScreen}
        />
        <AppStack.Screen
          name={Stack.LeaveFeedbackScreen}
          options={{headerShown: false}}
          component={LeaveFeedbackScreen}
        />
        <AppStack.Screen
          name={Stack.ReviewScreen}
          options={{headerShown: false}}
          component={ReviewScreen}
        />
        <AppStack.Screen
          name={Stack.RescheduleConfirmed}
          options={{headerShown: false}}
          component={RescheduleConfirmed}
        />
        <AppStack.Screen
          name={Stack.CreatePostScreen}
          options={{headerShown: false}}
          component={CreatePostScreen}
        />
        <AppStack.Screen
          name={Stack.CancelationConfirmed}
          options={{headerShown: false}}
          component={CancelationConfirmed}
        />
        <AppStack.Screen
          name={Stack.PostsScreen}
          options={{headerShown: false}}
          component={PostsScreen}
        />
        <AppStack.Screen
          name={Stack.DeleteAccountScreen}
          options={{headerShown: false}}
          component={DeleteAccount}
        />
        <AppStack.Screen
          name={Stack.ScanQRCodeScreen}
          options={{headerShown: false, animation: 'slide_from_bottom'}}
          component={ScanQRCodeScreen}
        />
        <AppStack.Screen
          name={Stack.SortScreen}
          options={{
            gestureEnabled: true,
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
          component={SortScreen}
        />
        <AppStack.Screen
          name={Stack.CommentSheetScreen}
          options={{
            gestureEnabled: true,
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
          component={CommentSheetScreen}
        />
      </AppStack.Navigator>
    </>
  );
};

export default RootNavigator;

const FilterStack = createNativeStackNavigator<FilterStackParamList>();

type FilterProps = NativeStackScreenProps<
  AppStackParamList,
  Stack.FilterNavigation
>;

const FilterNavigator: React.FC<FilterProps> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      animation: 'slide_from_right',
      headerShown: false,

      safeAreaInsets: {top: 0},
      cardStyle: {
        backgroundColor: 'white',
        overflow: 'visible',
      },
    }),
    [],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={styles.backdrop}
        onPress={() => navigation.goBack()}
        disappearsOnIndex={-1}
      />
    ),
    [navigation],
  );

  const screenAOptions = useMemo(() => ({headerLeft: () => null}), []);

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['85%'], []);

  return (
    <Flex padding={'spacing24'} flex={1}>
      <BottomSheet
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        enablePanDownToClose
        onClose={navigation.goBack}
        index={0}
        backgroundStyle={{backgroundColor: theme.colors.background2}}
        handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
        snapPoints={snapPoints}
        animateOnMount={true}>
        <NavigationContainer independent={true}>
          <FilterStack.Navigator screenOptions={screenOptions}>
            <FilterStack.Screen
              name={FilterStackScreens.FilterScreen}
              options={{...screenAOptions}}
              component={FilterScreen}
              initialParams={{
                close: navigation.goBack,
                callback: route.params.callback,
              }}
            />
            <FilterStack.Screen
              name={FilterStackScreens.CountrySearchScreen}
              options={{...screenAOptions}}
              component={SearchCountryScreen}
            />
            <FilterStack.Screen
              name={FilterStackScreens.SelectLanguageScreen}
              options={{...screenAOptions}}
              component={SelectLanguageScreen}
            />
          </FilterStack.Navigator>
        </NavigationContainer>
      </BottomSheet>
    </Flex>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  call: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
