/**
 * @Project Summarised
 * @File BackButton.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import {Theme} from '../../themes/Theme'
import {SpacingProps, SpacingShorthandProps} from '@shopify/restyle'
import {TouchableArea} from '../core/Button/TouchableArea'
import React from 'react'
import BackButtonView from './BackButtonView'
import {useAppStackNavigation} from '../../routes/screens/Screens.types'

type Props = {
    size?: number
    color?: keyof Theme['colors']
    showButtonLabel?: boolean
    onPressBack?: () => void
} & SpacingProps<Theme> &
    SpacingShorthandProps<Theme>

const BackButton: React.FC<Props> = ({
    onPressBack,
    size,
    color,
    showButtonLabel,
    ...rest
}): JSX.Element => {
    const navigation = useAppStackNavigation()

    const goBack = onPressBack
        ? onPressBack
        : (): void => {
              console.log('Back button pressed')
              navigation.goBack()
          }
    return (
        <TouchableArea zIndex="modal" onPress={goBack} {...rest}>
            <BackButtonView color={color} showButtonLabel={showButtonLabel} size={size} />
        </TouchableArea>
    )
}

export default BackButton
