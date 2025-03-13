/**
 * @Project Summarised
 * @File OTPInput.tsx
 * @Path app/components/core/Input
 * @Author BRICE ZELE
 * @Date 04/05/2023
 */
import {Animated, StyleSheet} from 'react-native'
import React, {useState} from 'react'

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import {RenderCellOptions} from 'react-native-confirmation-code-field/esm/CodeField'
import {useAppTheme} from '../../../hooks/theme/useAppTheme'

const {Value, Text: AnimatedText} = Animated

const CELL_COUNT = 4
export const CELL_SIZE = 55
export const CELL_BORDER_RADIUS = 8

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0))
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1))

const animateCell = ({
    hasValue,
    index,
    isFocused,
}: {
    hasValue: boolean
    index: number
    isFocused: boolean
}): void => {
    Animated.parallel([
        Animated.timing(animationsColor[index] ?? new Value(0), {
            useNativeDriver: false,
            toValue: isFocused ? 1 : 0,
            duration: 250,
        }),
        Animated.spring(animationsScale[index] ?? new Value(1), {
            useNativeDriver: false,
            toValue: hasValue ? 0 : 1,
            // @ts-ignore
            duration: hasValue ? 300 : 250,
        }),
    ]).start()
}

interface OTPInputProps {
    onTextChange: ((text: string) => void) | undefined
}

const OTPInput: React.FC<OTPInputProps> = ({onTextChange}): JSX.Element => {
    const [value, setValue] = useState('')
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT})
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })
    const theme = useAppTheme()
    const DEFAULT_CELL_BG_COLOR = theme.colors.background1
    const NOT_EMPTY_CELL_BG_COLOR = theme.colors.userThemeColor
    const ACTIVE_CELL_BG_COLOR = theme.colors.background1
    const renderCell = ({index, symbol, isFocused}: RenderCellOptions): JSX.Element => {
        const hasValue = Boolean(symbol)
        const animatedCellStyle = {
            backgroundColor: hasValue
                ? animationsScale[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                  })
                : animationsColor[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                  }),
            borderRadius: animationsScale[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
            }),
            transform: [
                {
                    scale: animationsScale[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                    }),
                },
            ],
        }

        // Run animation on next event loop tik
        // Because we need first return new style prop and then animate this value
        setTimeout(() => {
            animateCell({hasValue, index, isFocused})
        }, 0)

        return (
            <AnimatedText
                key={index}
                style={[
                    styles.cell,
                    {
                        backgroundColor: theme.colors.background2,
                        color: theme.colors.userThemeColor,
                    },
                    animatedCellStyle as any,
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
            </AnimatedText>
        )
    }

    return (
        <>
            <CodeField
                ref={ref}
                {...props}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                renderCell={renderCell}
                rootStyle={styles.codeFiledRoot}
                textContentType="oneTimeCode"
                value={value}
                onChangeText={(text: string): void => {
                    onTextChange && onTextChange(text)
                    setValue(text)
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    cell: {
        borderRadius: CELL_BORDER_RADIUS,
        elevation: 3,
        fontSize: 30,
        height: CELL_SIZE,
        lineHeight: CELL_SIZE - 5,
        marginHorizontal: 8,

        shadowColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        textAlign: 'center',
        width: CELL_SIZE,
    },
    codeFiledRoot: {
        height: CELL_SIZE,
        justifyContent: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
    },
})

export default OTPInput
