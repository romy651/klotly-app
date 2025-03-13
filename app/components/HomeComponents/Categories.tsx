import React from 'react';
import {Flex} from '../layout/Flex';
import {Text} from '../core/Text/Text';
import {StyleSheet} from 'react-native';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {ICategory} from 'app/domain/interface/IThematic';

type Props = ICategory & {onPress: () => void};

const Categories = (props: Props): JSX.Element => {
  return (
    <Flex
      backgroundColor="background3"
      borderRadius="rounded4"
      flexDirection="row"
      mr="spacing18"
      overflow="hidden"
      width={220}>
      <Touchable style={styles.touchable} onPress={props.onPress}>
        <>
          <Flex
            height="100%"
            left={0}
            position="absolute"
            style={{backgroundColor: props.color + '1)'}}
            width={5}
          />
          <Text
            ml="spacing12"
            mr="spacing10"
            my="spacing10"
            variant="bodySmall">
            {props.title}
          </Text>
        </>
      </Touchable>
    </Flex>
  );
};

export default Categories;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
});
