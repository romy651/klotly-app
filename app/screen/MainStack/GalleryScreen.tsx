import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from 'app/components/layout/Screen';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';
import AwesomeGallery, {
  GalleryRef,
  RenderItemInfo,
} from 'react-native-awesome-gallery';
import {useIsFocused} from '@react-navigation/core';
import {Flex} from 'app/components/layout/Flex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AppStackParamList, Stack.GalleryScreen>;

const GalleryScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const params = route.params;
  const gallery = useRef<GalleryRef>(null);

  const [infoVisible, setInfoVisible] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const [mounted, setMounted] = useState<boolean>(false);
  const {top, bottom} = useSafeAreaInsets();

  useEffect(() => {
    StatusBar.setBarStyle(isFocused ? 'light-content' : 'dark-content', true);
    if (!isFocused) {
      StatusBar.setHidden(false, 'fade');
    }
  }, [isFocused]);

  const renderItem = ({item, setImageDimensions}: RenderItemInfo<string>) => {
    return (
      <Animated.Image
        source={{uri: item}}
        style={StyleSheet.absoluteFillObject}
        resizeMode="contain"
        onLoad={e => {
          const {width, height} = e.nativeEvent.source;
          setImageDimensions({width, height});
        }}
        sharedTransitionTag={item}
      />
    );
  };

  const onIndexChange = useCallback(
    (index: number) => {
      isFocused && navigation.setParams({index});
    },
    [isFocused, navigation.setParams],
  );

  const onTap = () => {
    StatusBar.setHidden(infoVisible, 'slide');
    setInfoVisible(!infoVisible);
  };

  return (
    <Screen edges={['top']} flex={1}>
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInUp.duration(250) : undefined}
          exiting={FadeOutUp.duration(250)}
          style={[
            styles.toolbar,
            {
              height: top + 60,
              paddingTop: top,
            },
          ]}>
          <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
            <Text style={styles.headerText}>
              {params.index + 1} of {params.photos.length}
            </Text>
          </Flex>
        </Animated.View>
      )}
      <AwesomeGallery
        ref={gallery}
        data={params.photos}
        style={{marginTop: -top}}
        keyExtractor={item => item}
        renderItem={renderItem}
        initialIndex={params.index}
        numToRender={3}
        doubleTapInterval={150}
        doubleTapScale={2}
        onIndexChange={onIndexChange}
        onSwipeToClose={navigation.goBack}
        onTap={onTap}
        loop
        onScaleEnd={scale => {
          if (scale < 0.8) {
            navigation.goBack();
          }
        }}
      />
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInDown.duration(250) : undefined}
          exiting={FadeOutDown.duration(250)}
          style={[
            styles.toolbar,
            styles.bottomToolBar,
            {
              height: bottom + 100,
              paddingBottom: bottom,
            },
          ]}>
          <Flex style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() =>
                gallery.current?.setIndex(
                  params.index === 0
                    ? params.photos.length - 1
                    : params.index - 1,
                )
              }>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() =>
                gallery.current?.setIndex(
                  params.index === params.photos.length - 1
                    ? 0
                    : params.index + 1,
                  true,
                )
              }>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Flex>
        </Animated.View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomToolBar: {
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  toolbar: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default GalleryScreen;
