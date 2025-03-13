import React, {useState} from 'react'
import {View, StyleProp, ViewStyle, TextStyle} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {radioStyle} from './style'
import {TouchableNativeFeedback as Touchable} from 'react-native'om 'react-native-platform-touchable'
import {Flex} from '../layout/Flex'
import {theme} from 'app/themes/Theme'
import {Text} from '../core/Text/Text'

export interface RadioProps {
    labels: string[]
    values: number[]
    defaultSelected: number
    onChange?: (selectedValue: number) => void
}
const Radio = ({onChange, defaultSelected, labels, values}: RadioProps) => {
    const [selected, setSelected] = useState<number>(defaultSelected)
    const styles = radioStyle()
    const _onChangeSelection = (value: number) => {
        if (value === selected) {
            return
        }
        if (onChange) {
            onChange(value)
        }
        setSelected(value)
    }
    if (labels.length < values.length) {
        return null
    }
    return (
        <Flex style={styles.container}>
            {values.map((value, index) => (
                <Flex
                    key={index}
                    borderRadius={'roundedFull'}
                    height={60}
                    justifyContent={'flex-end'}
                    overflow={'hidden'}
                    width={'94%'}
                    backgroundColor={value == selected ? 'background3' : 'background0'}>
                    <Touchable
                        onPress={_onChangeSelection.bind(null, value)}
                        key={index}
                        activeOpacity={0.9}
                        background={Touchable.Ripple(theme.colors.background3)}
                        style={styles.viewItem}>
                        <>
                            {value == selected ? (
                                <MaterialIcon
                                    style={{marginLeft: 10, marginRight: 25}}
                                    {...{
                                        name: 'check-circle',
                                        size: 23,
                                        color: theme.colors.accentActive,
                                    }}
                                />
                            ) : (
                                <View style={styles.nonChecked} />
                            )}
                            <Text
                                numberOfLines={1}
                                variant={'subheadLarge'}
                                color={value == selected ? 'accentActive' : 'textSecondary'}
                                style={{
                                    ...styles.textItem,
                                }}>
                                {labels[index]}
                            </Text>
                        </>
                    </Touchable>
                </Flex>
            ))}
        </Flex>
    )
}

export default Radio
