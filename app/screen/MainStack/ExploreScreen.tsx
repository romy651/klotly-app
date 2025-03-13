/**
 * @Project Summarised
 * @File HomeScreen.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import * as React from 'react'
import {Screen} from '../../components/layout/Screen'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'
import DynamicHeader from 'app/components/Header/DynamicHeader'
import HomeComponent from '../../components/HomeComponents'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {useTranslation} from 'react-i18next'
import {Text} from 'app/components/core/Text/Text'
import {getCategoriesId, getLatestBook, getTopics, getTrending} from 'app/utils/tools'
import {i18n} from 'app/lang/i18n'

//type Props = NativeStackScreenProps<ExploreStackParamList, ExploreStackScreens.ExploreScreen>

const ExploreScreen: React.FC<any> = ({navigation}): JSX.Element => {
    const {t} = useTranslation()
    let scrollOffsetY = useSharedValue<number>(0)

    const onScroll = useAnimatedScrollHandler(event => {
        scrollOffsetY.value = event.contentOffset.y
    })

    const lang = useAppSelector(state => state.user.languages)[0] as string

    const categories = getCategoriesId(lang)

    return (
        <>
            <Screen edges={['bottom']}>
                <AnimatedFlex backgroundColor="background0" flex={1}>
                    <DynamicHeader animHeaderValue={scrollOffsetY} title={t('explore')} />
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1,
                            marginTop: -15,
                        }}
                        onScroll={onScroll}>
                        <AnimatedFlex left={10}>
                            <Text color="textPrimary" fontWeight="bold" variant="headlineMedium">
                                {t('explore')}
                            </Text>
                            <Flex
                                backgroundColor="accentSuccess"
                                borderBottomColor="accentSuccess"
                                height={5}
                                width={60}
                            />
                        </AnimatedFlex>
                        <HomeComponent
                            list={categories}
                            navigation={navigation}
                            title="Categories"
                            type="Categories"
                        />
                        <Flex height={15} />
                        <HomeComponent
                            list={getLatestBook(i18n.language)}
                            navigation={navigation}
                            subTitle={t('latest_added') as string}
                            title={t('newest')}
                            type="Cover"
                            onMore={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: t('bestsellers'),
                                    list: getLatestBook(i18n.language),
                                    type: 'book',
                                })
                            }
                        />
                        <HomeComponent
                            list={getTrending(i18n.language)}
                            navigation={navigation}
                            subTitle={t('popular_right_now') as string}
                            title={t('trending') as string}
                            type="Cover"
                            onMore={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: t('trending'),
                                    list: getTrending(i18n.language),
                                    type: 'book',
                                })
                            }
                        />
                        <HomeComponent
                            list={getTopics(i18n.language)}
                            navigation={navigation}
                            title={t('collections_for_you')}
                            type="Collection"
                            onMore={(): void =>
                                navigation.push('ListBookScreen', {
                                    title: 'Collections',
                                    list: getTopics(i18n.language),
                                    type: 'collection',
                                })
                            }
                        />
                        <Flex height={80} />
                    </Animated.ScrollView>
                </AnimatedFlex>
            </Screen>
        </>
    )
}

export default ExploreScreen
