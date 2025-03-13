import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import React from 'react';
import {StyleSheet} from 'react-native';
//import {TouchableNativeFeedback as Touchable} from 'react-native'om 'react-native-platform-touchable';
import {View as MView} from 'moti';
import {Flex} from '../layout/Flex';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {Easing} from 'react-native-reanimated';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = {
  onPress: () => void;
};

const AnimatedButton: React.FC<Props> = ({onPress}): JSX.Element => {
  const theme = useAppTheme();
  return (
    <Touchable onPress={onPress}>
      <MView
        style={[
          styles.dot,
          styles.center,
          {backgroundColor: theme.colors.accentSuccess},
        ]}>
        {[...Array(3).keys()].map(i => (
          <MView
            key={i}
            from={{scale: 1, opacity: 0.5}}
            animate={{scale: 1.8, opacity: 0}}
            transition={{
              loop: true,
              repeatReverse: false,
              duration: 4000,
              delay: i * 800,
              type: 'timing',
              easing: Easing.out(Easing.ease),
            }}
            style={[
              StyleSheet.absoluteFillObject,
              styles.dot,
              {backgroundColor: theme.colors.accentSuccess},
            ]}
          />
        ))}
        <Flex
          width={70}
          height={70}
          borderRadius={'roundedFull'}
          alignItems={'center'}
          justifyContent={'center'}
          backgroundColor={'accentSuccess'}>
          <MatIcon name={'local-phone'} size={34} color={'white'} />
        </Flex>
      </MView>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dot: {
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: 'blue',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
});

export default AnimatedButton;
