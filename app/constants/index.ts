import {color} from '@shopify/restyle'

type fImage = {
    uri: string
    title: string
}

export const COIN_RATE = 1

export const forbidenImages: fImage[] = [
    {
        uri: 'https://images.unsplash.com/photo-1535483102974-fa1e64d0ca86?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'nation_flag',
    },
    {
        uri: 'https://media01.stockfood.com/largepreviews/MjEzNTg2OTA=/00688990-A-woman-eating-a-banana.jpg',
        title: 'pornographic',
    },
    {
        uri: 'https://t4.ftcdn.net/jpg/00/44/49/17/360_F_44491798_xk33paRQkFp9WwmiFfJmFq4XdlPi7DFv.jpg',
        title: 'nude',
    },
    {
        uri: 'https://m.media-amazon.com/images/I/51ONn4-bb8L._AC_UF894,1000_QL80_.jpg',
        title: 'arms',
    },
    {
        uri: 'https://static.vecteezy.com/system/resources/previews/024/853/474/original/bloody-hand-blot-vector.jpg',
        title: 'bloody',
    },
]

export const termsUse = 'https://sites.google.com/view/buzzmeet/terms-of-use?authuser=0'

export const privacyPolicy = 'https://sites.google.com/view/buzzmeet/privacy-policy?authuser=0'

export const vipSlides = [
    {
        key: '3571572',
        title: 'montly_coins',
        description: 'montly_coins_desc',
        color: '#A5BBFF',
        image: 'https://cdn-icons-png.flaticon.com/256/3571/3571572.png',
    },
    {
        key: '3571747',
        title: 'no_ads',
        description: 'no_ads_desc',
        color: '#DDBEFE',
        image: 'https://cdn-icons-png.flaticon.com/256/3571/3571747.png',
    },
    {
        key: '3571680',
        title: 'see_who_liked_you',
        description: 'see_who_liked_you_desc',
        color: '#FF63ED',
        image: 'https://cdn-icons-png.flaticon.com/256/3571/3571680.png',
    },
    {
        key: '3571603',
        title: 'get_vip_batch',
        description: 'get_vip_batch_desc',
        color: '#B98EFF',
        image: 'https://cdn-icons-png.flaticon.com/256/3571/3571603.png',
    },
    {
        key: '3571603',
        title: 'switch_locations',
        description: 'switch_locations_desc',
        color: '#B98EFF',
        image: 'https://cdn-icons-png.flaticon.com/256/3571/3571603.png',
    },
]

export type GiftType = {
    id: number
    image: string
    title: string
    price: number
}

export const giftsObjects: GiftType[] = [
    {
        id: 0,
        image: require('../assets/gifts/bouquet.png'),
        title: 'bouquet',
        price: 10,
    },
    {
        id: 1,
        image: require('../assets/gifts/bow.png'),
        title: 'bow',
        price: 30,
    },
    {
        id: 2,
        image: require('../assets/gifts/diamond1.png'),
        title: 'bear_diamond',
        price: 50,
    },
    {
        id: 3,
        image: require('../assets/gifts/drink.png'),
        title: 'drink',
        price: 55,
    },
    {
        id: 4,
        image: require('../assets/gifts/kissing.png'),
        title: 'kiss',
        price: 70,
    },
    {
        id: 5,
        image: require('../assets/gifts/sunflower.png'),
        title: 'sun_flower',
        price: 100,
    },
    {
        id: 6,
        image: require('../assets/gifts/pendant.png'),
        title: 'pendant',
        price: 300,
    },
    {
        id: 7,
        image: require('../assets/gifts/dress.png'),
        title: 'wedding_dress',
        price: 500,
    },
    {
        id: 8,
        image: require('../assets/gifts/wedding-rings.png'),
        title: 'wedding ring',
        price: 1000,
    },
    {
        id: 9,
        image: require('../assets/gifts/diamond-ring.png'),
        title: 'diamond ring',
        price: 2000,
    },
    {
        id: 10,
        image: require('../assets/gifts/diamond.png'),
        title: 'diamond',
        price: 3000,
    },
    {
        id: 11,
        image: require('../assets/gifts/sand-castle.png'),
        title: 'sand_castle',
        price: 5000,
    },
    {
        id: 12,
        image: require('../assets/gifts/crystal-ball.png'),
        title: 'crystal',
        price: 7000,
    },
    {
        id: 13,
        image: require('../assets/gifts/treasure-chest.png'),
        title: 'treasure_chest',
        price: 10000,
    },
    {
        id: 14,
        image: require('../assets/gifts/proposal.png'),
        title: 'proposal',
        price: 15000,
    },
    {
        id: 15,
        image: require('../assets/gifts/crown.png'),
        title: 'crown',
        price: 20000,
    },
]

export const AVAILABLE_TOPICS = {
    languages: [
        'swedish',
        'arabic',
        'basque',
        'bulgarian',
        'catalan',
        'chinese',
        'croatian',
        'czech',
        'dutch',
        'english',
        'french',
        'german',
        'greek',
        'italian',
        'japanese',
        'korean',
        'latin',
        'polish',
        'portuguese',
        'russian',
        'spanish',
        'turkish',
    ],
    health_wellness: [
        'logopedics',
        'fitness',
        'nutrition',
        'medical_sciences',
        'psychology',
        'mental_health',
        'physical_therapy',
        'alternative_medicine',
        'occupational_therapy',
        'massage_therapy',
        'yoga',
    ],
    humanity: [
        'philosophy',
        'law',
        'linguistics',
        'sign_language',
        'religious_studies',
        'cultural_studies',
        'ethics',
        'gender_studies',
        'sociology',
        'anthropology',
        'archaeology',
        'communications',
        'international_relations',
    ],
    art: [
        'singing',
        'guitar',
        'violin',
        'piano',
        'drums',
        'saxophone',
        'music',
        'makeup_artistry',
        'culinary_arts',
        'creative_writing',
        'performing_arts',
        'dance',
        'theater',
        'visual_arts',
        'photography',
        'fashion_design',
    ],
}
