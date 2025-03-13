/**
 * @Project Summarised
 * @File HandleBar.tsx
 * @Path app/ModalStack/components
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import React from 'react'
import {ColorValue, FlexStyle} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {Flex} from '../../components/layout/Flex'
import {Box} from '../../components/layout/Box'
import {theme} from '../../themes/Theme'

const HANDLEBAR_HEIGHT = theme.spacing.spacing4
const HANDLEBAR_WIDTH = theme.spacing.spacing36

export interface HandleBarsProps {
    backgroundColor: ColorValue
    hidden?: boolean
    containerFlexStyles?: FlexStyle
}

const HandleBar: React.FC<HandleBarsProps> = ({
    backgroundColor,
    hidden,
    containerFlexStyles,
}): JSX.Element => {
    const theme = useAppTheme()
    const bg = hidden ? 'transparent' : backgroundColor ?? theme.colors.background0

    return (
        <Flex
            alignItems="center"
            borderRadius="rounded24"
            justifyContent="center"
            style={{
                ...containerFlexStyles,
                backgroundColor: bg,
            }}>
            <Box
                alignSelf="center"
                backgroundColor={hidden ? 'none' : 'backgroundOutline'}
                borderRadius="rounded24"
                height={HANDLEBAR_HEIGHT}
                overflow="hidden"
                width={HANDLEBAR_WIDTH}
            />
        </Flex>
    )
}

export default HandleBar
