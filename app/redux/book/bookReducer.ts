import {PayloadAction, createSlice} from '@reduxjs/toolkit'
import {Alert} from 'react-native'

export type BookInfo = {
    id: string
    published_at: firestore.Timestamp
    discoverable: boolean
    title: string
    subtitle: string
    author: string
    language: string
    aubout_the_book: string
    teaser: string
    who_should_read: string
    about_the_author: string
    market: string
    main_color: string
    second_color: string
    image_url: string
    thematics?: []
    categories?: string[]
    duration: number
    number_of_chapters?: number
    further_reading_book_ids: string[]
    chapters: {
        id: string
        order_no: number
        order_nr: number
        title: string
        text: string
        mp3: string
        supplement?: string
    }[]
}

const defaultState = {} as BookInfo

export interface ErrorAction {
    type: string
    payload: {
        message: string
    }
}
export interface SuccessAction<T> {
    type: string
    payload: T
}

export const bookActionType = {
    FETCH_BOOK_SUCCESS: 'FETCH_BOOK_SUCCESS',
    FETCH_BOOK_FAILURE: 'FETCH_BOOK_FAILURE',
}

const configSlice = createSlice({
    name: 'user',
    initialState: defaultState,
    reducers: {
        fetch_book_success: (state, action: PayloadAction<BookInfo>) => {
            state = action.payload
        },
        fetch_book_failure: (state, action: PayloadAction<ErrorAction>) => {
            const message = action.payload.payload.message
            Alert.alert('Error', message)
        },
    },
})

export const {fetch_book_failure, fetch_book_success} = configSlice.actions

export const bookReducer = configSlice.reducer
