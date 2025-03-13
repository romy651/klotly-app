import React, {useCallback} from 'react';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  Experience,
} from '../../routes/screens/Screens.types';
import {Stack} from '../../routes/screens/Stack';
import {useTranslation} from 'react-i18next';
import Animated from 'react-native-reanimated';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useDispatch} from 'react-redux';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {Linking} from 'react-native';
import Maticon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import firestore from '@react-native-firebase/firestore';
import {updateUserSuccess} from 'app/redux/user/userReducer';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.ResumeScreen>;

const ResumeScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const {user, isNew} = route.params;
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const me = useAppSelector(state => state.user);

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const updateFavTutor = async () => {
    const db = firestore();
    if ((me.favoriteTutors || []).includes(user.id)) {
      const temp = (me.favoriteTutors || []).filter(t => t !== user.id);
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    } else {
      const temp = [...(me.favoriteTutors || []), user.id];
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    }
  };

  const headerActions = [
    {
      IconName: 'share-variant-outline',
      color: theme.colors.textSecondary,
      action: () => {},
      size: 20,
    },
    {
      IconName: (me.favoriteTutors || []).includes(user.id)
        ? 'bookmark'
        : 'bookmark-outline',
      color: theme.colors.textSecondary,
      action: updateFavTutor,
      size: 24,
    },
  ];

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        justifyContent={'space-evenly'}
        flexDirection={'row'}
        width="100%">
        <Touchable>
          <Flex
            width={45}
            height={45}
            borderRadius={'rounded8'}
            borderWidth={3}
            alignItems={'center'}
            justifyContent={'center'}
            borderColor={'background3'}>
            <MatComIcon
              name="comment-text-outline"
              color={theme.colors.textSecondary}
              size={24}
            />
          </Flex>
        </Touchable>
        <Flex width={SCREEN_WIDTH - 45 - 30 - 20}>
          <Button
            backgroundColor={'accentActive'}
            emphasis={ButtonEmphasis.Background}
            size={ButtonSize.Medium}
            style={{borderRadius: 10}}
            onPress={() => {}}>
            {isNew ? t('buy_trial_lesson') : t('buy_lesson')}
          </Button>
        </Flex>
      </Flex>
    ),
    [isNew, t, theme.colors.textSecondary, insets.bottom],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('my_cv') as string}
        showBackButton
        showBorder
        iconList={headerActions}
      />
      <Flex flex={1} backgroundColor={'background0'}>
        <Animated.ScrollView
          bounces
          contentContainerStyle={{
            width: SCREEN_WIDTH,
            paddingBottom: inset.bottom + 80,
          }}>
          {(user.education || []).length > 0 && (
            <Flex
              borderBottomWidth={3}
              borderBottomColor={'background3'}
              px={'spacing10'}
              gap={'none'}>
              <Text
                pt={'spacing14'}
                pb={'spacing6'}
                variant={'buttonLabelLarge'}
                color={'textPrimary'}>
                {t('education')}
              </Text>
              {user.education?.map((item, index) => (
                <Flex
                  key={index}
                  borderBottomWidth={
                    index === (user.education || []).length - 1 ? 0 : 1
                  }
                  borderBottomColor={'background3'}
                  paddingVertical={'spacing10'}
                  gap={'spacing10'}
                  borderRadius={'rounded4'}
                  justifyContent={'center'}>
                  <Text variant={'bodyMicro'} color={'textSecondary'}>
                    {`${getYear((item as any).startDate)} - ${getYear(
                      (item as any).endDate,
                    )}`}
                  </Text>
                  <Text
                    style={{marginTop: -10}}
                    variant={'subheadSmall'}
                    color={'textPrimary'}>
                    {`${(item as any).school}`}
                  </Text>
                  <Text
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {`${(item as any).degree}`}
                  </Text>
                  {(item as any).description && (
                    <Text
                      style={{marginTop: -5}}
                      variant={'bodyMicro'}
                      color={'textSecondary'}>
                      {`${(item as any).description || ''}`}
                    </Text>
                  )}
                  {(item as any).verificationUrl && (
                    <Text
                      style={{marginTop: 0}}
                      textDecorationLine={'underline'}
                      onPress={openUrl.bind(
                        this,
                        (item as any).verificationUrl,
                      )}
                      variant={'bodyMicro'}
                      color={'accentAction'}>
                      {`${(item as any).description || ''}`}
                    </Text>
                  )}
                  {(item as any).verified && (
                    <Flex
                      style={{marginTop: -5}}
                      gap={'spacing4'}
                      flexDirection={'row'}
                      alignItems={'center'}>
                      <Maticon
                        name="verified"
                        color={theme.colors.accentSuccess}
                        size={14}
                      />
                      <Text color={'accentSuccess'} variant={'bodyMicro'}>
                        {t('verified')}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Flex>
          )}
          {(user.experiences || []).length > 0 && (
            <Flex
              borderBottomWidth={2}
              borderBottomColor={'background3'}
              px={'spacing10'}
              gap={'none'}>
              <Text
                pt={'spacing14'}
                pb={'spacing6'}
                variant={'buttonLabelLarge'}
                color={'textPrimary'}>
                {t('work_experience')}
              </Text>
              {user.experiences?.map((item, index) => (
                <Flex
                  key={index}
                  borderBottomWidth={
                    index == (user.education || []).length - 1 ? 0 : 1
                  }
                  borderBottomColor={'background3'}
                  paddingVertical={'spacing10'}
                  gap={'spacing10'}
                  borderRadius={'rounded4'}
                  justifyContent={'center'}>
                  <Text
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textSecondary'}>
                    {`${getYear((item as any).startDate)} - ${
                      (item as Experience).stillWorking
                        ? t('present')
                        : getYear((item as any).endDate)
                    }`}
                  </Text>
                  <Text
                    style={{marginTop: -10}}
                    variant={'subheadSmall'}
                    color={'textPrimary'}>
                    {`${(item as any).title}`}
                  </Text>
                  <Text
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textPrimary'}>
                    {`${(item as any).companyName} • ${
                      (item as any).location
                    } • ${t((item as any).employmentType)}`}
                  </Text>
                  {(item as any).description && (
                    <Text
                      style={{marginTop: -5}}
                      variant={'bodyMicro'}
                      color={'textSecondary'}>
                      {`${(item as any).description || ''}`}
                    </Text>
                  )}
                  {(item as any).verified && (
                    <Flex
                      style={{marginTop: -5}}
                      gap={'spacing4'}
                      flexDirection={'row'}
                      alignItems={'center'}>
                      <Maticon
                        name="verified"
                        color={theme.colors.accentSuccess}
                        size={14}
                      />
                      <Text color={'accentSuccess'} variant={'bodyMicro'}>
                        {t('verified')}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Flex>
          )}
          {(user.certificates || []).length > 0 && (
            <Flex px={'spacing10'} gap={'none'}>
              <Text
                pt={'spacing14'}
                pb={'spacing6'}
                variant={'buttonLabelLarge'}
                color={'textPrimary'}>
                {t('certifications')}
              </Text>
              {user.certificates?.map((item, index) => (
                <Flex
                  key={index}
                  borderBottomWidth={
                    index == (user.education || []).length - 1 ? 0 : 1
                  }
                  borderBottomColor={'background3'}
                  pt={'spacing20'}
                  pb={'spacing10'}
                  gap={'spacing10'}
                  borderRadius={'rounded4'}
                  justifyContent={'center'}>
                  <Text
                    style={{marginTop: -10}}
                    variant={'bodyMicro'}
                    color={'textSecondary'}>
                    {`${getYear((item as any).issueDate)}`}
                  </Text>
                  <Text
                    style={{marginTop: -10}}
                    variant={'subheadSmall'}
                    color={'textPrimary'}>
                    {`${(item as any).name} • ${
                      (item as any).issuingOrganisation
                    }`}
                  </Text>
                  {(item as any).description && (
                    <Text
                      style={{marginTop: -5}}
                      variant={'bodyMicro'}
                      color={'textSecondary'}>
                      {`${(item as any).description || ''}`}
                    </Text>
                  )}
                  {(item as any).verificationUrl && (
                    <Text
                      style={{marginTop: 0}}
                      textDecorationLine={'underline'}
                      onPress={openUrl.bind(
                        this,
                        (item as any).verificationUrl,
                      )}
                      variant={'bodyMicro'}
                      color={'accentAction'}>
                      {`${(item as any).description || ''}`} hello here
                    </Text>
                  )}
                  {(item as any).verified && (
                    <Flex
                      style={{marginTop: -5}}
                      gap={'spacing4'}
                      flexDirection={'row'}
                      alignItems={'center'}>
                      <Maticon
                        name="verified"
                        color={theme.colors.accentSuccess}
                        size={14}
                      />
                      <Text color={'accentSuccess'} variant={'bodyMicro'}>
                        {t('verified')}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Flex>
          )}
        </Animated.ScrollView>
        {footerComponent()}
      </Flex>
    </Screen>
  );
};

export default ResumeScreen;
