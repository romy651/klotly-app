import {StyleSheet, View} from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'

type Props = {
    number: number
    color?: string
    size?: number
}

const StaticStar = ({number, color, size = 18}: Props) => {
    const theme = useAppTheme()
    return (
        <View style={styles.wrapper}>
            <AntDesign
                name="star"
                color={
                    number < 1
                        ? theme.colors.background3
                        : color
                        ? color
                        : theme.colors.accentWarning
                }
                size={size}
            />
            <AntDesign
                name="star"
                color={
                    number < 2
                        ? theme.colors.background3
                        : color
                        ? color
                        : theme.colors.accentWarning
                }
                size={size}
            />
            <AntDesign
                name="star"
                color={
                    number < 3
                        ? theme.colors.background3
                        : color
                        ? color
                        : theme.colors.accentWarning
                }
                size={size}
            />
            <AntDesign
                name="star"
                color={
                    number < 4
                        ? theme.colors.background3
                        : color
                        ? color
                        : theme.colors.accentWarning
                }
                size={size}
            />
            <AntDesign
                name="star"
                color={
                    number < 5
                        ? theme.colors.background3
                        : color
                        ? color
                        : theme.colors.accentWarning
                }
                size={size}
            />
        </View>
    )
}

export default StaticStar

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
