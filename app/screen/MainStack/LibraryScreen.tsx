import * as React from 'react'
import {Screen} from '../../components/layout/Screen'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'
import DynamicHeader from 'app/components/Header/DynamicHeader'
import {useTranslation} from 'react-i18next'
import {Text} from 'app/components/core/Text/Text'
import {LibraryStackScreens} from 'app/routes/screens/Stack'
import GroupTitles from 'app/components/LibraryComponents/GroupTitles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HistoryBook from 'app/components/LibraryComponents/HistoryBook'
import {BookInfo} from 'app/redux/book/bookReducer'
import {useAppSelector} from 'app/hooks/state/useAppSelector'

//type Props = NativeStackScreenProps<LibraryStackParamList, LibraryStackScreens.LibraryScreen>

const LibraryScreen: React.FC<any> = ({navigation}): JSX.Element => {
    const {t} = useTranslation()
    let scrollOffsetY = useSharedValue<number>(0)
    const user = useAppSelector(state => state.user)

    const onScroll = useAnimatedScrollHandler(event => {
        scrollOffsetY.value = event.contentOffset.y
    })

    return (
        <>
            <Screen edges={['bottom']}>
                <AnimatedFlex backgroundColor="background0" flex={1}>
                    <DynamicHeader animHeaderValue={scrollOffsetY} title={t('library')} />
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1,
                            marginTop: -15,
                        }}
                        onScroll={onScroll}>
                        <AnimatedFlex left={10}>
                            <Text color="textPrimary" fontWeight="bold" variant="headlineMedium">
                                {t('library')}
                            </Text>
                            <Flex
                                backgroundColor="accentSuccess"
                                borderBottomColor="accentSuccess"
                                height={5}
                                width={60}
                            />
                        </AnimatedFlex>
                        <Flex height={25} />
                        <GroupTitles
                            iconComponent={Ionicons}
                            iconName="bookmark-outline"
                            iconSize={24}
                            subtitle={`${(user.saved_books || []).length} ${t('items')}`}
                            title={t('saved')}
                            onPress={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: t('saved'),
                                    list: user.saved_books,
                                    type: 'historyBook',
                                    withSorting: true,
                                })
                            }
                        />
                        <GroupTitles
                            iconComponent={Ionicons}
                            iconName="checkmark-sharp"
                            iconSize={24}
                            subtitle={`${(user.history || []).length} ${t('items')}`}
                            title={t('finished')}
                            onPress={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: t('finished'),
                                    list: [],
                                    type: 'historyBook',
                                    withSorting: true,
                                })
                            }
                        />
                        <GroupTitles
                            iconComponent={Ionicons}
                            iconName="cloud-download-outline"
                            iconSize={24}
                            subtitle={`${(user.history || []).length} ${t('items')}`}
                            title={t('downloads')}
                            onPress={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: t('downloads'),
                                    list: [],
                                    type: 'historyBook',
                                    withSorting: true,
                                })
                            }
                        />

                        {(user.history || []).length > 0 && (
                            <Flex
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                                mb="spacing10"
                                mt="spacing36"
                                px="spacing10">
                                <Text color="textPrimary" fontWeight="bold" variant="subheadLarge">
                                    {t('my_history')}
                                </Text>
                                <Text
                                    color="accentAction"
                                    variant="bodySmall"
                                    onPress={(): void =>
                                        navigation.push('ListBookScreen', {
                                            title: t('my_history'),
                                            list: [],
                                            type: 'historyBook',
                                            withSorting: true,
                                        })
                                    }>
                                    {t('see_all')}
                                </Text>
                            </Flex>
                        )}

                        {(user.history || []).map((book, id) => (
                            <HistoryBook
                                key={id}
                                author={book?.author}
                                completion={book.completion}
                                duration={book?.duration}
                                image_url={book?.image_url}
                                subtitle={book?.subtitle}
                                title={book?.title}
                                onMore={(): void =>
                                    navigation.push(LibraryStackScreens.BookModalScreen, {
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

                        <Flex height={80} />
                    </Animated.ScrollView>
                </AnimatedFlex>
            </Screen>
        </>
    )
}

export default LibraryScreen
