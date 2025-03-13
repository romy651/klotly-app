import * as React from 'react';
import {
  Platform,
  UIManager,
  Dimensions,
  Image,
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {CallStackParamList} from 'app/routes/screens/Screens.types';
import {CallStackScreens} from 'app/routes/screens/Stack';
import SegmentedControl from '@react-native-community/segmented-control';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Screen} from 'app/components/layout/Screen';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {TouchableNativeFeedback as Touchable} from 'react-native';
dayjs.extend(relativeTime);

const DATA = [
  {
    key: 0,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'canceled',
    date: '2021-06-17',
  },
  {
    key: 1,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'declined',
    date: '2021-06-17',
  },
  {
    key: 2,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'accepted',
    date: '2021-06-17',
  },
  {
    key: 3,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'accpeted',
    date: '2021-06-17',
  },
  {
    key: 4,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'canceled',
    date: '2021-06-17',
  },
  {
    key: 5,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'declined',
    date: '2021-06-17',
  },
  {
    key: 6,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    type: 'canceled',
    date: '2021-06-17',
  },
  {
    key: 7,
    phone: 73965191,
    name: 'romuald',
    age: 27,
    avatar:
      'https://bigthink.com/wp-content/uploads/2023/08/Jason-Derulo-Profile-01.jpg?w=512&h=512&crop=1',
    missedCall: true,
    type: 'accepted',
    date: '2021-06-17',
  },
];

const SIZE = 36;
const SPACING = 12;
const HEADER_HEIGHT = 60;
const threshold = HEADER_HEIGHT;

type Props = NativeStackScreenProps<
  CallStackParamList,
  CallStackScreens.CallScreen
>;

const CallScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [flatListData, setFlatListData] = React.useState<any>(null);
  const scrollY = useSharedValue<number>(0);
  const {t} = useTranslation();
  const theme = useAppTheme();
  //const scrollY = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  React.useEffect(() => {
    const data =
      selectedIndex === 0
        ? DATA
        : selectedIndex == 1
        ? DATA.filter(x => x.type == 'accepted')
        : DATA.filter(x => x.type == 'canceled');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFlatListData(data);
  }, [selectedIndex]);

  const handler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!flatListData) {
    return <></>;
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <ViewHeader showBorder title={t('call_history')} />
      <View
        style={{
          height: HEADER_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 1,
              opacity: interpolate(
                scrollY.value,
                [-1, 0, threshold, threshold + 1],
                [0, 0, 1, 1],
              ),
            },
          ]}
        />
        <SegmentedControl
          values={[t('all'), t('matches'), t('missed')]}
          style={{width: (2.5 * width) / 3}}
          selectedIndex={selectedIndex}
          onChange={event => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <Animated.FlatList
        data={flatListData}
        extraData={DATA}
        onScroll={handler}
        keyExtractor={item => item.key}
        contentContainerStyle={{
          paddingRight: SPACING,
          paddingLeft: SPACING * 2 + SIZE,
        }}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: SPACING,
                alignItems: 'center',
                paddingBottom: SPACING,
                borderBottomColor: 'rgba(0,0,0,0.1)',
                borderBottomWidth: 1,
              }}>
              <View style={{flex: 0.4, marginLeft: -40}}>
                <MatIcon
                  name={
                    item.type == 'accepted' ? 'videocam' : 'missed-video-call'
                  }
                  size={24}
                  color={
                    item.type === 'canceled'
                      ? theme.colors.userThemeOrange
                      : item.type === 'accepted'
                      ? theme.colors.accentSuccess
                      : theme.colors.userThemeSlate
                  }
                  style={{marginLeft: -SPACING + 10}}
                />
              </View>
              <Image
                source={{uri: item.avatar}}
                style={{
                  width: SIZE,
                  height: SIZE,
                  borderRadius: SIZE,
                  marginLeft: -SIZE - SPACING,
                  marginRight: SPACING,
                }}
              />
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      marginBottom: SPACING / 2,
                      color: item.missedCall ? 'red' : '#222',
                    }}>
                    {item.name}
                    {' • '}
                    {item.age}
                  </Text>
                  <MatIcon
                    selectionColor={'white'}
                    name={'verified'}
                    style={{marginTop: 1, marginLeft: 5}}
                    size={15}
                    color={theme.colors.accentActive}
                  />
                </View>
                <Text style={{fontSize: 12, color: '#333'}}>
                  {item.date}
                  {' • '}
                  {t(item.type)}
                </Text>
              </View>
              <Touchable style={styles.touchableAction}>
                <Flex backgroundColor={'accentSuccess'} style={styles.callView}>
                  <Icon name="videocam" size={18} color="white" />
                </Flex>
              </Touchable>
            </View>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callView: {
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  touchableAction: {},
});

export default CallScreen;
