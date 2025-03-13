/**
 * @Project Summarised
 * @File index.ts
 * @Path app/store
 * @Author BRICE ZELE
 * @Date 05/03/2023
 */
import {MMKV} from 'react-native-mmkv'
import logger from 'redux-logger'
import createMigrate from './createMigrate'
import {migrations} from './migrations'
import {persistReducer, persistStore, Storage} from 'redux-persist'
import {rootReducer, RootState} from '../redux/rootReducer'
import type {Middleware, PreloadedState} from '@reduxjs/toolkit'
import {configureStore} from '@reduxjs/toolkit'
import {isNonJestDev} from '../utils/environment'
import thunk from 'redux-thunk'

const storage = new MMKV()

export const reduxStorage: Storage = {
    setItem: (key, value) => {
        storage.set(key, value)
        return Promise.resolve(true)
    },
    getItem: key => {
        const value = storage.getString(key)
        return Promise.resolve(value)
    },
    removeItem: key => {
        storage.delete(key)
        return Promise.resolve()
    },
}

export const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    version: 0,
    migrate: createMigrate(migrations),
}

export const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares: Middleware[] = [thunk]
if (isNonJestDev()) {
    //const createDebugger = require('redux-flipper').default
    //require('react-native-mmkv-flipper-plugin').initializeMMKVFlipper({default: storage})
    //middlewares.push(createDebugger())
    middlewares.push(logger)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: persistedReducer,
        preloadedState,
        middleware: getDefaultMiddleware => {
            return getDefaultMiddleware({
                thunk: true,
                serializableCheck: false,
                invariantCheck: {
                    warnAfter: 256,
                },
                immutableCheck: false,
            }).concat(...middlewares)
        },
        devTools: __DEV__,
    })
}

export const store = setupStore()

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
