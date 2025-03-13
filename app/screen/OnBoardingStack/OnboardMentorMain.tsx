import {Alert, Appearance, Keyboard, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TutorObj, UserInfo} from 'app/redux/user/userReducer';
import {useUser} from 'app/hooks/useUser';
import {Screen} from 'app/components/layout/Screen';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {theme} from 'app/themes/Theme';
import MainView from 'app/components/MentorOnboard/MainView';
import {AnimatedFlex, Flex} from 'app/components/layout/Flex';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {useTranslation} from 'react-i18next';
import TopicView from 'app/components/MentorOnboard/TopicView';
import SubTopic from 'app/components/MentorOnboard/SubTopicView';
import IntroduceView from 'app/components/MentorOnboard/IntroduceView';
import ExperienceView from 'app/components/MentorOnboard/ExperienceView';
import MotivationView from 'app/components/MentorOnboard/MotivationView';
import HeadlineView from 'app/components/MentorOnboard/HeadlineView';
import VideoView from 'app/components/MentorOnboard/VideoView';
import AvailabilityView from 'app/components/MentorOnboard/AvailabilityView';
import RateView from 'app/components/MentorOnboard/RateView';
import {
  generateAvailabilityIndex,
  uploadImage,
  uploadVideo,
} from 'app/utils/tools';
import LoadingView from 'app/components/MentorOnboard/LoadingView';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.OnboardMentorMain>;

const OnboardMentorMain: React.FC<Props> = ({navigation}): JSX.Element => {
  const {user, updateInfo} = useUser();
  const bioTop = useSharedValue<number>(0);
  //const [height, setHeight] = useState<number>(116);
  const [currentPage, setCurrentPage] = useState<number>(user.tutorObj ? 1 : 0);
  const [direrction, setDirection] = useState<'left' | 'right'>('right');
  const indiWidh = SCREEN_WIDTH * 0.6;
  const indiSize = useSharedValue<number>(0);
  //const [mentorObjet, setMentorObject] = useState<UserInfo>({...user})
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const [topic, setTopic] = useState<string>(user.tutorObj?.topic || '');
  const [subTopics, setSubTopic] = useState<string[]>(
    user.tutorObj?.subTopics || [],
  );
  const [descriptionDesc, setIn] = useState<string>(
    user.tutorObj?.descriptionDesc || '',
  );
  const [experienceDesc, setExpDesc] = useState<string>(
    user.tutorObj?.experienceDesc || '',
  );
  const [motivationDesc, setMotDesc] = useState<string>(
    user.tutorObj?.motivationDesc || '',
  );
  const [headline, setHead] = useState<string>(user.tutorObj?.headline || '');
  const [video, setVideo] = useState<string>(user.tutorObj?.video || '');
  const [videoThumb, setThumb] = useState<string>(
    user.tutorObj?.videoThumb || '',
  );
  const [schedule, setAvail] = useState<Record<string, string[]>>(
    user.tutorObj?.schedule || {},
  );
  const [rate, setRate] = useState<number>(user.tutorObj?.rate || 0);
  const isdark = Appearance.getColorScheme() == 'dark';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        bioTop.value = withTiming(-150);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        bioTop.value = withTiming(0);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const animateScroll = (len: number, key?: string, value?: any) => {
    console.log('we scroll now: ', currentPage);
    indiSize.value = withTiming((len * indiWidh) / (allViews.length - 1));
    if (len > currentPage) {
      setDirection('right');
    } else {
      setDirection('left');
    }
    setCurrentPage(len);
  };

  const onSubmit = () => {
    setLoading(true);
    console.log('uploading the video');
    uploadVideo(
      video,
      user.id,
      () => {},
      () => {
        Alert.alert(t('error'), t('error_video_upload') as string, [
          {
            text: t('ok') as string,
            onPress: () => animateScroll(currentPage - 1),
          },
        ]);
        setLoading(false);
      },
      (video, thumbnail) => {
        const tutorObj: TutorObj = {
          topic,
          subTopics,
          descriptionDesc,
          experienceDesc,
          motivationDesc,
          headline,
          video,
          videoThumb: thumbnail,
          schedule,
          rate,
          reviews: [],
          students: [],
          holidayMode: false,
          avail_index: generateAvailabilityIndex(schedule),
        };
        if (videoThumb.length > 0) {
          uploadImage(
            videoThumb as string,
            user.id,
            () => {},
            () => {},
            thumbUri => {
              tutorObj.videoThumb = thumbUri;
              const res: UserInfo = {...user, tutorObj};
              updateInfo(res, () => {
                const routes = [
                  {
                    name: Stack.BottomTabsStack,
                  },
                ];
                navigation.reset({
                  index: 0,
                  routes,
                });
              });
              setLoading(false);
            },
          );
        } else {
          const res: UserInfo = {...user, tutorObj};
          updateInfo(res, () => {
            const routes = [
              {
                name: Stack.BottomTabsStack,
              },
            ];
            navigation.reset({
              index: 0,
              routes,
            });
          });
          setLoading(false);
        }
      },
    );
  };

  const allViews = [
    <MainView direction={direrction} />,
    <TopicView
      value={topic}
      direction={direrction}
      setValue={setTopic}
      onNext={() => animateScroll(currentPage + 1)}
    />,
    <SubTopic
      topic={topic}
      value={subTopics}
      direction={direrction}
      setValue={setSubTopic}
    />,
    <IntroduceView
      value={descriptionDesc}
      setValue={setIn}
      direction={direrction}
    />,
    <ExperienceView
      value={experienceDesc}
      setValue={setExpDesc}
      direction={direrction}
    />,
    <MotivationView
      value={motivationDesc}
      setValue={setMotDesc}
      direction={direrction}
    />,
    <HeadlineView value={headline} setValue={setHead} direction={direrction} />,
    <VideoView
      value={video}
      setValue={setVideo}
      value2={videoThumb}
      setValue2={setThumb}
      direction={direrction}
    />,
    <AvailabilityView
      value={schedule}
      setValue={setAvail}
      direction={direrction}
    />,
    <RateView value={rate} setValue={setRate} direction={direrction} />,
    <LoadingView
      direction={direrction}
      onNext={() => animateScroll(currentPage + 1)}
    />,
  ];

  const activeStyle = useAnimatedStyle(() => {
    return {
      width: indiSize.value,
    };
  });

  const isActiveButton = () => {
    if (loading) {
      return false;
    }
    if (currentPage == 2) {
      return (subTopics || []).length > 0;
    }
    if (currentPage == 3) {
      return descriptionDesc.length > 10;
    }
    if (currentPage == 4) {
      return experienceDesc.length > 10;
    }
    if (currentPage == 5) {
      return motivationDesc.length > 10;
    }
    if (currentPage == 6) {
      return headline.length > 10;
    }
    if (currentPage == 7) {
      return video.length > 0;
    }
    if (currentPage == 9) {
      return rate > 0;
    }
    return true;
  };

  return (
    <Screen edges={['top']} backgroundColor={'background0'}>
      {currentPage > 0 && (
        <Flex
          height={40}
          flexDirection={'row'}
          justifyContent={'center'}
          borderBottomWidth={1}
          borderBottomColor={'background3'}
          alignItems={'center'}>
          <Flex
            position={'absolute'}
            backgroundColor={'background3'}
            overflow={'hidden'}
            style={{...styles.bottomSlide}}>
            <AnimatedFlex
              backgroundColor={'textPrimary'}
              style={[activeStyle, {...styles.activeSlide}]}
            />
          </Flex>
          {currentPage > 1 && currentPage !== 10 && (
            <Flex style={{marginRight: 'auto'}}>
              <TouchableIcon
                Component={Entypo}
                name="chevron-left"
                action={() => animateScroll(currentPage - 1)}
                color={isdark ? 'white' : theme.colors.textPrimary}
                size={24}
              />
            </Flex>
          )}
          {user.tutorObj !== undefined && (
            <Flex style={{marginLeft: 'auto'}}>
              <TouchableIcon
                Component={Ionicon}
                name="close-sharp"
                action={navigation.goBack}
                color={isdark ? 'white' : theme.colors.textPrimary}
                size={24}
              />
            </Flex>
          )}
        </Flex>
      )}
      <Flex style={[styles.body]}>{allViews[currentPage]}</Flex>
      {[0, 2, 3, 4, 5, 6, 7, 8, 9].includes(currentPage) && (
        <Flex
          backgroundColor={'background0'}
          position={'absolute'}
          borderTopColor={'background3'}
          borderTopWidth={1}
          style={{
            paddingBottom: isAndroid ? 10 : insets.bottom,
          }}
          bottom={0}
          paddingVertical={'spacing10'}
          px={'spacing20'}
          width="100%">
          <Button
            loading={loading}
            disabled={!isActiveButton()}
            backgroundColor={'accentAction'}
            emphasis={ButtonEmphasis.Outline}
            size={ButtonSize.Medium}
            style={{borderRadius: 15}}
            onPress={() => {
              if (!isActiveButton()) {
                return;
              }
              animateScroll(currentPage + 1);
              if (currentPage == 9) {
                onSubmit();
              }
            }}>
            {currentPage == 0
              ? t('lets_go')
              : currentPage == 9
              ? t('submit')
              : t('continue')}
          </Button>
        </Flex>
      )}
    </Screen>
  );
};

export default OnboardMentorMain;

const styles = StyleSheet.create({
  bodyItem: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    height: SCREEN_HEIGHT,
    flexDirection: 'row',
  },
  touchableIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'absolute',
    top: 15,
    left: 15,
  },
  activeSlide: {
    height: '100%',
  },
  bottomSlide: {
    width: SCREEN_WIDTH * 0.6,
    height: 5,
    borderRadius: 50,
  },
});
