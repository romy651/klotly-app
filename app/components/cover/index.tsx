import {StyleSheet} from 'react-native';
import React from 'react';
import {Flex} from '../layout/Flex';
import Image from 'react-native-fast-image';
import {Box} from '../layout/Box';
import {Text} from '../core/Text/Text';
import TouchableIcon from '../core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {theme} from 'app/themes/Theme';
import Animated from 'react-native-reanimated';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type Props = {
  image_url: string;
  title: string;
  author: string;
  subtitle: string;
  duration: number;
  flexDirection: 'column' | 'row';
  onPress?: () => void;
  onBookmark: () => void;
};

const Cover = (book: Props): JSX.Element => {
  const isDarkMode = useDarkMode();
  const {t} = useTranslation();
  const color = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';

  return book.flexDirection === 'row' ? (
    <Touchable
      background={Touchable.Ripple(
        isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        true,
      )}
      style={styles.wrapper}
      onPress={book.onPress}>
      <Flex>
        <Flex
          height={180}
          justifyContent="center"
          mr="spacing10"
          overflow="hidden"
          width={180}>
          <Animated.Image source={{uri: book.image_url}} style={styles.cover} />
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
          <Flex style={styles.icon}>
            <TouchableIcon
              Component={Ionicon}
              action={book.onBookmark}
              color={isDarkMode ? 'rgba(255,255,255, 0.5)' : 'rgba(0,0,0,0.5)'}
              name="ios-bookmark-outline"
              size={22}
            />
          </Flex>
        </Box>
        <Text
          color="textPrimary"
          fontWeight="bold"
          numberOfLines={1}
          style={{width: 120, marginTop: -15}}
          variant="bodyMicro">
          {book.author}
        </Text>
        <Text
          color="textPrimary"
          numberOfLines={2}
          style={{width: 200, marginTop: -15, paddingRight: 20}}
          variant="bodySmall">
          {book.subtitle}
        </Text>
        <Flex
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          <Flex
            alignItems="center"
            borderRadius="rounded4"
            flexDirection="row"
            gap="none"
            px="spacing6"
            py="spacing4"
            style={{backgroundColor: 'rgba(125, 179, 126, 0.5)'}}>
            <SimpleLineIcon
              color={theme.colors.textPrimary}
              name="earphones"
              size={16}
            />
            <Text
              color="textPrimary"
              fontWeight="bold"
              ml="spacing4"
              variant="bodyMicro">
              {t('audio')}
            </Text>
          </Flex>
          <Text
            color="userThemeSlate"
            fontWeight="bold"
            mr="spacing36"
            variant="bodyMicro">
            {book.duration}
            {t('min')}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  ) : (
    <Touchable
      style={{...styles.wrapperColumn, borderBottomColor: color}}
      onPress={book.onPress}>
      <Flex flexDirection="row">
        <Image source={{uri: book.image_url}} style={styles.coverColumn} />
        <Flex>
          <Text
            color="textPrimary"
            fontWeight="bold"
            numberOfLines={2}
            style={styles.titleColumn}
            variant="bodyLarge">
            {book.title}
          </Text>
          <Text
            color="textPrimary"
            fontWeight="bold"
            style={{width: SCREEN_WIDTH - 100, marginTop: -15}}
            variant="bodyMicro">
            {book.author}
          </Text>
          <Text
            color="textPrimary"
            numberOfLines={2}
            style={{width: SCREEN_WIDTH - 100, marginTop: -5, paddingRight: 20}}
            variant="bodySmall">
            {book.subtitle}
          </Text>
          <Flex
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            style={{marginTop: -10}}
            width={100}>
            <Flex
              alignItems="center"
              borderRadius="rounded4"
              flexDirection="row"
              gap="none"
              px="spacing6"
              py="spacing4"
              style={{backgroundColor: 'rgba(125, 179, 126, 0.5)'}}>
              <SimpleLineIcon
                color={theme.colors.textPrimary}
                name="earphones"
                size={16}
              />
              <Text
                color="textPrimary"
                fontWeight="bold"
                ml="spacing4"
                variant="bodyMicro">
                {t('audio')}
              </Text>
            </Flex>
            <Text
              color="userThemeSlate"
              fontWeight="bold"
              mr="spacing36"
              variant="bodyMicro">
              {book.duration}
              {t('min')}
            </Text>
          </Flex>
        </Flex>
        <Flex style={{...styles.icon, marginTop: 0}}>
          <TouchableIcon
            Component={Ionicon}
            action={book.onBookmark}
            color={isDarkMode ? 'rgba(255,255,255, 0.5)' : 'rgba(0,0,0,0.5)'}
            name="ios-bookmark-outline"
            size={22}
          />
        </Flex>
      </Flex>
    </Touchable>
  );
};

export default Cover;

const styles = StyleSheet.create({
  cover: {
    borderRadius: 5,
    height: 115 * 1.4816,
    marginVertical: 10,
    width: 115,
  },
  coverColumn: {
    borderRadius: 5,
    height: 60 * 1.4816,
    width: 60,
  },
  icon: {
    marginTop: -12,
    position: 'absolute',
    right: 0,
  },
  title: {
    marginTop: -10,
    paddingRight: 20,
    width: 150,
  },
  titleColumn: {
    paddingRight: 20,
    width: SCREEN_WIDTH - 100,
  },
  wrapper: {
    borderRadius: 10,
    marginRight: 16,
    overflow: 'hidden',
    padding: 7,
    width: 180,
  },
  wrapperColumn: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: '100%',
  },
});
