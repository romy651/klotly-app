import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useUser} from 'app/hooks/useUser';
import {
  AppStackParamList,
  Experience,
  LibraryStackParamList,
} from 'app/routes/screens/Screens.types';
import {LibraryStackScreens} from 'app/routes/screens/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Linking} from 'react-native';
import Maticon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';

type Props = NativeStackScreenProps<
  LibraryStackParamList & AppStackParamList,
  LibraryStackScreens.CVEditScreen
>;

const CVEditScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const {title} = route.params;
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const {user} = useUser();
  const list =
    title === 'education'
      ? user.education || []
      : title === 'work_experience'
      ? user.experiences || []
      : user.certificates || [];

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const addCV = (title: string) => {
    if (title === 'education') {
      navigation.navigate(LibraryStackScreens.AddEducationScreen, {
        data: undefined,
        onDone: () => {},
      });
    } else if (title === 'work_experience') {
      navigation.navigate(LibraryStackScreens.AddWorkExperienceScreen, {
        data: undefined,
        onDone: () => {},
      });
    } else if (title === 'certifications') {
      navigation.navigate(LibraryStackScreens.AddCertificateScreen, {
        data: undefined,
        onDone: () => {},
      });
    }
  };

  const editCV = (uid: number) => {
    if (title === 'education') {
      navigation.navigate(LibraryStackScreens.AddEducationScreen, {
        data: (user.education || []).find((item: any) => item.uid === uid),
        onDone: () => {},
      });
    } else if (title === 'work_experience') {
      navigation.navigate(LibraryStackScreens.AddWorkExperienceScreen, {
        data: (user.experiences || []).find((item: any) => item.uid === uid),
        onDone: () => {},
      });
    } else if (title === 'certifications') {
      navigation.navigate(LibraryStackScreens.AddCertificateScreen, {
        data: (user.certificates || []).find((item: any) => item.uid === uid),
        onDone: () => {},
      });
    }
  };

  //@ts-ignore
  const renderItem = ({item, index}) => {
    if (title === 'education') {
      return (
        <Flex key={index} flexDirection={'row'}>
          <Flex
            key={item.uid}
            width={SCREEN_WIDTH - 60}
            gap={'spacing10'}
            paddingHorizontal={'spacing10'}
            borderRadius={'rounded4'}
            justifyContent={'center'}
            borderColor={'violetVibrant'}>
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
                style={{marginTop: 0}}
                variant={'bodyMicro'}
                color={'textSecondary'}>
                {`${(item as any).description || ''}`}
              </Text>
            )}
            {(item as any).verificationUrl && (
              <Text
                style={{marginTop: 0}}
                textDecorationLine={'underline'}
                onPress={openUrl.bind(this, (item as any).verificationUrl)}
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
          <TouchableIcon
            Component={Feather}
            action={() => editCV(item.uid)}
            color={theme.colors.textPrimary}
            name="edit-3"
            size={18}
          />
        </Flex>
      );
    } else if (title === 'work_experience') {
      return (
        <Flex flexDirection={'row'}>
          <Flex
            key={item.uid}
            width={SCREEN_WIDTH - 60}
            paddingHorizontal={'spacing10'}
            borderRadius={'rounded4'}
            gap={'spacing10'}
            marginVertical={'spacing10'}
            borderColor={'violetVibrant'}>
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
              {`${(item as any).companyName} • ${(item as any).location} • ${t(
                (item as any).employmentType,
              )}`}
            </Text>
            {(item as any).description && (
              <Text
                style={{marginTop: 0}}
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
          <TouchableIcon
            Component={Feather}
            action={() => editCV(item.uid)}
            color={theme.colors.textPrimary}
            name="edit-3"
            size={18}
          />
        </Flex>
      );
    } else {
      return (
        <Flex flexDirection={'row'}>
          <Flex
            key={item.uid}
            borderRadius={'rounded4'}
            width={SCREEN_WIDTH - 60}
            marginVertical={'spacing10'}
            paddingHorizontal={'spacing10'}
            justifyContent={'center'}
            borderColor={'violetVibrant'}>
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
              {`${(item as any).name} • ${(item as any).issuingOrganisation}`}
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
                onPress={openUrl.bind(this, (item as any).verificationUrl)}
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
          <TouchableIcon
            Component={Feather}
            action={() => editCV(item.uid)}
            color={theme.colors.textPrimary}
            name="edit-3"
            size={18}
          />
        </Flex>
      );
    }
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        showBackButton
        title={t(title) as string}
        iconList={[
          {
            action: () => addCV(title),
            IconName: 'plus',
            color: theme.colors.textPrimary,
          },
        ]}
      />
      <Flex flex={1} backgroundColor={'background0'}>
        <FlatList
          data={list}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <Flex
              width={SCREEN_WIDTH - 20}
              marginLeft={'spacing10'}
              height={1}
              backgroundColor={'background3'}
              marginVertical={'spacing10'}
            />
          )}
          contentContainerStyle={{paddingTop: 10}}
        />
      </Flex>
    </Screen>
  );
};

export default CVEditScreen;
