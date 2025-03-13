/*
    Inspiration: -
*/
import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import {View as MView} from 'moti'
import {Feather} from '@expo/vector-icons'
import {Easing} from 'react-native-reanimated'
import {Flex} from '../layout/Flex'

const _color = '#6E01EF'
const _size = 100

export default function VideoAnimation() {
    return (
        <Flex backgroundColor={'background2'} style={styles.container}>
            <MView style={[styles.dot, styles.center]}>
                {[...Array(3).keys()].map(i => (
                    <MView
                        key={i}
                        from={{scale: 1, opacity: 0.3}}
                        animate={{scale: 8, opacity: 0}}
                        transition={{
                            loop: true,
                            repeatReverse: false,
                            duration: 4000,
                            delay: i * 800,
                            type: 'timing',
                            easing: Easing.out(Easing.ease),
                        }}
                        style={[StyleSheet.absoluteFillObject, styles.dot]}
                    />
                ))}
                <Feather name="phone-outgoing" size={32} color="#fff" />
            </MView>
        </Flex>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: -100,
    },
    dot: {
        width: _size,
        height: _size,
        borderRadius: _size,
        backgroundColor: _color,
        marginBottom: 100,
    },
    center: {alignItems: 'center', justifyContent: 'center'},
})
