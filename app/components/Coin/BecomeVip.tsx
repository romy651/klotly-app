import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Flex} from '../layout/Flex';
import {Text} from '../core/Text/Text';
import {useTranslation} from 'react-i18next';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = {
  onPress: () => void;
};

const BecomeVip: React.FC<Props> = ({onPress}): JSX.Element => {
  const {t} = useTranslation();
  return (
    <Touchable onPress={onPress} style={styles.container}>
      <>
        <Flex style={styles.textView} backgroundColor={'accentAction'}>
          <Text
            fontWeight={'bold'}
            variant={'bodyMicro'}
            style={{color: '#fff066'}}>
            {t('become_vip')}
          </Text>
        </Flex>
        <FastImage
          source={require('../../assets/images/vip.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </>
    </Touchable>
  );
};

export default BecomeVip;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textView: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 23,
  },
  image: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
});
