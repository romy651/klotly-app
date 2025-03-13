import {StyleSheet} from 'react-native';
import React from 'react';
import {Flex} from '../layout/Flex';
import Image from 'react-native-fast-image';
import {Text} from '../core/Text/Text';
import TouchableIcon from '../core/Button/TouchableIcon';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import useDarkMode from 'app/hooks/theme/useDarkMode';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {theme} from 'app/themes/Theme';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  image_url: string;
  title: string;
  author: string;
  subtitle: string;
  duration: number;
  onPress?: () => void;
  onMore: () => void;
  completion: number;
};

const HistoryBook = (book: Props): JSX.Element => {
  const isDarkMode = useDarkMode();
  const {t} = useTranslation();
  const color = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  return (
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
          <Flex
            backgroundColor="accentActionSoft"
            borderRadius="rounded12"
            height={4}
            overflow="hidden"
            width="100%">
            <Flex
              backgroundColor="accentSuccess"
              height="100%"
              width={`${book.completion * 100}%`}
            />
          </Flex>
        </Flex>
        <Flex style={{...styles.icon}}>
          <TouchableIcon
            Component={Feather}
            action={book.onMore}
            color={theme.colors.textPrimary}
            name="more-vertical"
            size={22}
          />
        </Flex>
      </Flex>
    </Touchable>
  );
};

export default HistoryBook;

const styles = StyleSheet.create({
  coverColumn: {
    borderRadius: 5,
    height: 60 * 1.4816,
    width: 60,
  },
  icon: {
    bottom: 18,
    marginBottom: -10,
    position: 'absolute',
    right: -10,
  },
  titleColumn: {
    paddingRight: 20,
    width: SCREEN_WIDTH - 100,
  },
  wrapperColumn: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 17,
    width: '100%',
  },
});
