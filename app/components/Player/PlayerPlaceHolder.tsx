/**
 * @Project Summarised
 * @File PlayerPlaceHolder.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import * as React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface PlayerPlaceHolderProps {
    style: StyleProp<ViewStyle>
    size?: number
}

const PlayerPlaceHolder: React.FC<PlayerPlaceHolderProps> = ({style, size = 50}): JSX.Element => {
    const theme = useAppTheme()

    return (
        <LinearGradient
            colors={[theme.colors.userThemeColor, theme.colors.background1]}
            style={[style, {justifyContent: 'center', alignItems: 'center'}]}>
            <Ionicons
                color={theme.colors.white}
                name="ios-musical-notes"
                size={size < 200 ? size - 10 : 100}
            />
        </LinearGradient>
    )
}

export default PlayerPlaceHolder
