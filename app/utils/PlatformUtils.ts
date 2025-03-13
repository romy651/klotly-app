/**
 * @Project Summarised
 * @File PlatformUtils.ts
 * @Path app/utils
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import {Platform} from 'react-native'

export const isIos = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
