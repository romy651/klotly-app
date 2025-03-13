import {StyleSheet, View} from 'react-native'
import React from 'react'
import {Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import TouchableIcon from '../core/Button/TouchableIcon'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Cover from '.'
import {BookInfo} from 'app/redux/book/bookReducer'
import Image, {Source} from 'react-native-fast-image'

type Props = {
    value?: number
}

const book: BookInfo = {
    id: 'boo',
    title: 'The law of attraction',
    subtitle: 'The Basics of the Teachings of Abraham',
    language: 'en',
    about_the_author:
        'Estger Hicks is an American inspirational speaker and the best-selling author of books such as Money, and the Power of Attraction and The Vortex.',
    text_color: '',
    aubout_the_book:
        'The Law of attraction (2006) shows how you can use a fundamental law of the universe - the law of attraction - to manifestthe life you always wanted.',
    author: 'Esther and Jerry Hicks',
    chapters: [],
    discoverable: true,
    image_url: '',
    main_color: '#95b2ff',
    second_color: '#6c94ff',
    market: 'bestseller',
    published_at: '',
    teaser: '',
    who_should_read: 'People who want to bring their ideal life to reality',
    duration: 12,
    categories: [],
    thematics: [],
}

export default function BlinkOfToday({value}: Props) {
    return (
        <Flex
            borderRadius={'rounded12'}
            height={130}
            mt={'spacing36'}
            mx={'spacing10'}
            p={'spacing16'}
            flexDirection={'row'}
            backgroundColor={'accentActive'}>
            <Flex>
                <Text color={'white'} variant={'subheadLarge'} fontWeight={'bold'}>
                    Free daily summary
                </Text>
                <Flex style={{marginTop: 'auto'}} flexDirection={'row'} alignItems={'center'}>
                    <Text color={'white'} variant={'bodySmall'}>
                        Get it now
                    </Text>
                    <Ionicon name="arrow-forward" color={'white'} size={18} />
                </Flex>
            </Flex>
            <Image source={book.image_url as Source} style={styles.cover} />
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
