import React from 'react';
import {Flex} from '../layout/Flex';
import {Text} from '../core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {StyleSheet} from 'react-native';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';

type Props = {
  title: string;
  subTitle: string;
  logo_component: any;
  main_color: string;
  logo_name: string;
  logo_size: number;
  onPress: () => void;
};

const Achievment = (props: Props): JSX.Element => {
  const theme = useAppTheme();
  return (
    <Flex borderRadius="rounded12" mr="spacing16" overflow="hidden">
      <Touchable
        style={{...styles.touchable, backgroundColor: theme.colors.background3}}
        onPress={props.onPress}>
        <>
          <Flex>
            <Text color="textPrimary" fontWeight="bold" variant="bodySmall">
              {props.title}
            </Text>
            <Text
              color="textPrimary"
              fontWeight="bold"
              style={{color: props.main_color + '1)'}}
              variant="bodySmall">
              {props.subTitle}
            </Text>
          </Flex>
          <props.logo_component
            color={props.main_color + '0.7)'}
            name={props.logo_name}
            size={props.logo_size}
          />
        </>
      </Touchable>
    </Flex>
  );
};

export default Achievment;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 18,
  },
});
