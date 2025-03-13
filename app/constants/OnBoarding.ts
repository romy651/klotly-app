/**
 * @Project Summarised
 * @File OnBoarding.ts
 * @Path app/constants
 * @Author BRICE ZELE
 * @Date 23/03/2023
 */

export type TopicInfo = {
    id: string
    category_ids: string[]
    book_ids: string[]
    i18ns: {id: string; language: string; title: string; description: string}[]
}

export type CategoryInfo = {
    id: string
    priority: number
    color: string
    book_ids: string[]
    i18ns: {id: string; language: string; title: string; subtitle: string}[]
}

export type CategoryParsed = {
    id: string
    color: string
    book_ids: string[]
    title: string
    subtitle: string
}

import {BookInfo} from 'app/redux/book/bookReducer'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export interface IOnBoarding {
    backgroundImg: string
    title: string
    titleAccent: string
}

export type CollectionInfo = {
    id: string
    title: string
    subTitle: string
    image: string
    books: string[]
}

export const booksSample: BookInfo[] = []

export type RecommendationInfo = {
    id: string
    author: string
    books: BookInfo[]
}

export const SlideAnimation1: Array<IOnBoarding> = []

export const SlideAnimation2: Array<IOnBoarding> = []

export const OnBoarding: Array<IOnBoarding> = [
    {
        backgroundImg:
            'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Landing.Title',
        titleAccent: 'Landing.TitleAccent1',
    },
    {
        backgroundImg:
            'https://images.pexels.com/photos/1181368/pexels-photo-1181368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Landing.Title',
        titleAccent: 'Landing.TitleAccent2',
    },
    {
        backgroundImg:
            'https://images.pexels.com/photos/16668443/pexels-photo-16668443/free-photo-of-homme-parc-musique-jeune.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Landing.Title',
        titleAccent: 'Landing.TitleAccent3',
    },
    {
        backgroundImg:
            'https://images.pexels.com/photos/3756858/pexels-photo-3756858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Landing.Title',
        titleAccent: 'Landing.TitleAccent4',
    },
]

export const collection: CollectionInfo[] = []

export const recommendations: RecommendationInfo[] = [
    {
        id: '1',
        author: 'Elon Musk',
        books: booksSample,
    },
    {
        id: '2',
        author: 'Mark Zuckerberg',
        books: booksSample,
    },
    {
        id: '3',
        author: 'Barack Obama',
        books: booksSample,
    },
]

export type ChallengeInfo = {
    id: string
    title: string
    subtitle: string
    logo_component: any
    main_color: string
    logo_name: string
    logo_size: number
    advantages: string[]
    about: string
    books: BookInfo[]
}

export const achievments: ChallengeInfo[] = [
    {
        id: '1',
        title: 'Self-Discovery',
        subtitle: '5-day challenge',
        logo_component: MatComIcon,
        logo_name: 'meditation',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories? Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(50, 199, 180,',
    },
    {
        id: '2',
        title: 'Success',
        subtitle: '7-day challenge',
        logo_component: MatComIcon,
        logo_name: 'trophy-award',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(26, 151, 241,',
    },
    {
        id: '3',
        title: 'Modern Parenting',
        subtitle: '28-day challenge',
        logo_component: MatComIcon,
        logo_name: 'baby-carriage',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(255, 179, 67,',
    },
    {
        id: '4',
        title: 'Wealth',
        subtitle: '22-day challenge',
        logo_component: Ionicon,
        logo_name: 'ios-cash-sharp',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(18, 189, 75,',
    },
    {
        id: '5',
        title: 'Joyful Life',
        subtitle: '18-day challenge',
        logo_component: FontAwesome5,
        logo_name: 'award',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(166, 96, 244,',
    },
    {
        id: '6',
        title: 'Real Man',
        subtitle: '33-day challenge',
        logo_component: MatComIcon,
        logo_name: 'face-man',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(70, 136, 196,',
    },
    {
        id: '7',
        title: 'Empowered Woman',
        subtitle: '33-day challenge',
        logo_component: MatComIcon,
        logo_name: 'face-woman',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(254, 68, 69,',
    },
    {
        id: '8',
        title: 'Sex Life',
        subtitle: '12-day challenge',
        logo_component: FontAwesome5,
        logo_name: 'hand-holding-heart',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(246, 121, 165,',
    },
    {
        id: '9',
        title: 'Emotional Intelligence',
        subtitle: '12-day challenge',
        logo_component: MatComIcon,
        logo_name: 'meditation',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(217, 96, 251,',
    },
    {
        id: '10',
        title: 'Self-Confidence',
        subtitle: '14-day challenge',
        logo_component: MatComIcon,
        logo_name: 'meditation',
        logo_size: 38,
        advantages: [
            'Self-awarness',
            'Cognitive skills',
            'Positive mindset',
            'Relationships',
            'Emotional resilience',
        ],
        about: 'Would you like to improve your life by stacking wins and having personal and practical daily victories?\n Throughout the next 21 days, you will be completing one New challenge each day. The 21 Days of Success Challenge is for you!',
        books: booksSample,
        main_color: 'rgba(228, 43, 222,',
    },
]
