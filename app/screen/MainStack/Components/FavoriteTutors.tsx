import {Flex} from 'app/components/layout/Flex';
import React, {useCallback, useEffect, useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {UserInfo} from 'app/redux/user/userReducer';
import TutorItem from './TutorItem';
import firestore from '@react-native-firebase/firestore';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import {useUser} from 'app/hooks/useUser';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = {
  onBack: () => void;
};

const FavoriteTutors = ({onBack}: Props): React.JSX.Element => {
  const [tutors, setTutors] = useState<UserInfo[]>([]);
  const {user} = useUser();
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();

  const renderItems = ({item}: {item: UserInfo}) => {
    return <TutorItem user={item} />;
  };

  React.useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const rq = await firestore()
        .collection('users')
        .where('id', 'in', user.favoriteTutors)
        .get();
      const data = rq.docs
        .map(_ => _.data() as UserInfo)
        .filter(_ => _.id !== user.id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTutors(data);
    })();
  }, [user.favoriteTutors, user.id]);

  const footerComponent = useCallback(
    () => (
      <Flex
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        pt={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 10}}
          onPress={onBack}>
          {t('find_tutor')}
        </Button>
      </Flex>
    ),
    [onBack, t, insets.bottom],
  );

  return (
    <Flex style={{marginLeft: 0}} paddingHorizontal={'spacing4'}>
      {tutors.length == 0 ? (
        <Tabs.ScrollView>
          <Flex
            paddingVertical={'spacing16'}
            backgroundColor={'accentSuccessSoft'}
            px={'spacing10'}
            mt={'spacing24'}>
            <Text variant={'buttonLabelMedium'} color={'textPrimary'}>
              {t('bookmark_empty')}
            </Text>
            <Text variant={'buttonLabelSmall'} color={'textSecondary'}>
              {t('bookmark_empty_desc')}
            </Text>
            {footerComponent()}
          </Flex>
        </Tabs.ScrollView>
      ) : (
        <Tabs.FlatList
          data={tutors}
          contentContainerStyle={{paddingBottom: 200}}
          numColumns={1}
          renderItem={renderItems}
          keyExtractor={item => item.id}
        />
      )}
    </Flex>
  );
};

export default FavoriteTutors;
