import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from 'app/components/layout/Flex';
import React, {useCallback} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {UserInfo} from 'app/redux/user/userReducer';
import {Text} from 'app/components/core/Text/Text';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useNavigation} from '@react-navigation/core';
import {LibraryStackScreens} from 'app/routes/screens/Stack';
import ContextMenu from 'react-native-context-menu-view';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Feather from 'react-native-vector-icons/Feather';
import {
  Certificate,
  Education,
  Experience,
} from 'app/routes/screens/Screens.types';
import Maticon from 'react-native-vector-icons/MaterialIcons';

type ResumeTabProps = {
  user: UserInfo;
  me?: boolean;
};

const ResumeTab: React.FC<ResumeTabProps> = ({
  user,
  me = true,
}): JSX.Element => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const theme = useAppTheme();

  const actions = [
    {
      title: t('add_certificate'),
      action: () => {
        navigation.navigate(LibraryStackScreens.AddCertificateScreen, {
          data: undefined,
          onDone: () => {},
        });
      },
    },
    {
      title: t('add_experience'),
      action: () => {
        navigation.navigate(LibraryStackScreens.AddWorkExperienceScreen, {
          data: undefined,
          onDone: () => {},
        });
      },
    },
    {
      title: t('add_education'),
      action: () => {
        navigation.navigate(LibraryStackScreens.AddEducationScreen, {
          data: undefined,
          onDone: () => {},
        });
      },
    },
    {
      title: t('cancel'),
      action: () => {},
      destructive: true,
    },
  ];

  const renderEmtpyGift = useCallback(() => {
    return (
      !me &&
      (user.education || []).length === 0 &&
      (user.certificates || []).length === 0 &&
      (user.experiences || []).length === 0 && (
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          pt={'spacing60'}
          backgroundColor={'background0'}>
          <Entypo
            name={'briefcase'}
            size={50}
            color={theme.colors.textSecondary}
          />
          <Text
            style={{width: (SCREEN_WIDTH * 2.5) / 3}}
            variant={'bodyLarge'}
            textAlign={'center'}
            color={'textSecondary'}>
            {t('user_empty_cv')}.
          </Text>
        </Flex>
      )
    );
  }, []);

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = useCallback(
    ({item}: {item: Education | Experience | Certificate}) => {
      if ((item as Education).school !== undefined) {
        return (
          <Flex
            key={item.uid}
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
        );
      } else if ((item as Experience).companyName !== undefined) {
        return (
          <Flex
            key={item.uid}
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
        );
      } else {
        return (
          <Flex
            key={item.uid}
            borderRadius={'rounded4'}
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
        );
      }
    },
    [],
  );

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

  const edditCV = (title: string) => {
    navigation.navigate(LibraryStackScreens.CVEditScreen, {
      title,
    });
  };

  const renderHeader = useCallback((title: string) => {
    return me ? (
      <Flex
        flexDirection={'row'}
        borderTopWidth={title !== 'education' ? 5 : 0}
        borderTopColor={'background3'}
        marginTop={title !== 'education' ? 'spacing10' : 'spacing1'}
        paddingTop={'spacing10'}
        paddingHorizontal={'spacing10'}
        alignItems={'center'}
        justifyContent={'space-between'}
        backgroundColor={'background0'}>
        <Text
          fontWeight={'bold'}
          variant={'buttonLabelMedium'}
          color={'textPrimary'}>
          {t(title)}
        </Text>
        <Flex gap={'none'} flexDirection={'row'} justifyContent={'center'}>
          <TouchableIcon
            Component={Feather}
            action={() => addCV(title)}
            color={theme.colors.textPrimary}
            name="plus"
            size={22}
          />
          <TouchableIcon
            Component={Feather}
            action={() => edditCV(title)}
            color={theme.colors.textPrimary}
            name="edit-3"
            size={18}
          />
        </Flex>
      </Flex>
    ) : (
      <>
        {title === 'education' && (user.education || []).length > 0 ? (
          <Flex
            flexDirection={'row'}
            borderTopWidth={0}
            borderTopColor={'background3'}
            marginTop={title !== 'education' ? 'spacing10' : 'spacing1'}
            paddingTop={'spacing10'}
            paddingHorizontal={'spacing10'}
            alignItems={'center'}
            justifyContent={'space-between'}
            backgroundColor={'background0'}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelMedium'}
              color={'textPrimary'}>
              {t(title)}
            </Text>
          </Flex>
        ) : title === 'work_experience' &&
          (user.experiences || []).length > 0 ? (
          <Flex
            flexDirection={'row'}
            borderTopWidth={5}
            borderTopColor={'background3'}
            marginTop={'spacing10'}
            paddingTop={'spacing10'}
            paddingHorizontal={'spacing10'}
            alignItems={'center'}
            justifyContent={'space-between'}
            backgroundColor={'background0'}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelMedium'}
              color={'textPrimary'}>
              {t(title)}
            </Text>
          </Flex>
        ) : title === 'certifications' &&
          (user.certificates || []).length > 0 ? (
          <Flex
            flexDirection={'row'}
            borderTopWidth={5}
            borderTopColor={'background3'}
            marginTop={'spacing10'}
            paddingTop={'spacing10'}
            paddingHorizontal={'spacing10'}
            alignItems={'center'}
            justifyContent={'space-between'}
            backgroundColor={'background0'}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelMedium'}
              color={'textPrimary'}>
              {t(title)}
            </Text>
          </Flex>
        ) : null}
      </>
    );
  }, []);

  return (
    <Flex>
      <Tabs.SectionList
        sections={[
          {title: 'education', data: user.education || []},
          {title: 'work_experience', data: user.experiences || []},
          {title: 'certifications', data: user.certificates || []},
        ]}
        data={[]}
        ItemSeparatorComponent={() => (
          <Flex
            height={1}
            width={SCREEN_WIDTH - 20}
            marginLeft={'spacing10'}
            backgroundColor={'background3'}
            marginVertical={'spacing14'}
          />
        )}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderItem={renderItem}
        renderSectionHeader={({section: {title, key}}) => renderHeader(title)}
        ListFooterComponent={renderEmtpyGift}
      />
    </Flex>
  );
};

export default ResumeTab;

const styles = StyleSheet.create({
  itemView: {
    width: (SCREEN_WIDTH - 12) / 2,
    height: (2 * SCREEN_WIDTH) / 3,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
});
