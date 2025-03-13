/**
 * @Project Summarised
 * @File useImageColors.ts
 * @Path app/hooks/theme
 * @Author BRICE ZELE
 * @Date 31/05/2023
 */

import {useEffect, useState} from 'react'
import ImageColors from 'react-native-image-colors'
import {Theme} from '../../themes/Theme'

interface ImageColorItem {
    value: string
    name: string
}

interface ImageColorRecord {
    colorOne: ImageColorItem
    colorTwo: ImageColorItem
    colorThree: ImageColorItem
    colorFour: ImageColorItem
    rawResult: string
}

interface ImageColor {
    colors: ImageColorRecord
    colorsLoading: boolean
}

export const useImageColors = (
    imageUrl: string,
    fallback: keyof Theme['colors'] = 'userThemeColor',
    cache = true,
): ImageColor => {
    const initialState = {
        colorOne: {value: '', name: ''},
        colorTwo: {value: '', name: ''},
        colorThree: {value: '', name: ''},
        colorFour: {value: '', name: ''},
        rawResult: '',
    }

    const [colors, setColors] = useState<ImageColorRecord>(initialState)
    const [colorsLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchColors = async (): Promise<void> => {
            const result = await ImageColors.getColors(imageUrl, {
                fallback,
                cache,
                pixelSpacing: 5,
            })

            switch (result.platform) {
                case 'android':
                case 'web':
                    setColors({
                        colorOne: {value: String(result.lightVibrant), name: 'lightVibrant'},
                        colorTwo: {value: String(result.dominant), name: 'dominant'},
                        colorThree: {value: String(result.vibrant), name: 'vibrant'},
                        colorFour: {value: String(result.darkVibrant), name: 'darkVibrant'},
                        rawResult: JSON.stringify(result),
                    })
                    break
                case 'ios':
                    setColors({
                        colorOne: {value: result.background, name: 'background'},
                        colorTwo: {value: result.detail, name: 'detail'},
                        colorThree: {value: result.primary, name: 'primary'},
                        colorFour: {value: result.secondary, name: 'secondary'},
                        rawResult: JSON.stringify(result),
                    })
                    break
                default:
                    throw new Error('Unexpected platform')
            }

            setLoading(false)
        }
        fetchColors()
    }, [])

    return {colors, colorsLoading}
}
