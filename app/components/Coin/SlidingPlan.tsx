import {vipSlides as DATA} from 'app/constants'
import * as React from 'react'
import {StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
const {width, height} = Dimensions.get('screen')

const SlidngPlan: React.FC = (): JSX.Element => {
    const scrollX = React.useRef(new Animated.Value(0)).current
    const inputRange = DATA.map((_, i) => i * width)
    const backgroundColor = scrollX.interpolate({
        inputRange,
        outputRange: DATA.map(item => item.color),
    })

    // Math to output [0, 1] range for input based on
    // scrollX position and width of the screen. 🤓
    const YOLO = Animated.modulo(
        Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
        1,
    )

    const rotate = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['35deg', '-35deg', '35deg'],
    })
    const translateX = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -height, 0],
    })

    return (
        <View style={{flex: 1}}>
            <StatusBar hidden />
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor,
                    },
                ]}
            />
            <Animated.View
                style={{
                    width: height * 0.65,
                    height: height * 0.65,
                    borderRadius: 96,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    position: 'absolute',
                    top: -height * 0.2,
                    left: -height * 0.1,
                    transform: [
                        {
                            translateX,
                        },
                        {
                            rotate,
                        },
                    ],
                }}
            />

            <Animated.FlatList
                data={DATA}
                scrollEventThrottle={32}
                showsHorizontalScrollIndicator={false}
                style={{paddingBottom: height * 0.25}}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                    useNativeDriver: false,
                })}
                keyExtractor={item => item.key}
                pagingEnabled
                horizontal
                renderItem={({item, index}) => {
                    return (
                        <View style={{width, justifyContent: 'center', height: '100%'}}>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={{uri: item.image}}
                                    style={{
                                        width: width / 2,
                                        height: width / 2,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                            <View style={{padding: 20}}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontWeight: '800',
                                        fontSize: 28,
                                        paddingVertical: 10,
                                    }}
                                    numberOfLines={2}
                                    adjustsFontSizeToFit>
                                    {item.title}
                                </Text>
                                <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    )
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: height * 0.25,
                    padding: 20,
                    width,
                    justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={() => {}}>
                        <View
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 22,
                                borderRadius: 12,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                            }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    opacity: 0.9,
                                    letterSpacing: 1,
                                }}>
                                Log in
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <View
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 22,
                                borderRadius: 12,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                            }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    opacity: 0.9,
                                    letterSpacing: 1,
                                }}>
                                Create account
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                    {DATA.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [1, 1.5, 1],
                            extrapolate: 'clamp',
                        })
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.6, 1, 0.6],
                            extrapolate: 'clamp',
                        })
                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 10,
                                    margin: 8,
                                    opacity,
                                    backgroundColor: '#fff',
                                    transform: [
                                        {
                                            scale,
                                        },
                                    ],
                                }}
                            />
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

export default SlidngPlan
