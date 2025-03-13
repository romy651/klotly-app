import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {} from 'react-native-gesture-handler';
import {Flex, FlexProps} from 'app/components/layout/Flex';
import {TouchableOpacity, TouchableNativeFeedback} from 'react-native';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

type TouchableIconProps = {
  Component: any;
  size: number;
  color: string;
  action: () => void;
  name: string;
  disable?: boolean;
  width?: number;
  height?: number;
  ripColor?: string;
};

const TouchableIcon: React.FC<TouchableIconProps & FlexProps> = ({
  Component,
  size,
  color,
  name,
  action,
  ripColor,
  disable = false,
  height = 40,
  width = 40,
  ...props
}: TouchableIconProps): JSX.Element => {
  return (
    <Flex
      {...props}
      width={width}
      height={height}
      borderRadius={'rounded4'}
      overflow={'hidden'}>
      <Touchable disabled={disable} style={styles.btn} onPress={action}>
        <Flex
          alignItems="center"
          borderRadius="roundedFull"
          height={height}
          justifyContent="center"
          overflow="hidden"
          width={width}>
          <Component
            color={color ? color : disable ? '#828282' : '#7a7a7a'}
            name={name}
            size={size}
          />
        </Flex>
      </Touchable>
    </Flex>
  );
};

export default TouchableIcon;

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
