import * as React from 'react'
import {Image, Text, View} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {MessageType} from '../../types'
import {formatBytes, L10nContext, ThemeContext, UserContext} from '../../utils'
import styles from './styles'

export interface FileMessageProps {
    message: MessageType.DerivedFile
}

export const FileMessage = ({message}: FileMessageProps) => {
    const l10n = React.useContext(L10nContext)
    const theme = React.useContext(ThemeContext)
    const user = React.useContext(UserContext)
    const {container, icon, iconContainer, name, size, textContainer} = styles({
        message,
        theme,
        user,
    })

    return (
        <View accessibilityLabel={l10n.fileButtonAccessibilityLabel} style={container}>
            <View style={iconContainer}>
                {theme.icons?.documentIcon?.() ?? (
                    <Ionicon name="documents" size={24} color={theme.colors.inputText} />
                )}
            </View>
            <View style={textContainer}>
                <Text style={name}>{message.name}</Text>
                <Text style={size}>{formatBytes(message.size)}</Text>
            </View>
        </View>
    )
}
