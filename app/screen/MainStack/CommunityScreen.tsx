import * as React from 'react';
import {
  Platform,
  UIManager,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {
  AppStackParamList,
  CallStackParamList,
} from 'app/routes/screens/Screens.types';
import {CallStackScreens, Stack} from 'app/routes/screens/Stack';
import Feather from 'react-native-vector-icons/Feather';
import {Screen} from 'app/components/layout/Screen';
import ForYouPost from './Components/ForYouPost';
import {isAndroid} from 'app/utils/PlatformUtils';

const Touchable: any = isAndroid ? TouchableNativeFeedback : TouchableOpacity;

type Props = NativeStackScreenProps<
  CallStackParamList & AppStackParamList,
  CallStackScreens.CommunityScreen
>;

const CommunityScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  React.useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const onPressCreatePost = () => {
    navigation.navigate(Stack.CreatePostScreen);
  };

  const postButton = () => {
    return (
      <Touchable
        {...(Platform.OS === 'android'
          ? {
              background: TouchableNativeFeedback.Ripple(
                'rgba(255,255,255,0.3)',
                false,
                65,
              ),
            }
          : {})}
        {...(Platform.OS === 'ios' ? {activeOpacity: 0.9} : {})}
        onPress={onPressCreatePost}>
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          backgroundColor={'accentActive'}
          width={65}
          height={65}
          bottom={20}
          right={20}
          position={'absolute'}
          borderRadius={'roundedFull'}
          overflow={'hidden'}>
          <Feather name={'edit'} size={28} color={'white'} />
        </Flex>
      </Touchable>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader withTopic withNotice showBorder />
      <Flex flex={1} backgroundColor={'background0'}>
        <ForYouPost />
      </Flex>
      {postButton()}
    </Screen>
  );
};

export default CommunityScreen;
