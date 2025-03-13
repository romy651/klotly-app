import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import React from 'react';
import {Stack} from 'app/routes/screens/Stack';
import PostTab from './Components/PostTab';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Flex} from 'app/components/layout/Flex';

type Props = NativeStackScreenProps<AppStackParamList, Stack.PostsScreen>;

const PostsScreen: React.FC<Props> = ({route}): JSX.Element => {
  const {userId} = route.params;

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader title={'Posts'} showBorder showBackButton />
      <Flex flex={1} backgroundColor={'background0'}>
        <PostTab userId={userId} />
      </Flex>
    </Screen>
  );
};

export default PostsScreen;
