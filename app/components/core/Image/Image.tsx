/**
 * @Project Summarised
 * @File Image.tsx
 * @Path app/components/core/Image
 * @Author BRICE ZELE
 * @Date 21/03/2023
 */

import FastImage, {FastImageProps, Source} from 'react-native-fast-image'
import * as React from 'react'
import {memo, useCallback, useEffect, useRef, useState} from 'react'
import {Animated, Image as ImageRN, StyleSheet, View} from 'react-native'
import {uriToHttp} from './utils'
import {SvgUri} from 'react-native-svg'
import {Assets} from '../../../constants/Assets'
import {Logger} from '../../../utils/logger'

interface ImageProps extends FastImageProps {
    maxHeight?: number | string
    enableProgressive?: boolean
}

const Image: React.FC<ImageProps> = ({
    style = {},
    resizeMode = 'cover',
    source,
    maxHeight = '100%',
    enableProgressive = true,
    ...rest
}): JSX.Element => {
    const [height, setHeight] = useState<number | null>(null)
    const [width, setWidth] = useState<number | null>(null)
    const [imageHttpUrl, setImageHttpUrl] = useState<string | null | undefined>(null)
    const [isError, setIsError] = useState(false)
    const {uri} = source as Source

    const fadeAnimation = useRef(new Animated.Value(1)).current
    const PROGRESSIVE_IMAGE_LOADING = 250

    const fadeOut = useCallback(() => {
        Animated.timing(fadeAnimation, {
            toValue: 0,
            duration: PROGRESSIVE_IMAGE_LOADING,
            useNativeDriver: true,
        }).start()
    }, [fadeAnimation])

    const onLoad = (): void => {
        fadeOut()
    }

    const onError = (): void => {
        setIsError(true)
    }

    useEffect(() => {
        if (!uri) return
        else {
            setImageHttpUrl(uriToHttp(uri)[0])
            ImageRN.getSize(
                uri,
                (calculatedWidth: number, calculatedHeight: number) => {
                    setWidth(calculatedWidth)
                    setHeight(calculatedHeight)
                    setIsError(!calculatedHeight || !calculatedWidth)
                },
                () => {
                    setIsError(true)
                },
            )
        }
    }, [source])

    Logger.info('', '', 'width', width)
    Logger.info('', '', 'height', height)
    let resize: any = FastImage.resizeMode.cover
    switch (resizeMode) {
        case 'contain':
            resize = FastImage.resizeMode.contain
            break
        case 'stretch':
            resize = FastImage.resizeMode.stretch
            break
        case 'center':
            resize = FastImage.resizeMode.center
            break
        default:
            break
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    const AssetImage: React.FC<ImageProps> = ({source, ...rest}): JSX.Element => (
        <FastImage
            resizeMode={resize}
            source={source}
            style={StyleSheet.flatten([style && style, {maxHeight}])}
            {...rest}
        />
    )

    if (imageHttpUrl && width && height && imageHttpUrl.endsWith('.svg')) {
        return <SvgUri height={height} uri={imageHttpUrl} width={width} />
    }

    if (isError) return <AssetImage source={Assets.images.placeholder} {...rest} />
    return (
        <View>
            {imageHttpUrl && enableProgressive ? (
                <React.Fragment>
                    <Animated.View
                        style={[
                            {
                                ...StyleSheet.absoluteFillObject,
                                position: 'absolute',
                            },
                        ]}>
                        <FastImage
                            resizeMode={resize}
                            source={{uri: imageHttpUrl}}
                            style={
                                style ?? [
                                    {
                                        // @ts-ignore
                                        aspectRatio: 1000 / 500,
                                        maxHeight: maxHeight ?? '100%',
                                    },
                                    styles.fullWidth,
                                ]
                            }
                            onError={onError}
                            onLoad={onLoad}
                            {...rest}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            {
                                opacity: fadeAnimation,
                            },
                        ]}>
                        <AssetImage source={Assets.images.placeholder} {...rest} />
                    </Animated.View>
                </React.Fragment>
            ) : (
                <AssetImage source={source} {...rest} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    fullWidth: {
        height: undefined,
        width: '100%',
    },
})

export default memo(Image)
