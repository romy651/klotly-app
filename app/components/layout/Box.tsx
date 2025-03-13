/**
 * @Project Summarised
 * @File Box.tsx
 * @Path app/components/layout
 * @Author BRICE ZELE
 * @Date 16/03/2023
 */
import {createBox} from '@shopify/restyle'
import {ComponentProps} from 'react'
import Animated from 'react-native-reanimated'
import {Theme} from '../../themes/Theme'

export type BoxProps = ComponentProps<typeof Box>
export const Box = createBox<Theme>()
export const AnimatedBox = Animated.createAnimatedComponent(Box)
