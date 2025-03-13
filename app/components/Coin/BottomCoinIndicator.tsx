import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../core/Text/Text';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useNavigation} from '@react-navigation/core';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from '../layout/Flex';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {isAndroid} from 'app/utils/PlatformUtils';

const BottomCoinIndicator: React.FC = (): JSX.Element => {
  const theme = useAppTheme();
  const inset = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const me = useAppSelector(state => state.user);
  const rate = useAppSelector(state => state.application.exchangeRate);
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toUpperCase()] as string;
  //@ts-ignore
  const {t} = useTranslation();
  return (
    <Flex
      style={{
        ...styles.touchable,
        backgroundColor: theme.colors.background0,
        borderTopColor: theme.colors.background3,
        paddingBottom: isAndroid ? 10 : inset.bottom,
      }}>
      <Flex
        backgroundColor={'accentActionSoft'}
        paddingLeft={'spacing20'}
        alignItems={'center'}
        flexDirection={'row'}
        overflow={'hidden'}
        ml={'spacing14'}
        borderRadius={'roundedFull'}
        justifyContent={'space-between'}
        width={SCREEN_WIDTH - 28}>
        <Flex flexDirection={'row'}>
          <Text
            color={'textSecondary'}
            fontWeight={'bold'}
            variant={'bodySmall'}>
            {`${currency} ${Math.floor(me.coins * rate)}`}
          </Text>
        </Flex>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.push('CoinScreen')}>
          <Flex
            backgroundColor={'accentAction'}
            height={45}
            borderRadius={'roundedFull'}
            justifyContent={'center'}
            paddingHorizontal={'spacing14'}
            paddingVertical={'spacing4'}>
            <Text color={'white'} fontWeight={'bold'} variant={'bodySmall'}>
              {t('get_more_coins')}
            </Text>
          </Flex>
        </TouchableOpacity>
      </Flex>
    </Flex>
  );
};

export default BottomCoinIndicator;

const styles = StyleSheet.create({
  touchable: {
    borderTopWidth: 1,
    paddingVertical: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 'auto',
    flexDirection: 'row',
  },
  btnBack: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinbuttom: {
    width: 80,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
