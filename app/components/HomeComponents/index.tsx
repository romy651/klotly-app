import React from 'react';
import {Flex} from '../layout/Flex';
import {Text} from '../core/Text/Text';
import Cover from '../cover';
import {BookInfo} from 'app/redux/book/bookReducer';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ChallengeInfo,
  CollectionInfo,
  RecommendationInfo,
} from 'app/constants/OnBoarding';
import {useTranslation} from 'react-i18next';
import {Collection} from './Collection';
import {Recommend} from './Recommend';
import Achievment from './Achievment';
import {ICategory, ITopic} from 'app/domain/interface/IThematic';
import Categories from './Categories';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {StyleSheet} from 'react-native';
import {bookmarkBook} from 'app/redux/user/userReducer';
import {useAppDispatch} from 'app/hooks/state/useAppDispatch';

type Props = {
  title: string;
  subTitle?: string;
  type:
    | 'Cover'
    | 'Collection'
    | 'Text'
    | 'Recommend'
    | 'Achievments'
    | 'Categories'
    | 'Topics';
  list:
    | BookInfo[]
    | CollectionInfo[]
    | string[]
    | RecommendationInfo[]
    | ChallengeInfo[]
    | ICategory[]
    | ITopic[];
  onMore?: () => void;
  navigation?: any;
};

const HomeComponent = ({
  title,
  subTitle,
  type,
  list,
  onMore,
  navigation,
}: Props): JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const onBookmark = (book: BookInfo): void => {
    dispatch(bookmarkBook(book));
  };

  return (
    <Flex borderRadius="rounded12" mt="spacing36" width="100%">
      <Flex flexDirection="row" justifyContent="space-between" px="spacing10">
        <Flex>
          <Text color="textPrimary" fontWeight="bold" variant="subheadLarge">
            {title}
          </Text>
          {subTitle && (
            <Text
              color="textPrimary"
              style={{marginTop: -13}}
              variant="subheadSmall">
              {t(subTitle)}
            </Text>
          )}
        </Flex>
        {onMore && (
          <Text
            color="accentAction"
            fontWeight="bold"
            variant="bodySmall"
            onPress={onMore}>
            {t('more')}
          </Text>
        )}
      </Flex>
      <ScrollView
        horizontal
        contentContainerStyle={{paddingHorizontal: 10}}
        showsHorizontalScrollIndicator={false}>
        {type === 'Text' &&
          (list as string[]).map((elt, idx) => (
            <Flex
              key={idx}
              backgroundColor="background3"
              mr="spacing10"
              overflow="hidden">
              <Touchable style={styles.touchable}>
                <Text variant="bodySmall">{t(elt)}</Text>
              </Touchable>
            </Flex>
          ))}
        {type === 'Topics' &&
          (list as ITopic[]).map((elt, idx) => (
            <Flex
              key={idx}
              backgroundColor="background3"
              mr="spacing10"
              overflow="hidden">
              <Touchable style={styles.touchable}>
                <Text variant="bodySmall">{t(elt.title)}</Text>
              </Touchable>
            </Flex>
          ))}
        {type === 'Cover' &&
          (list as BookInfo[]).map(elt => (
            <Cover
              key={elt.id}
              author={elt.author}
              duration={elt.duration}
              flexDirection="row"
              image_url={elt.image_url}
              subtitle={elt.subtitle}
              title={elt.title}
              onBookmark={(): void => onBookmark(elt)}
              onPress={(): void =>
                navigation?.push(HomeStackScreens.BookDetailScreen, {
                  bookInfo: elt,
                })
              }
            />
          ))}
        {type === 'Collection' &&
          (list as CollectionInfo[]).map((elt, idx) => (
            <Collection
              key={idx}
              flexDirection="row"
              image={elt.image}
              items={elt.books.length}
              subTitle={elt.subTitle}
              title={elt.title}
              onPress={(): void =>
                navigation?.push(HomeStackScreens.CollectionDetailScreen, {
                  collectionInfo: elt,
                })
              }
            />
          ))}
        {type === 'Recommend' &&
          (list as RecommendationInfo[]).map((elt, idx) => (
            <Recommend
              key={idx}
              image={elt.books.map((v: any) => v.image_url)}
              items={elt.books.length}
              keyIdeas={4}
              title={elt.author}
              onPress={(): void =>
                navigation?.push(HomeStackScreens.RecommendationDetailScreen, {
                  recommendationInfo: elt,
                })
              }
            />
          ))}
        {type === 'Achievments' &&
          (list as ChallengeInfo[]).map((elt, idx) => (
            <Achievment
              key={idx}
              logo_component={elt.logo_component}
              logo_name={elt.logo_name}
              logo_size={elt.logo_size}
              main_color={elt.main_color}
              subTitle={elt.subtitle}
              title={elt.title}
              onPress={(): void =>
                navigation?.push(HomeStackScreens.ChallengeDetailScreen, {
                  challengeInfo: elt,
                })
              }
            />
          ))}
        {type === 'Categories' &&
          Array.from({length: 9}, (v, k) => k + 1).map((elt, idx) => (
            <Flex key={idx}>
              <Categories
                key={list[(elt - 1) * 3]?.id}
                color={list[(elt - 1) * 3]?.color as string}
                id={list[(elt - 1) * 3]?.id}
                title={t(list[(elt - 1) * 3]?.title as string)}
                onPress={(): void =>
                  navigation?.push(HomeStackScreens.CategoryScreen, {
                    category: list[(elt - 1) * 3],
                  })
                }
              />
              <Categories
                key={list[(elt - 1) * 3 + 1]?.id}
                color={list[(elt - 1) * 3 + 1]?.color as string}
                id={list[(elt - 1) * 3 + 1]?.id}
                title={t(list[(elt - 1) * 3 + 1]?.title as string)}
                onPress={(): void =>
                  navigation?.push(HomeStackScreens.CategoryScreen, {
                    category: list[(elt - 1) * 3 + 1],
                  })
                }
              />
              <Categories
                key={list[(elt - 1) * 3 + 2]?.id}
                color={list[(elt - 1) * 3 + 2]?.color as string}
                id={list[(elt - 1) * 3 + 2]?.id}
                title={t(list[(elt - 1) * 3 + 2]?.title as string)}
                onPress={(): void =>
                  navigation?.push(HomeStackScreens.CategoryScreen, {
                    category: list[(elt - 1) * 3 + 2],
                  })
                }
              />
            </Flex>
          ))}
      </ScrollView>
    </Flex>
  );
};

export default HomeComponent;

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
