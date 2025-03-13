/**
 * @Project Summarised
 * @File PlanItem.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import React from 'react'
import {Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import {useResponsiveProp} from '@shopify/restyle'
import {Theme} from '../../themes/Theme'
import Ionicon from 'react-native-vector-icons/Ionicons'

export interface PlanItemProps {
    title: string
    description: string
    icon?: string
    size?: number
    iconBackgroundColor?: keyof Theme['colors']
}

const PlanItem: React.FC<PlanItemProps> = ({
    title = '',
    description = '',
    icon = null,
    iconBackgroundColor,
    size = 0,
}): JSX.Element => {
    const descriptionSize = useResponsiveProp({
        phone: 'bodySmall',
        longPhone: 'bodyLarge',
    })

    return (
        <Flex flexDirection="row">
            {icon && (
                <Flex
                    alignItems="center"
                    borderRadius="rounded16"
                    height={30}
                    justifyContent="center"
                    width={30}>
                    <Ionicon name={icon} size={size} color={'white'} />
                </Flex>
            )}
            <Flex mt={'spacing4'}>
                <Flex row alignItems="center" justifyContent="space-between">
                    <Text color="textPrimary" fontWeight={'bold'} variant="subheadLarge">
                        {title}
                    </Text>
                </Flex>

                <Flex row alignItems="flex-start">
                    <Text variant={descriptionSize}>{description}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default PlanItem
