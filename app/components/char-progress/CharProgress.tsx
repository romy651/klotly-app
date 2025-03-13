import React from 'react'
import {View} from 'react-native'
// @ts-ignore no type definition -prf
import ProgressCircle from 'react-native-progress/Circle'
// @ts-ignore no type definition -prf
import ProgressPie from 'react-native-progress/Pie'
import {Text} from '../core/Text/Text'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'

const DANGER_LENGTH = 300

export function CharProgress({count}: {count: number}) {
    const theme = useAppTheme()
    const textColor = count > DANGER_LENGTH ? theme.colors.accentCritical : theme.colors.textPrimary
    const circleColor =
        count > DANGER_LENGTH ? theme.colors.accentCritical : theme.colors.accentAction
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text mr={'spacing10'} variant={'bodyMicro'} style={[{color: textColor}]}>
                {DANGER_LENGTH - count}
            </Text>
            <View>
                {count > DANGER_LENGTH ? (
                    <ProgressPie
                        size={30}
                        borderWidth={4}
                        borderColor={circleColor}
                        color={circleColor}
                        progress={Math.min((count - DANGER_LENGTH) / DANGER_LENGTH, 1)}
                    />
                ) : (
                    <ProgressCircle
                        size={30}
                        borderWidth={1}
                        borderColor={theme.colors.background3}
                        color={circleColor}
                        progress={count / DANGER_LENGTH}
                    />
                )}
            </View>
        </View>
    )
}
