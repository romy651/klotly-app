import React, {PropsWithChildren, StrictMode, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, View, useColorScheme} from 'react-native';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {Provider, useDispatch} from 'react-redux';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {ColorsLight} from './themes/Color';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import DynamicThemeProvider from './themes/DynamicThemeProvider';
import NavigationContainer from './navigation/NavigationContainer';
import RootNavigator from './navigation/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme, DefaultTheme} from 'react-native-paper';
import {useAppTheme} from './hooks/theme/useAppTheme';
import {ThemeProp} from 'react-native-paper/src/types';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import i18nBase from 'i18next';
import Toast from 'react-native-toast-message';
import {
  getLanguage,
  getRate,
  getStreamToken,
  registerToken,
} from './utils/tools';
import {
  StreamVideoClient,
  ThemeProvider,
} from '@stream-io/video-react-native-sdk';
import {StreamVideoProvider} from '@stream-io/video-react-bindings';
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import {useAppSelector} from './hooks/state/useAppSelector';
import {countryCurrencyMap} from './constants/currency-map';
import {changeAppLanguage, changeRate} from './redux/config/config.reducer';
import CodePush, {SyncStatusChangedCallback} from 'react-native-code-push';

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

function renderActivityIndicator(): JSX.Element {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={ColorsLight.white} size="large" />
    </View>
  );
}

const apiKey = 'YOUR API KEY';

function App(): JSX.Element {
  const me = store.getState().user;
  const [client, setClient] = useState<StreamVideoClient>();

  const language = store.getState().application.appLanguage;

  const syncWithCodePush: SyncStatusChangedCallback = () => {
    //Alert.alert(status.toString());
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/user.gender.read'],
      webClientId:
        '1050812997025-ll9m44l8avlufve50eg8oh3mv1eigcui.apps.googleusercontent.com',
    });
    //console.log('App THE CURRENT LANGUAGE: ', language)
    i18nBase.changeLanguage(language);
    LocaleConfig.defaultLocale = language;
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    CodePush.sync(
      {
        updateDialog: {
          title: 'New update available',
          mandatoryUpdateMessage: 'Click here to update',
        },
        deploymentKey: 'j0A2pycAUyWAnLzevWPpP-X294my6kKQEhwq8',
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      syncWithCodePush,
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (me.id) {
        const user = {
          id: me.id.toString(),
          name: `${me.firstName} ${me.lastName}`,
          image: me.avatar,
        };
        await registerToken(me.id.toString());
        const token = await getStreamToken(me?.id.toString());
        console.log('WE GOT THE TOKEN FOR STREAM: ', token);
        const myClient = new StreamVideoClient({apiKey, user, token});
        setClient(myClient);
      }
    })();
    return () => {
      if (client) {
        (client as StreamVideoClient).disconnectUser();
        setClient(undefined);
      }
    };
  }, []);

  /*
  if (!client && me.id) {
    return (
      <ActivityIndicator
        style={styles.call}
        size="large"
        color={ColorsLight.white}
      />
    );
  }
*/
  return (
    <>
      <StrictMode>
        <ThemeProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <Provider store={store}>
              <PersistGate
                loading={renderActivityIndicator()}
                persistor={persistor}>
                <DynamicThemeProvider>
                  <GestureHandlerRootView style={{flex: 1}}>
                    <StreamVideoProvider client={client as StreamVideoClient}>
                      <NavStack />
                    </StreamVideoProvider>
                  </GestureHandlerRootView>
                </DynamicThemeProvider>
              </PersistGate>
            </Provider>
          </SafeAreaProvider>
        </ThemeProvider>
      </StrictMode>
      <Toast />
    </>
  );
}

const NavStack: React.FC<PropsWithChildren> = ({children}): JSX.Element => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const me = useAppSelector(state => state.user);

  useEffect(() => {
    (async () => {
      if (me.country) {
        //@ts-ignore
        const currency = countryCurrencyMap[me.country.toUpperCase()] as string;
        const rate = await getRate(currency);
        dispatch(changeRate(rate));
      } else {
        const ln = getLanguage() as string;
        dispatch(changeAppLanguage(ln));
      }
    })();
  });

  const paperTheme: ThemeProp =
    colorScheme === 'dark'
      ? {
          dark: true,
          colors: {
            ...DefaultTheme.colors,
            primary: theme.colors.userThemeColor,
            background: theme.colors.background0,
            backdrop: theme.colors.translucentBackgroundBackdrop,
            error: theme.colors.accentCritical,
            accent: theme.colors.accentAction,
          },
        }
      : {
          ...MD3LightTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: theme.colors.userThemeColor,
            background: theme.colors.background0,
            backdrop: theme.colors.translucentBackgroundBackdrop,
            error: theme.colors.accentCritical,
            elevation: {
              level0: '#ffffff',
              level1: '#f5f5f5',
              level2: '#eeeeee',
              level3: '#e0e0e0',
              level4: '#bdbdbd',
              level5: '#9e9e9e',
            },
          },
        };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer onReady={(): void => {}}>
        <StatusBar
          animated
          translucent
          backgroundColor={theme.colors.translucentBackground}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <RootNavigator />
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default CodePush(CODE_PUSH_OPTIONS)(App);
