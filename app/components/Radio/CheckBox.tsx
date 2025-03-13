import React, {useState} from 'react';
import {Appearance} from 'react-native';
import {Flex} from '../layout/Flex';
import {theme} from 'app/themes/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Text} from '../core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';

export interface RadioProps {
  labels: string[];
  values: number[];
  defaultSelected: number[];
  onChange?: (selectedValue: number[]) => void;
}
const CheckBox = ({onChange, defaultSelected, labels, values}: RadioProps) => {
  const [selected, setSelected] = useState<number[]>(defaultSelected);
  const isdark = Appearance.getColorScheme() == 'dark';

  const _onChangeSelection = (value: number) => {
    if (include(value)) {
      const res = selected.filter(elt => elt !== value);
      setSelected(res);
      if (onChange) {
        onChange(res);
      }
    } else {
      const res = [...selected, value];
      setSelected(res);
      if (onChange) {
        onChange(res);
      }
    }
  };

  const include = (value: number) => {
    return selected.findIndex(el => el == value) > -1;
  };

  if (labels.length < values.length) {
    return null;
  }
  return (
    <Flex gap={'spacing10'}>
      {values.map((value, index) => (
        <Touchable onPress={_onChangeSelection.bind(null, value)} key={index}>
          <Flex
            borderWidth={1}
            borderColor={include(value) ? 'textSecondary' : 'background3'}
            backgroundColor={include(value) ? 'background2' : 'background1'}
            borderRadius={'rounded8'}
            height={60}
            px={'spacing10'}
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            overflow={'hidden'}
            width={'100%'}>
            <Text variant={'bodySmall'} color={'textPrimary'} numberOfLines={1}>
              {labels[index]}
            </Text>
            {include(value) ? (
              <Ionicon
                name="checkbox"
                color={isdark ? 'white' : theme.colors.textPrimary}
                size={22}
              />
            ) : (
              <Ionicon
                name="square-outline"
                color={theme.colors.textSecondary}
                size={22}
              />
            )}
          </Flex>
        </Touchable>
      ))}
    </Flex>
  );
};

export default CheckBox;
