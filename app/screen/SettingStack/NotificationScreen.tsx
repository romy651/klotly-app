import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, Switch} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useUser} from 'app/hooks/useUser';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Checkbox} from 'react-native-paper';

type Props = NativeStackScreenProps<
  AppStackParamList,
  Stack.NotificationScreen
>;

const NotificationScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const {user, updateInfo} = useUser();
  //const me = useAppSelector(state => state.user)
  const notif = user.notifications || {
    directMessages: true,
    newFollowers: true,
    videoCalls: true,
    reminders: true,
    lessonLearning: true,
  };

  const updateNotif = (key: any, value: boolean) => {
    //@ts-ignore
    //updateUserInfo({...me, notifications: {...notif, [key]: value}}, dispatch)
    updateInfo({...user, notifications: {...notif, [key]: value}});
    //dispatch(changeNotification({...notif, [key]: value}))
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('notification_settings') as string}
        showBackButton
        showBorder
      />
      <ScrollView
        style={{backgroundColor: theme.colors.background0}}
        showsVerticalScrollIndicator={false}>
        <Touchable
          onPress={() => updateNotif('newFollowers', !notif?.newFollowers)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('new_followers')}
              </Text>
            </Flex>
            <Switch
              trackColor={{
                false: theme.colors.background2,
                true: theme.colors.accentActiveSoft,
              }}
              thumbColor={
                notif?.newFollowers || true
                  ? theme.colors.accentActive
                  : theme.colors.background2
              }
              ios_backgroundColor={theme.colors.background2}
              value={notif?.newFollowers}
              onValueChange={() =>
                updateNotif('newFollowers', !notif?.newFollowers)
              }
            />
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable
          onPress={() => updateNotif('directMessages', !notif?.directMessages)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('direct_messages')}
              </Text>
            </Flex>
            <Switch
              trackColor={{
                false: theme.colors.background2,
                true: theme.colors.accentActiveSoft,
              }}
              thumbColor={
                notif?.directMessages || true
                  ? theme.colors.accentActive
                  : theme.colors.background2
              }
              ios_backgroundColor={theme.colors.background2}
              value={notif?.directMessages}
              onValueChange={() =>
                updateNotif('directMessages', !notif?.directMessages)
              }
            />
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable
          onPress={() => updateNotif('lessonLearning', !notif?.lessonLearning)}>
          <Flex style={{...styles.touchable_item, alignItems: 'flex-start'}}>
            <Flex>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('lesson_learning')}
              </Text>
              <Text
                style={{width: SCREEN_WIDTH - 90}}
                color={'textSecondary'}
                variant={'bodySmall'}>
                {t('lesson_learning_desc')}
              </Text>
            </Flex>
            <Switch
              trackColor={{
                false: theme.colors.background2,
                true: theme.colors.accentActiveSoft,
              }}
              thumbColor={
                notif?.lessonLearning || true
                  ? theme.colors.accentActive
                  : theme.colors.background2
              }
              ios_backgroundColor={theme.colors.background2}
              value={notif?.lessonLearning}
              onValueChange={() =>
                updateNotif('lessonLearning', !notif?.lessonLearning)
              }
            />
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable
          onPress={() => updateNotif('videoCalls', !notif?.videoCalls)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('video_calls')}
              </Text>
            </Flex>
            <Switch
              trackColor={{
                false: theme.colors.background2,
                true: theme.colors.accentActiveSoft,
              }}
              thumbColor={
                notif?.videoCalls || true
                  ? theme.colors.accentActive
                  : theme.colors.background2
              }
              ios_backgroundColor={theme.colors.background2}
              value={notif?.videoCalls}
              onValueChange={() =>
                updateNotif('videoCalls', !notif?.videoCalls)
              }
            />
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
        <Touchable onPress={() => updateNotif('reminders', !notif?.reminders)}>
          <Flex style={styles.touchable_item}>
            <Flex flexDirection={'row'}>
              <Text color={'textPrimary'} variant="bodyLarge">
                {t('reminders')}
              </Text>
            </Flex>
            <Switch
              trackColor={{
                false: theme.colors.background2,
                true: theme.colors.accentActiveSoft,
              }}
              thumbColor={
                notif?.reminders || true
                  ? theme.colors.accentActive
                  : theme.colors.background2
              }
              ios_backgroundColor={theme.colors.background2}
              value={notif?.reminders}
              onValueChange={() => updateNotif('reminders', !notif?.reminders)}
            />
          </Flex>
        </Touchable>
        <Flex
          marginLeft={'spacing16'}
          backgroundColor="background2"
          height={1}
          width={SCREEN_WIDTH - 10}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 10,
    paddingLeft: 15,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});

export default NotificationScreen;
