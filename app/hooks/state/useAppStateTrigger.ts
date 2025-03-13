/**
 * @Project Summarised
 * @File useAppStateTrigger.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */
import {AppState, AppStateStatus} from 'react-native'
import {useEffect, useRef} from 'react'

export const useAppStateTrigger = (
    from: AppStateStatus,
    to: AppStateStatus,
    callback: () => void,
): void => {
    const appState = useRef(AppState.currentState)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current === from && nextAppState === to) callback()

            appState.current = nextAppState
        })

        return () => {
            subscription.remove()
        }
    })
}
