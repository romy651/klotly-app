import React from 'react';
import {Screen} from 'app/components/layout/Screen';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Text} from 'app/components/core/Text/Text';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  OnBoardingStackParamList,
} from 'app/routes/screens/Screens.types';
import {OnBoardingScreens, Stack} from 'app/routes/screens/Stack';
import {Alert, Linking, StyleSheet} from 'react-native';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {privacyPolicy, termsUse} from 'app/constants';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {logoutUser} from 'app/redux/user/userReducer';
import {cleanRoom} from 'app/redux/room/roomReducer';
import {cleanData} from 'app/redux/config/config.reducer';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {sleep} from 'app/utils/tools';

type Props = NativeStackScreenProps<
  AppStackParamList & OnBoardingStackParamList,
  Stack.SettingScreen
>;

const SettingScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const scrollOffsetY = useSharedValue<number>(0);
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const onScroll = useAnimatedScrollHandler(event => {
    scrollOffsetY.value = event.contentOffset.y;
  });
  const dispatch = useAppDispatch();

  const openLink = async (url: string) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: theme.colors.background3,
          preferredControlTintColor: theme.colors.textSecondary,
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value',
          },
        });
        await sleep(800);
        //Alert.alert(JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const openTermsUse = async () => {
    openLink(termsUse);
  };

  const openPrivacyPolicy = () => {
    openLink(privacyPolicy);
  };

  const onLogOut = () => {
    Alert.alert(t('are_you_sure') as string, '', [
      {
        text: t('cancel') as string,
        style: 'cancel',
      },
      {
        text: t('proceed') as string,
        onPress: () => {
          dispatch(logoutUser());
          dispatch(cleanRoom());
          dispatch(cleanData());
          navigation.replace(Stack.OnBoardingStack, {
            screen: OnBoardingScreens.WelcomeScreen,
          });
        },
      },
    ]);
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <AnimatedFlex flex={1} pb="spacing20">
        <ViewHeader title={t('setting') as string} showBackButton showBorder />
        <Animated.ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          style={{
            flex: 1,
            marginTop: -15,
            paddingVertical: 10,
            backgroundColor: theme.colors.background0,
          }}
          onScroll={onScroll}>
          <Text
            fontWeight="bold"
            mt="spacing14"
            px="spacing10"
            variant="bodyLarge">
            {t('general')}
          </Text>
          <Touchable
            onPress={() => navigation.navigate(Stack.DisplayLanguageScreen)}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <Ionicon
                  color={theme.colors.textSecondary}
                  name="globe-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('display_language')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
          <Touchable
            onPress={() => navigation.navigate(Stack.NotificationScreen)}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <Ionicon
                  color={theme.colors.textSecondary}
                  name="notifications-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('notification')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
          <Touchable
            onPress={() => navigation.navigate(Stack.BlockedUsersScreen)}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <MatComicon
                  color={theme.colors.textSecondary}
                  name="account-cancel-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('blocked_users')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          {/*<Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
                    <Touchable

                        onPress={() => navigation.navigate(Stack.DislikeUsersScreen)}
                        style={styles.item}>
                        <>
                            <Flex flexDirection={'row'}>
                                <MatComicon
                                    color={theme.colors.textSecondary}
                                    name="heart-broken-outline"
                                    size={24}
                                />
                                <Text variant="bodyLarge">{t('disliked_users')}</Text>
                            </Flex>
                            <Ionicon
                                color={theme.colors.textSecondary}
                                name="chevron-forward"
                                size={24}
                            />
                        </>
                    </Touchable>*/}
          <Flex
            backgroundColor="background2"
            height={10}
            width={SCREEN_WIDTH}
          />
          <Text
            fontWeight="bold"
            mt="spacing14"
            px="spacing10"
            variant="bodyLarge">
            {t('about')}
          </Text>
          <Touchable onPress={openTermsUse}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <Ionicon
                  color={theme.colors.textSecondary}
                  name="document-text-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('terms_of_service')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
          <Touchable onPress={openPrivacyPolicy}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <MatComicon
                  color={theme.colors.textSecondary}
                  name="shield-check-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('privacy_policy')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
          <Touchable onPress={() => navigation.navigate(Stack.FeedbackScreen)}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <MatComicon
                  color={theme.colors.textSecondary}
                  name="file-document-edit-outline"
                  size={24}
                />
                <Text variant="bodyLarge">{t('send_feedback')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex
            backgroundColor="background2"
            height={10}
            width={SCREEN_WIDTH}
          />
          <Touchable onPress={() => navigation.navigate(Stack.FeedbackScreen)}>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <AntDesign
                  color={theme.colors.textSecondary}
                  name="customerservice"
                  size={24}
                />
                <Text variant="bodyLarge">{t('customer_service')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          {/*<Flex backgroundColor="background2" height={10} width={SCREEN_WIDTH} />
                    <Touchable  style={styles.item}>
                        <>
                            <Flex flexDirection={'row'}>
                                <AntDesign
                                    color={theme.colors.textSecondary}
                                    name="staro"
                                    size={24}
                                />
                                <Text variant="bodyLarge">{t('email_verification')}</Text>
                            </Flex>
                            <Ionicon
                                color={theme.colors.textSecondary}
                                name="chevron-forward"
                                size={24}
                            />
                        </>
                    </Touchable>*/}
          <Flex
            backgroundColor="background2"
            height={10}
            width={SCREEN_WIDTH}
          />
          <Touchable>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <AntDesign
                  color={theme.colors.textSecondary}
                  name="staro"
                  size={24}
                />
                <Text variant="bodyLarge">{t('rate_us')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex
            backgroundColor="background2"
            height={10}
            width={SCREEN_WIDTH}
          />
          <Touchable>
            <Flex style={styles.item}>
              <Flex flexDirection={'row'}>
                <FontAwesome5Icon
                  color={theme.colors.textSecondary}
                  name="chalkboard-teacher"
                  size={24}
                />
                <Text variant="bodyLarge">{t('become_tutor')}</Text>
              </Flex>
              <Ionicon
                color={theme.colors.textSecondary}
                name="chevron-forward"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex
            backgroundColor="background2"
            height={10}
            width={SCREEN_WIDTH}
          />
          <Touchable onPress={onLogOut}>
            <Flex
              style={{
                paddingVertical: 15,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text color="accentCritical" px="spacing10" variant="bodyLarge">
                {t('sign_out')}
              </Text>
              <MatIcon
                color={theme.colors.accentCritical}
                name="logout"
                size={24}
              />
            </Flex>
          </Touchable>
          <Flex backgroundColor="background2" height={1} width={SCREEN_WIDTH} />
          <Touchable
            onPress={() => navigation.navigate(Stack.DeleteAccountScreen)}>
            <Flex
              style={{
                paddingVertical: 15,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text color="accentCritical" px="spacing10" variant="bodyLarge">
                {t('delete_account')}
              </Text>
              <Feather
                color={theme.colors.accentCritical}
                name="trash-2"
                size={24}
              />
            </Flex>
          </Touchable>
        </Animated.ScrollView>
      </AnimatedFlex>
    </Screen>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
});
