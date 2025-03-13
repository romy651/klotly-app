/**
 * @Project Summarised
 * @File HomeScreen.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import React, {useState, useEffect} from 'react'
import {Screen} from '../../components/layout/Screen'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'
import DynamicHeader from 'app/components/Header/DynamicHeader'
import {Text} from 'app/components/core/Text/Text'
import Cover from 'app/components/cover'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {BookInfo} from 'app/redux/book/bookReducer'
import {CollectionInfo} from 'app/constants/OnBoarding'
import {Collection} from 'app/components/HomeComponents/Collection'
import HistoryBook from 'app/components/LibraryComponents/HistoryBook'
import {useTranslation} from 'react-i18next'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {theme} from 'app/themes/Theme'
import {useAppDispatch} from 'app/hooks/state/useAppDispatch'
import {bookmarkBook} from 'app/redux/user/userReducer'
import {useAppSelector} from 'app/hooks/state/useAppSelector'

//type Props = NativeStackScreenProps<ExploreStackParamList, ExploreStackScreens.ListBookScreen>

const ListBookScreen: React.FC<any> = ({navigation, route}): JSX.Element => {
    const {t} = useTranslation()
    const {list, title, type, withSorting} = route.params
    let scrollOffsetY = useSharedValue<number>(0)
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    const [_list, setList] = useState<any[]>([])

    useEffect(() => {
        setList(list)
    }, [])

    const onScroll = useAnimatedScrollHandler(event => {
        scrollOffsetY.value = event.contentOffset.y
    })

    const onBookmark = (book: BookInfo): void => {
        dispatch(bookmarkBook(book))
    }

    return (
        <>
            <Screen edges={['bottom']}>
                <AnimatedFlex backgroundColor="background0" flex={1} pb="spacing20">
                    <DynamicHeader
                        withReturn
                        animHeaderValue={scrollOffsetY}
                        title={`${title}`}
                        onGoBack={navigation.goBack}
                    />
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1,
                            marginTop: -15,
                            paddingTop: 15,
                            marginBottom: -20,
                        }}
                        onScroll={onScroll}>
                        <AnimatedFlex left={10} mb="spacing36">
                            <Text
                                color="textPrimary"
                                fontWeight="bold"
                                style={{width: SCREEN_WIDTH - 50}}
                                variant="headlineMedium">
                                {`${title}`}
                            </Text>
                        </AnimatedFlex>
                        {withSorting && (
                            <Flex
                                alignItems="center"
                                backgroundColor="accentActionSoft"
                                flexDirection="row"
                                height={50}
                                px="spacing10"
                                width={SCREEN_WIDTH}>
                                <Text color="textPrimary" fontWeight="bold" variant="bodySmall">{`${
                                    _list.length
                                } ${t('items')}`}</Text>
                                <Flex
                                    alignItems="center"
                                    flexDirection="row"
                                    style={{marginLeft: 'auto'}}>
                                    <Text color="textPrimary" variant="bodySmall">
                                        {t('sort_by')}
                                    </Text>
                                    <Flex alignItems="center" flexDirection="row">
                                        <Text
                                            color="userThemeColor"
                                            fontWeight="bold"
                                            variant="bodySmall"
                                            onPress={(): void =>
                                                navigation.push('SortModalScreen', {
                                                    callBack: () => {},
                                                })
                                            }>
                                            {t('least_progress')}
                                        </Text>
                                        <Ionicon
                                            color={theme.colors.userThemeColor}
                                            name="chevron-down"
                                            size={26}
                                            onPress={(): void =>
                                                navigation.push('SortModalScreen', {
                                                    callBack: () => {},
                                                })
                                            }
                                        />
                                    </Flex>
                                </Flex>
                            </Flex>
                        )}
                        {type === 'historyBook' &&
                            (user.saved_books || []).map((book, idx: number) => (
                                <HistoryBook
                                    key={idx}
                                    author={book.author}
                                    completion={book.completion}
                                    duration={book.duration}
                                    image_url={book.image_url}
                                    subtitle={book.subtitle}
                                    title={book.title}
                                    onMore={(): void =>
                                        navigation.push('BookModalScreen', {
                                            book: book as BookInfo,
                                        })
                                    }
                                    onPress={(): void =>
                                        navigation?.push('BookDetailScreen', {
                                            bookInfo: book,
                                        })
                                    }
                                />
                            ))}
                        {type === 'book' &&
                            _list.map((book: BookInfo, idx: number) => (
                                <Cover
                                    key={idx}
                                    author={book.author}
                                    duration={book.duration}
                                    flexDirection="column"
                                    image_url={book.image_url}
                                    subtitle={book.subtitle}
                                    title={book.title}
                                    onBookmark={(): void => onBookmark(book)}
                                    onPress={(): void =>
                                        navigation?.push('BookDetailScreen', {
                                            bookInfo: book,
                                        })
                                    }
                                />
                            ))}
                        {type === 'collection' &&
                            _list.map((col: CollectionInfo, idx: number) => (
                                <Collection
                                    key={idx}
                                    flexDirection="column"
                                    image={col.image}
                                    items={col.books.length}
                                    subTitle={col.subTitle}
                                    title={col.title}
                                    onPress={(): void =>
                                        navigation?.push('CollectionDetailScreen', {
                                            collectionInfo: col,
                                        })
                                    }
                                />
                            ))}
                        <Flex height={80} />
                    </Animated.ScrollView>
                </AnimatedFlex>
            </Screen>
        </>
    )
}

export default ListBookScreen
