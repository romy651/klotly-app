import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {Flex} from '../layout/Flex';

const size = 50;

export const GradientIcon = ({...rest}) => {
  return (
    <Flex
      backgroundColor={'accentSuccess'}
      width={size}
      height={size}
      borderRadius={'roundedFull'}
      {...rest}>
      <MaskedView
        style={{
          flex: 1,
          flexDirection: 'row',
          height: size,
          width: size,
          backgroundColor: 'green',
        }}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="videocam"
              size={size}
              color="white"
              style={styles.shadow}
            />
          </View>
        }>
        <LinearGradient
          colors={['#F7C650', 'rgba(247, 198, 80, 0.71)']}
          style={{flex: 1}}
        />
      </MaskedView>
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {},
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
});
