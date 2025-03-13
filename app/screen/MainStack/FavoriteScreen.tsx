import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Text} from 'app/components/core/Text/Text';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {UserInfo} from 'app/redux/user/userReducer';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TutorItem from './Components/TutorItem';
import {FlashList} from '@shopify/flash-list';
import {Stack} from 'app/routes/screens/Stack';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.FavoriteScreen>;

const FavoriteScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const [tutors, setTutors] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useAppTheme();
  const {user} = useAppSelector(state => state);
  //@ts-ignore
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const renderItems = ({item}: {item: UserInfo}) => {
    return <TutorItem user={item} />;
  };

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (user.favoriteTutors.length > 0) {
          const rq = await firestore()
            .collection('users')
            .where('id', 'in', user.favoriteTutors || [])
            .get();
          const data = rq.docs
            .map(_ => _.data() as UserInfo)
            .filter(_ => _.id !== user.id);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setTutors(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.log('ERROR', e);
      }
    })();
  }, [user.favoriteTutors, user.id]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const footerComponent = useCallback(
    () => (
      <Flex
        position={'absolute'}
        bottom={0}
        borderTopWidth={1}
        borderTopColor={'background3'}
        paddingVertical={'spacing10'}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
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
    [onBack, t, inset.bottom],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        showBackButton
        showBorder
        title={t('favorite_tutors') as string}
      />
      {loading && (
        <Flex
          backgroundColor={'background0'}
          flex={1}
          alignItems="center"
          justifyContent="center">
          <CircularActivityIndicator
            size={28}
            color={theme.colors.accentAction}
          />
        </Flex>
      )}
      {tutors.length === 0 && !loading && (
        <Flex backgroundColor={'background0'} flex={1}>
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
          </Flex>
        </Flex>
      )}
      <Flex flex={1} backgroundColor={'background0'}>
        {!loading && tutors.length > 0 && (
          <FlashList
            data={[...tutors]}
            numColumns={1}
            renderItem={renderItems}
            keyExtractor={item => item.id}
          />
        )}
      </Flex>
      {tutors.length === 0 && !loading && footerComponent()}
    </Screen>
  );
};

export default FavoriteScreen;
