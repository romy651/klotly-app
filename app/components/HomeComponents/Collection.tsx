import {StyleSheet} from 'react-native';
import React from 'react';
import {Flex} from '../layout/Flex';
import {Source} from 'react-native-fast-image';
import Image from 'react-native-fast-image';
import {Box} from '../layout/Box';
import {Text} from '../core/Text/Text';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';

type Props = {
  title: string;
  subTitle: string;
  image: string;
  items: number;
  onPress: () => void;
  flexDirection: 'row' | 'column';
};

export function Collection(book: Props): JSX.Element {
  const {t} = useTranslation();
  const isDarkMode = useDarkMode();
  const color = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';

  return book.flexDirection === 'row' ? (
    <Touchable
      background={Touchable.Ripple(
        isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        true,
      )}
      style={styles.wrapper}
      onPress={book.onPress}>
      <Flex width={180}>
        <Flex
          alignItems="center"
          height={180}
          justifyContent="center"
          overflow="hidden"
          width={180}>
          <Animated.Image source={book.image as Source} style={styles.cover} />
        </Flex>
        <Box
          alignItems="flex-start"
          borderStartColor="black"
          flexDirection="row">
          <Text
            color="textPrimary"
            fontWeight="bold"
            numberOfLines={2}
            style={styles.title}
            variant="bodyLarge">
            {book.title}
          </Text>
        </Box>
        <Text
          color="textPrimary"
          numberOfLines={2}
          style={{width: 200, marginTop: -15, paddingRight: 20}}
          variant="bodySmall">
          {book.subTitle}
        </Text>
        <Flex
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          <Flex
            alignItems="center"
            backgroundColor="blue300"
            borderRadius="rounded4"
            flexDirection="row"
            px="spacing6"
            py="spacing4">
            <MatComIcon color="white" name="view-carousel-outline" size={12} />
            <Text color="white" fontWeight="bold" variant="bodyMicro">
              {t('Collection')}
            </Text>
          </Flex>
          <Text
            color="userThemeSlate"
            fontWeight="bold"
            mr="spacing36"
            variant="bodyMicro">
            {book.items}
            {t('books')}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  ) : (
    <Touchable
      background={Touchable.Ripple(
        isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      )}
      style={{...styles.wrapperColumn, borderBottomColor: color}}
      onPress={book.onPress}>
      <Flex flexDirection="row" width={SCREEN_WIDTH}>
        <Flex alignItems="center" justifyContent="center" pl="spacing6">
          <Image source={book.image as Source} style={styles.coverColumn} />
        </Flex>
        <Flex flexGrow={1} justifyContent="center">
          <Text
            color="textPrimary"
            fontWeight="bold"
            numberOfLines={2}
            style={styles.title}
            variant="bodyLarge">
            {book.title}
          </Text>
          <Text
            color="textPrimary"
            numberOfLines={2}
            style={{width: SCREEN_WIDTH - 150}}
            variant="bodySmall">
            {book.subTitle}
          </Text>
          <Flex
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            style={{marginTop: -10}}>
            <Flex
              alignItems="center"
              backgroundColor="blue300"
              borderRadius="rounded4"
              flexDirection="row"
              px="spacing6"
              py="spacing4">
              <MatComIcon
                color="white"
                name="view-carousel-outline"
                size={12}
              />
              <Text color="white" fontWeight="bold" variant="bodyMicro">
                {t('Collection')}
              </Text>
            </Flex>
            <Text
              color="userThemeSlate"
              fontWeight="bold"
              mr="spacing36"
              variant="bodyMicro">
              {`${book.items} ${t('books')}`}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 5,
    height: 180,
    marginVertical: 10,
    width: 180,
  },
  coverColumn: {
    height: 100,
    marginVertical: 10,
    width: 100,
  },
  title: {},
  wrapper: {
    marginRight: 10,
    padding: 10,
  },
  wrapperColumn: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: '100%',
  },
});
