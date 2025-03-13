import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  VideoStackParamList,
} from 'app/routes/screens/Screens.types';
import {Stack, VideoStackScreens} from 'app/routes/screens/Stack';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import VideoAnimation from 'app/components/videoCall/VideoAnimation';
import CoinIndicator from 'app/components/Coin/CoinIndicator';
import FastImage from 'react-native-fast-image';
import BecomeVip from 'app/components/Coin/BecomeVip';
import NotifIndicator from 'app/components/Coin/NotifIndicator';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';
import {updateUserInfo} from 'app/actions/userAction';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {getStreamToken, listenStatus} from 'app/utils/tools';
type Props = NativeStackScreenProps<
  VideoStackParamList & AppStackParamList,
  VideoStackScreens.VideoCallHomeScreen
>;

const VideoCallHomeScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.user);

  useEffect(() => {
    //updateUserInfo(me, dispatch, setLoading)
    //refreshUserInfo(me.id, dispatch)
  }, []);

  useEffect(() => {
    (async () => {
      listenStatus(me?.id as string);
    })();
  }, []);

  return (
    <Screen backgroundColor={'background3'} edges={['top']}>
      <View style={{...styles.headerView}}>
        <BecomeVip onPress={() => navigation.push(Stack.PlanScreen)} />
        <Flex flexDirection={'row'}>
          <CoinIndicator />
          <NotifIndicator />
        </Flex>
      </View>
      {/*<VideoAnimation />*/}
      <View style={{...styles.bottomView}}>
        <FastImage
          source={require('../../assets/images/online_users.png')}
          style={{width: 150, height: 60}}
          resizeMode="contain"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    height: 100,
  },
  loadingFlex: {
    height: SCREEN_HEIGHT - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    width: '100%',
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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

export default VideoCallHomeScreen;
