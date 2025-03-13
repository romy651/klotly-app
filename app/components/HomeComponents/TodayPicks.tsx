import {StyleSheet, View} from 'react-native'
import React from 'react'
import {Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import Cover from '../cover'
import {BookInfo} from 'app/redux/book/bookReducer'
import Image, {Source} from 'react-native-fast-image'
import {ScrollView} from 'react-native-gesture-handler'
import {SlideAnimation2} from 'app/constants/OnBoarding'

type Props = {}

export default function TodayPicks({}: Props) {
    return (
        <Flex width={'100%'} borderRadius={'rounded12'} mt={'spacing36'}>
            <Flex px={'spacing10'}>
                <Text color={'textPrimary'} variant={'subheadLarge'} fontWeight={'bold'}>
                    Mixed for you
                </Text>
                <Text color={'textPrimary'} variant={'subheadSmall'} style={{marginTop: -13}}>
                    We think you'll like these
                </Text>
            </Flex>
            <ScrollView
                contentContainerStyle={{paddingHorizontal: 10}}
                showsHorizontalScrollIndicator={false}
                horizontal>
                {SlideAnimation2.map((elt, idx) => (
                    <Cover color="#95b2ff" image={elt.backgroundImg as Source} />
                ))}
            </ScrollView>
        </Flex>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: 65,
        height: 65 * 1.4816,
        transform: [{rotate: '10deg'}],
        marginLeft: 'auto',
    },
})

/*
const t = (
    <Flex backgroundColor={'white'}>
        <Flex flexDirection={'row'} alignItems={'center'}>
            <Flex>
                <Text variant={'subheadLarge'} fontWeight={'bold'}>
                    Free Blink of the Day
                </Text>
                <Text variant={'bodySmall'} style={{marginTop: -10}} fontWeight={'400'}>
                    Selected by our curators
                </Text>
            </Flex>
            <Flex position={'absolute'} top={-5} right={0}>
                <TouchableIcon
                    Component={Ionicon}
                    action={() => {
                        console.log('pressed')
                    }}
                    color="userThemeColor"
                    name="notifications-outline"
                    size={28}
                />
            </Flex>
        </Flex>
        <Flex
            style={{backgroundColor: book.second_color, overflow: 'hidden', marginTop: -5}}
            alignItems={'center'}
            borderRadius={'rounded8'}
            justifyContent={'center'}
            py={'spacing4'}>
            <Cover image={book.image_url} color={book.main_color} />
        </Flex>
        <Flex flexDirection={'row'} alignItems={'center'} style={{marginTop: -10}}>
            <Flex>
                <Text variant={'bodyLarge'} style={{fontSize: 18}} fontWeight={'bold'}>
                    Free Blink of the Day
                </Text>
                <Text variant={'bodySmall'} style={{marginTop: -12}}>
                    {book.author}
                </Text>
                <Text variant={'bodySmall'} style={{marginTop: -12}}>
                    {book.subtitle}
                </Text>
            </Flex>
            <Flex position={'absolute'} top={-5} right={0}>
                <TouchableIcon
                    Component={Ionicon}
                    action={() => {
                        console.log('pressed')
                    }}
                    color="userThemeColor"
                    name="share-social"
                    size={28}
                />
            </Flex>
        </Flex>
    </Flex>
)

*/
