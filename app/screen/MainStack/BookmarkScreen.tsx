import {FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'app/routes/screens/Screens.types';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import {UserInfo} from 'app/redux/user/userReducer';
import {Text} from 'app/components/core/Text/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import TutorItem from './Components/TutorItem';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  HomeStackScreens.BookmarkScreen
>;

const BookmarkScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [tutors, setTutors] = useState<UserInfo[]>([]);
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  const inset = useSafeAreaInsets();

  const renderItems = ({item}: {item: UserInfo}) => {
    return <TutorItem user={item} />;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (me.favoriteTutors.length > 0) {
        const rq = await firestore()
          .collection('users')
          .where('id', 'in', me.favoriteTutors)
          .get();
        const data = rq.docs.map(_ => _.data() as UserInfo);
        setTutors(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, [me.favoriteTutors]);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        pt={'spacing10'}
        style={{paddingBottom: inset.bottom, marginBottom: 'auto'}}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Outline}
          size={ButtonSize.Medium}
          style={{borderRadius: 10}}
          onPress={navigation.goBack}>
          {t('find_tutor')}
        </Button>
      </Flex>
    ),
    [inset.bottom, navigation, t],
  );

  return (
    <Screen backgroundColor={'background2'} edges={['bottom', 'top']}>
      <ViewHeader
        title={t('favorite_tutors') as string}
        showBorder
        showBackButton
      />
      {loading ? (
        <Flex
          style={{paddingBottom: insets.bottom}}
          flex={1}
          backgroundColor={'background0'}
          alignItems={'center'}
          justifyContent={'center'}>
          <CircularActivityIndicator
            color={theme.colors.accentActive}
            size={22}
          />
        </Flex>
      ) : tutors.length == 0 ? (
        <Flex
          style={{paddingBottom: insets.bottom}}
          backgroundColor={'background0'}
          alignItems={'center'}
          justifyContent={'center'}>
          <Text variant={'buttonLabelMedium'} color={'textSecondary'}>
            The list is emptys
          </Text>
          {footerComponent()}
        </Flex>
      ) : (
        <FlatList
          data={tutors}
          renderItem={renderItems}
          style={{paddingHorizontal: 10}}
        />
      )}
    </Screen>
  );
};

export default BookmarkScreen;
