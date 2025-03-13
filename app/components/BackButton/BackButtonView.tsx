/**
 * @Project Summarised
 * @File BackButtonView.tsx
 * @Path app/components/BackButton
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import {Theme} from '../../themes/Theme'
import {useTranslation} from 'react-i18next'
import {useTheme} from '@shopify/restyle'
import {Flex} from '../layout/Flex'
import {Chevron} from './BackIcon'
import React from 'react'
import {Text} from '../core/Text/Text'

type Props = {
    size?: number
    color?: keyof Theme['colors']
    showButtonLabel?: boolean
}

const BackButtonView: React.FC<Props> = ({size, color, showButtonLabel}: Props): JSX.Element => {
    const {t} = useTranslation()
    const theme = useTheme<Theme>()

    return (
        <Flex row alignItems="center" gap="spacing8">
            <Chevron
                color={color ? theme.colors[color] : theme.colors.textTertiary}
                height={size}
                width={size}
            />
            {showButtonLabel && (
                <Text color="textSecondary" variant="subheadLarge">
                    {t('Back')}
                </Text>
            )}
        </Flex>
    )
}

export default BackButtonView
