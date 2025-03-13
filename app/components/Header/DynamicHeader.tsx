import * as React from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated'
import {AnimatedFlex, Flex} from '../../components/layout/Flex'
import TouchableIcon from '../core/Button/TouchableIcon'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {getStatusBarHeight} from 'react-native-safearea-height'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {Text} from '../core/Text/Text'
import {isAndroid} from 'app/utils/PlatformUtils'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontIcon from 'react-native-vector-icons/FontAwesome5'

type Props = {
    animHeaderValue: Animated.SharedValue<number>
    title: string
    withReturn?: boolean
    staticc?: boolean
    noLeftOptions?: boolean
    onGoBack?: () => void
    onSearch?: () => void
    onSetting?: () => void
}

export default function DynamicHeader({
    animHeaderValue,
    title,
    onGoBack = (): void => {},
    onSearch = (): void => {},
    onSetting = (): void => {},
    withReturn = false,
    staticc = false,
    noLeftOptions = false,
}: Props): JSX.Element {
    const defaultHeaderHeight = getStatusBarHeight()
    const theme = useAppTheme()
    const isDarkMode = useDarkMode()

    const dynamicStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animHeaderValue.value,
            [80, 90],
            [
                staticc ? theme.colors.accentActionSoft : 'transparent',
                theme.colors.accentActionSoft,
            ],
        )

        const borderBottomWidth = interpolate(animHeaderValue.value, [0, 80], [0, 1], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })

        return {
            height: 60,
            borderBottomWidth,
            borderBottomColor: theme.colors.backgroundScrim,
            backgroundColor,
        }
    })

    const tabBarStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animHeaderValue.value,
            [80, 90],
            [
                staticc ? theme.colors.accentActionSoft : 'transparent',
                theme.colors.accentActionSoft,
            ],
        )
        return {
            height: defaultHeaderHeight,
            width: '100%',
            backgroundColor,
        }
    })

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animHeaderValue.value, [50, 70], [staticc ? 1 : 0, 1], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        })
        return {
            opacity,
            marginLeft: withReturn ? 35 : 0,
            width: SCREEN_WIDTH - 160,
            height: '100%',
            justifyContent: 'center',
        }
    })

    return (
        <>
            <AnimatedFlex style={tabBarStyle} />
            <AnimatedFlex style={[styles.header, dynamicStyle]}>
                <AnimatedFlex style={textStyle}>
                    <Text
                        color="textPrimary"
                        fontWeight="bold"
                        numberOfLines={1}
                        style={{...styles.headerText}}
                        variant="bodyLarge">
                        {title}
                    </Text>
                </AnimatedFlex>
                {!noLeftOptions && (
                    <Flex flexDirection="row" position="absolute" right={10} top={10}>
                        <TouchableIcon
                            Component={FontIcon}
                            action={onSetting}
                            color={theme.colors.accentWarning}
                            name="coins"
                            size={22}
                        />
                        <TouchableIcon
                            Component={AntDesign}
                            action={onSearch}
                            color={theme.colors.textPrimary}
                            name="search1"
                            size={24}
                        />
                    </Flex>
                )}
                {withReturn && (
                    <Flex left={5} position="absolute" top={10}>
                        <TouchableIcon
                            Component={Ionicon}
                            action={onGoBack}
                            color={theme.colors.textPrimary}
                            name={isAndroid ? 'arrow-back' : 'chevron-back'}
                            size={24}
                        />
                    </Flex>
                )}
            </AnimatedFlex>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 24,
        marginLeft: 10,
        marginTop: 7,
    },
})
