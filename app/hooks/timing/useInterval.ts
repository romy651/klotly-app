/**
 * @Project Summarised
 * @File useInterval.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 20/04/2023
 */
import {useEffect, useRef} from 'react'

// https://usehooks-typescript.com/react-hook/use-interval
export const useInterval = (
    callback: () => void,
    delay: number | null,
    immediateStart?: boolean,
): void => {
    const savedCallback = useRef<() => void | null>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        const tick = (): void => {
            if (typeof savedCallback?.current !== 'undefined') {
                savedCallback?.current()
            }
        }

        if (delay !== null) {
            if (immediateStart) {
                tick()
            }

            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }

        return undefined
    }, [delay, immediateStart])
}
