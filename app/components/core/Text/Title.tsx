/**
 * @Project Summarised
 * @File Title.tsx
 * @Path app/components/core/Text
 * @Author BRICE ZELE
 * @Date 01/07/2023
 */
import {Text, TextProps} from './Text'
import React, {PropsWithChildren} from 'react'
import {Flex} from '../../layout/Flex'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useAppTheme} from '../../../hooks/theme/useAppTheme'

interface TitleProps extends TextProps {
    seeMore?: boolean
    onPress?: () => void
}

const Title: React.FC<PropsWithChildren<TitleProps>> = ({
    seeMore,
    children,
    onPress,
    ...props
}): JSX.Element => {
    const theme = useAppTheme()
    return (
        <Flex flexDirection="row" justifyContent="space-between" onTouchEnd={onPress}>
            {seeMore && (
                <MaterialIcons color={theme.colors.white} name="keyboard-arrow-right" size={30} />
            )}
            <Text {...props}>{children}</Text>
        </Flex>
    )
}

export default Title
