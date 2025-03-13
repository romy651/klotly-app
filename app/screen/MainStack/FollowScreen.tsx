import React, {useEffect, useState} from 'react';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {UserInfo} from 'app/redux/user/userReducer';
import UserItemRow from './Components/UseritemRow';
import {getFollowing, getUserfollowers} from 'app/utils/tools';
import {ActivityIndicator} from 'react-native-paper';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {getUsers} from 'app/actions/chatAction';
import {Screen} from 'app/components/layout/Screen';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {FlashList} from '@shopify/flash-list';
type Props = NativeStackScreenProps<AppStackParamList, Stack.FollowScreen>;

const FollowScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const type = route.params?.type;
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const me = useAppSelector(state => state.user);

  useEffect(() => {
    (async () => {
      let _: UserInfo[] = [];
      if (type === 'followers') {
        _ = await getUserfollowers(route.params.userId as string);
      } else if (type === 'following') {
        _ = await getFollowing(route.params.userId as string);
      } else {
        _ = await getUsers(route.params.userId as string[]);
      }
      setUsers(_.filter(u => u.id !== me.id));
      setLoading(false);
    })();
  }, [me.id, route.params.userId, type]);

  const renderItems = ({item}: {item: UserInfo}) => {
    return <UserItemRow user={item} />;
  };

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });

  return (
    <Screen backgroundColor={'background2'} edges={['top']} flex={1}>
      <ViewHeader
        //@ts-ignore
        title={
          type === 'followers'
            ? t('followers')
            : type === 'following'
            ? t('following')
            : type === 'likes'
            ? t('likes_m')
            : t('list_participants')
        }
        showBackButton
        showBorder
      />
      <Flex px={'spacing10'} backgroundColor={'background0'} flex={1}>
        {loading ? (
          <Flex
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}>
            <ActivityIndicator size={'large'} />
          </Flex>
        ) : (
          <FlashList
            contentContainerStyle={{
              backgroundColor: theme.colors.background0,
            }}
            data={users}
            renderItem={renderItems}
          />
        )}
      </Flex>
    </Screen>
  );
};

export default FollowScreen;
