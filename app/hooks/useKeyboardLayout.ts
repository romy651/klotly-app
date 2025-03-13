/**
 * @Project Summarised
 * @File useKeyboardLayout.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 28/03/2023
 */
import {Keyboard, KeyboardEvent, useWindowDimensions} from 'react-native'
import {useEffect, useState} from 'react'

interface IKeyLayout {
    isVisible: boolean
    containerHeight: number
}

export const useKeyboardLayout = (): IKeyLayout => {
    const window = useWindowDimensions()

    const [keyboardPosition, setKeyboardPosition] = useState(window.height)

    useEffect(() => {
        const keyboardWillChangeFrameListener = Keyboard.addListener(
            'keyboardWillChangeFrame',
            (e: KeyboardEvent) => {
                setKeyboardPosition(e.endCoordinates.screenY)
            },
        )

        return (): void => {
            keyboardWillChangeFrameListener.remove()
        }
    }, [window.height])

    const keyboarHeight = window.height - keyboardPosition

    return {isVisible: keyboarHeight > 0, containerHeight: window.height - keyboarHeight}
}
