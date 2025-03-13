/**
 * @Project Summarised
 * @File useAppTheme.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */

import {Theme} from 'app/themes/Theme'
import {useTheme} from '@shopify/restyle'

export const useAppTheme = (): Theme => useTheme<Theme>()
