/**
 * @Project Summarised
 * @File OptionCard.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 29/03/2023
 */
import React from 'react'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {useResponsiveProp} from '@shopify/restyle'
import {TouchableArea} from '../core/Button/TouchableArea'
import {Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export interface OptionCardProps {
    title: string
    subTitle?: string
    onPress: () => void
    disable?: boolean
    opacity?: number
    selected?: boolean
    multipleSelection?: boolean
    icon?: JSX.Element
}

const OptionCard: React.FC<OptionCardProps> = ({
    title,
    subTitle,
    disable = false,
    onPress,
    selected = false,
    multipleSelection = false,
    opacity,
    icon,
}): JSX.Element => {
    const theme = useAppTheme()

    const titleSize = useResponsiveProp({
        phone: 'subheadSmall',
        longPhone: 'subheadLarge',
    })

    const iconSize = useResponsiveProp({
        phone: theme.iconSizes.icon20,
        longPhone: theme.iconSizes.icon28,
    })

    const verticalPadding = useResponsiveProp({
        phone: 'spacing16',
        longPhone: 'spacing16',
    })

    return (
        <TouchableArea
            hapticFeedback
            scale
            backgroundColor="backgroundScrim"
            borderColor={selected ? 'userThemeColor' : 'none'}
            borderRadius="rounded8"
            borderWidth={2}
            disabled={disable}
            opacity={opacity}
            px="spacing16"
            py={verticalPadding}
            scaleTo={1}
            onPressIn={onPress}>
            <Flex row alignItems="center" justifyContent="space-between">
                {icon}
                <Flex gap="spacing4" width="90%">
                    <Flex alignItems="flex-start" gap="spacing4" justifyContent="space-around">
                        <Text color={'textPrimary'} variant={titleSize}>
                            {title}
                        </Text>
                        {subTitle && (
                            <Text color="textSecondary" variant="bodySmall">
                                {subTitle}
                            </Text>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </TouchableArea>
    )
}

export default OptionCard
