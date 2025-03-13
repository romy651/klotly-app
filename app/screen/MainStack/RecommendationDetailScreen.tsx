/**
 * @Project Summarised
 * @File HomeScreen.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import * as React from 'react'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {HomeStackParamList} from '../../routes/screens/Screens.types'
import {HomeStackScreens} from '../../routes/screens/Stack'
import {Screen} from '../../components/layout/Screen'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'
import DynamicHeader from 'app/components/Header/DynamicHeader'
import {useTranslation} from 'react-i18next'
import {Text} from 'app/components/core/Text/Text'
import Cover from 'app/components/cover'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'

type Props = NativeStackScreenProps<HomeStackParamList, HomeStackScreens.RecommendationDetailScreen>

const RecommendationDetailScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
    const {t} = useTranslation()
    const {recommendationInfo} = route.params
    let scrollOffsetY = useSharedValue<number>(0)

    const onScroll = useAnimatedScrollHandler(event => {
        scrollOffsetY.value = event.contentOffset.y
    })

    return (
        <>
            <Screen edges={['bottom']}>
                <AnimatedFlex backgroundColor="background0" flex={1} pb="spacing20">
                    <DynamicHeader
                        withReturn
                        animHeaderValue={scrollOffsetY}
                        title={`${t('from')} ${recommendationInfo.author}`}
                    />
                    <Animated.ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1,
                            marginTop: -15,
                            paddingVertical: 15,
                        }}
                        onScroll={onScroll}>
                        <AnimatedFlex left={10} mb="spacing36">
                            <Text
                                color="textPrimary"
                                fontWeight="bold"
                                style={{width: SCREEN_WIDTH - 50}}
                                variant="headlineMedium">
                                {`${t('from')} ${recommendationInfo.author}`}
                            </Text>
                        </AnimatedFlex>
                        {recommendationInfo.books.map((book, idx) => (
                            <Cover
                                key={idx}
                                author={book.author}
                                duration={book.duration}
                                flexDirection="column"
                                image_url={book.image_url}
                                subtitle={book.subtitle}
                                title={book.title}
                                onPress={(): void =>
                                    navigation?.push(HomeStackScreens.BookDetailScreen, {
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

export default RecommendationDetailScreen
