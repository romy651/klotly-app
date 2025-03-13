/**
 * @Project Summarised
 * @File rootReducer.ts
 * @Path app/redux
 * @Author BRICE ZELE
 * @Date 12/03/2023
 */

import {combineReducers} from '@reduxjs/toolkit'
import {configReducer} from './config/config.reducer'
import {userReducer} from './user/userReducer'
import {bookReducer} from './book/bookReducer'
import {roomReducer} from './room/roomReducer'

const reducers = {
    application: configReducer,
    user: userReducer,
    room: roomReducer,
} as const

export const rootReducer = combineReducers(reducers)
export type RootState = ReturnType<typeof rootReducer>
export type ReducerNames = keyof typeof reducers
