import {View as MView} from 'moti';
import * as React from 'react';
import {Dimensions, View} from 'react-native';

const {width, height} = Dimensions.get('screen');

const SlidingLoading = ({
  size = width * 0.8,
  thumbColor = '#22A7F0',
  trackColor = '#8a8a8a',
}) => {
  const INDICATOR_SIZE = size * 0.4;
  const thumbHeight = 5;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: size,
          height: thumbHeight,
          borderRadius: thumbHeight / 2,
          backgroundColor: trackColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <MView
          from={{
            translateX: -size / 2 - INDICATOR_SIZE / 2 + thumbHeight,
          }}
          animate={{
            translateX: size / 2 + INDICATOR_SIZE / 2 - thumbHeight,
          }}
          transition={{
            type: 'timing',
            duration: 500,
            loop: true,
          }}
          style={{
            position: 'absolute',
            backgroundColor: thumbColor,
            width: INDICATOR_SIZE,
            height: thumbHeight,
            borderRadius: thumbHeight / 2,
          }}
        />
      </View>
    </View>
  );
};

export default SlidingLoading;
