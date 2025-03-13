import {StyleSheet} from 'react-native';
import React from 'react';
import {Flex} from '../layout/Flex';
import {Source} from 'react-native-fast-image';
import Image from 'react-native-fast-image';
import {Box} from '../layout/Box';
import {Text} from '../core/Text/Text';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import {useTranslation} from 'react-i18next';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';

type Props = {
  title: string;
  image: string[];
  items: number;
  keyIdeas: number;
  onPress: () => void;
};

export function Recommend(recommend: Props): JSX.Element {
  const isDarkMode = useDarkMode();
  const theme = useAppTheme();
  const {t} = useTranslation();
  return (
    <Flex borderRadius="rounded12" mr="spacing18" overflow="hidden" width={210}>
      <Touchable
        background={Touchable.Ripple(
          isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          true,
        )}
        style={{...styles.wrapper, backgroundColor: theme.colors.background3}}
        onPress={recommend.onPress}>
        <>
          <Flex style={styles.carousselView}>
            <Image
              source={recommend.image[2] as Source}
              style={[styles.cover, {transform: [{scale: 0.7}], right: 10}]}
            />
            <Image
              source={recommend.image[1] as Source}
              style={[styles.cover, {transform: [{scale: 0.85}], right: 30}]}
            />
            <Image
              source={recommend.image[0] as Source}
              style={[styles.cover, {right: 50}]}
            />
          </Flex>
          <Box
            alignItems="flex-start"
            borderStartColor="black"
            flexDirection="row"
            my="spacing14"
            px="spacing6">
            <Text
              color="textPrimary"
              fontWeight="bold"
              numberOfLines={2}
              style={styles.title}
              variant="bodyLarge">
              {t('recommendation_from')} {recommend.title}
            </Text>
          </Box>
          <Flex
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            style={{marginRight: 'auto', marginLeft: 15}}>
            <Flex
              alignItems="center"
              backgroundColor="accentActionSoft"
              borderRadius="rounded16"
              flexDirection="row"
              px="spacing12"
              py="spacing6">
              <Text
                fontWeight="bold"
                style={{color: isDarkMode ? 'white' : '#7a7a7a'}}
                variant="bodyMicro">
                {recommend.items} {t('books')}
              </Text>
            </Flex>
            <Flex
              alignItems="center"
              backgroundColor="accentActionSoft"
              borderRadius="rounded16"
              flexDirection="row"
              px="spacing12"
              py="spacing6">
              <Text
                fontWeight="bold"
                style={{color: isDarkMode ? 'white' : '#7a7a7a'}}
                variant="bodyMicro">
                {recommend.keyIdeas} {t('books')}
              </Text>
            </Flex>
          </Flex>
        </>
      </Touchable>
    </Flex>
  );
}

const styles = StyleSheet.create({
  carousselView: {
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingRight: 0,
    width: 180,
  },
  cover: {
    borderRadius: 5,
    height: 100 * 1.4816,
    marginVertical: 10,
    position: 'absolute',
    width: 100,
  },
  title: {
    marginTop: -10,
    width: 180,
  },
  wrapper: {
    overflow: 'hidden',
    padding: 7,
    paddingBottom: 10,
  },
});
