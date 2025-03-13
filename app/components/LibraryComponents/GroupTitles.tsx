import React from 'react';
import {Flex} from '../layout/Flex';
import {theme} from 'app/themes/Theme';
import {Text} from '../core/Text/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = {
  iconComponent: any;
  iconName: string;
  iconSize: number;
  title: string;
  subtitle: string;
  onPress: () => void;
};
// accentActionSoft

const GroupTitles = (props: Props): JSX.Element => {
  return (
    <Touchable style={{paddingVertical: 7}} onPress={props.onPress}>
      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around"
        px="spacing10"
        width={SCREEN_WIDTH}>
        <Flex
          alignItems="center"
          backgroundColor="accentActionSoft"
          borderRadius="rounded8"
          height={50}
          justifyContent="center"
          width={50}>
          <props.iconComponent
            color={theme.colors.textSecondary}
            name={props.iconName}
            size={props.iconSize}
          />
        </Flex>
        <Flex gap="none" justifyContent="center" style={{marginRight: 'auto'}}>
          <Text color="textPrimary" fontWeight="bold" variant="bodyLarge">
            {props.title}
          </Text>
          <Text color="textPrimary" fontWeight="normal" variant="bodyMicro">
            {props.subtitle}
          </Text>
        </Flex>
        <Ionicons
          color={theme.colors.textSecondary}
          name="chevron-forward"
          size={18}
        />
      </Flex>
    </Touchable>
  );
};

export default GroupTitles;
