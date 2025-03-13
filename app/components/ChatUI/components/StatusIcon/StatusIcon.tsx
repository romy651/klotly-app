import * as React from 'react'
import {StyleSheet, View} from 'react-native'

import {MessageType, Theme} from '../../types'
import {CircularActivityIndicator} from '../CircularActivityIndicator'
import AntDesign from 'react-native-vector-icons/AntDesign'

import Ionicon from 'react-native-vector-icons/Ionicons'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'

export const StatusIcon = React.memo(
    ({
        currentUserIsAuthor,
        showStatus,
        status,
        theme,
    }: {
        currentUserIsAuthor: boolean
        showStatus: boolean
        status?: MessageType.Any['status']
        theme: Theme
    }) => {
        let statusIcon: React.ReactNode | null = null

        const _theme = useAppTheme()

        if (showStatus) {
            switch (status) {
                case 'delivered':
                    statusIcon = theme.icons?.deliveredIcon?.() ?? (
                        <Ionicon
                            color={_theme.colors.textSecondary}
                            name="checkmark-done"
                            size={20}
                        />
                    )
                    break
                case 'sent':
                    statusIcon = theme.icons?.deliveredIcon?.() ?? (
                        <Ionicon color={_theme.colors.textSecondary} name="checkmark" size={20} />
                    )
                    break
                case 'error':
                    statusIcon = theme.icons?.errorIcon?.() ?? (
                        <AntDesign
                            color={_theme.colors.accentCritical}
                            name="exclamationcircle"
                            size={16}
                        />
                    )
                    break
                case 'seen':
                    statusIcon = theme.icons?.seenIcon?.() ?? (
                        <Ionicon
                            color={_theme.colors.accentSuccess}
                            name="checkmark-done"
                            size={20}
                        />
                    )
                    break
                case 'sending':
                    statusIcon = theme.icons?.sendingIcon?.() ?? (
                        <CircularActivityIndicator color={theme.colors.primary} size={10} />
                    )
                    break
                default:
                    break
            }
        }

        return currentUserIsAuthor ? (
            <View style={styles.container} testID="StatusIconContainer">
                {statusIcon}
            </View>
        ) : null
    },
)

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: 16,
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
})
