import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {Text} from '../core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useNavigation} from '@react-navigation/core';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {Flex} from '../layout/Flex';

const CoinIndicator: React.FC = (): JSX.Element => {
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toLocaleUpperCase()] as string;
  const rate = useAppSelector(state => state.application.exchangeRate);

  return (
    <View
      style={{
        ...styles.touchable,
        marginRight: 0,
        backgroundColor: theme.colors.background3,
      }}>
      <Touchable
        background={Touchable.Ripple(theme.colors.background1, true)}
        onPress={() => !me.isTutor && navigation.push('CoinScreen')}
        style={{...styles.btnBack}}>
        <Flex
          gap={'none'}
          paddingHorizontal={'spacing10'}
          flexDirection={'row'}>
          <MatIcon
            color={theme.colors.textPrimary}
            name="wallet-outline"
            size={16}
          />
          <Text
            marginLeft={'spacing8'}
            fontWeight={'bold'}
            color={'textSecondary'}
            variant={'bodySmall'}>
            {Math.floor(me.coins * rate)}
          </Text>
          <Text
            marginLeft={'spacing8'}
            fontWeight={'bold'}
            color={'textSecondary'}
            variant={'bodySmall'}>
            {currency}
          </Text>
        </Flex>
      </Touchable>
    </View>
  );
};

export default CoinIndicator;

const styles = StyleSheet.create({
  touchable: {
    height: 34,
    borderRadius: 45,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
  },
  btnBack: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
    flexDirection: 'row',
  },
  coinbuttom: {
    height: 34,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
