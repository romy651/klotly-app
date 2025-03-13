import {
    StyleSheet,
    useWindowDimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ActivityIndicator,
} from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import {Flex, FlexProps} from '../layout/Flex'
import BottomPlayerItems from './BottomPlayerItems'
import TouchableIcon from '../core/Button/TouchableIcon'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {ScrollView} from 'react-native-gesture-handler'
import {runOnJS, useSharedValue} from 'react-native-reanimated'
import TrackPlayer, {Track, useActiveTrack} from 'react-native-track-player'
import {Text} from '../core/Text/Text'
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html'

type Prop = {
    isReading: boolean
    setIsReading: React.Dispatch<React.SetStateAction<boolean>>
    onClose: () => void
}

const LyricView: React.FC<Prop & FlexProps> = ({
    isReading,
    setIsReading,
    onClose,
    ...props
}): JSX.Element => {
    const {width, height} = useWindowDimensions()
    const scrollRef = useRef<ScrollView | null>(null)
    const offSetX = useSharedValue<number>(0)
    const track = useActiveTrack() as Track
    const [queue, setQueue] = useState<Track[]>([])
    const [trackIndex, setTrackIndex] = useState<number>(0)

    useEffect(() => {
        getQueue()
    }, [])

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const val = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH) + 1
        if (trackIndex !== val) runOnJS(setTrackIndex)(val)
    }

    const getQueue = async (): Promise<void> => {
        const res = await TrackPlayer.getQueue()
        const index = await TrackPlayer.getActiveTrackIndex()
        setQueue(res)
        setTrackIndex(index as number)
        console.log('the current index: ', index)
        scrollRef.current?.scrollTo({x: SCREEN_WIDTH * (index as number)})
    }

    //console.log('THE CURRENT TRACK: ', track)

    const htmlStyle = {
        ul: {
            marginLeft: -15,
        },
        li: {
            marginBottom: 10,
        },
    }

    const baseStyle: MixedStyleDeclaration = {
        fontSize: 16,
        color: 'white',
    }

    return (
        <Flex
            {...props}
            backgroundColor="background0"
            flex={1}
            height={height}
            width={width}
            zIndex="tooltip">
            <Flex
                gap="none"
                height={height + 20}
                style={{backgroundColor: '#042330'}}
                width={width}>
                <Flex
                    borderBottomColor="accentActionSoft"
                    borderBottomWidth={2}
                    flexDirection="row"
                    justifyContent="space-between"
                    px="spacing20"
                    style={{marginTop: 56}}>
                    <TouchableIcon
                        Component={Ionicons}
                        action={onClose}
                        color="white"
                        name="chevron-down-sharp"
                        ripColor="rgba(255,255,255,0.2)"
                        size={24}
                    />

                    <TouchableIcon
                        Component={Ionicons}
                        action={(): void => {}}
                        color="white"
                        name="list-outline"
                        ripColor="rgba(255,255,255,0.2)"
                        size={28}
                    />
                </Flex>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    snapToEnd={false}
                    snapToInterval={SCREEN_WIDTH}
                    onScroll={onScroll}>
                    {queue.length > 0 ? (
                        queue.map((chap, key) => (
                            <>
                                <ScrollView key={key} contentContainerStyle={styles.scrollview}>
                                    <Text color="white" fontWeight="bold" variant="subheadLarge">
                                        {chap?.title}
                                    </Text>
                                    {typeof track !== 'undefined' && (
                                        <RenderHTML
                                            baseStyle={baseStyle}
                                            contentWidth={SCREEN_WIDTH}
                                            source={{html: chap.description as string}}
                                            tagsStyles={htmlStyle}
                                        />
                                    )}
                                </ScrollView>
                            </>
                        ))
                    ) : (
                        <ActivityIndicator color="white" size="large" />
                    )}
                </ScrollView>
                <BottomPlayerItems isReading={isReading} setIsReading={setIsReading} />
            </Flex>
        </Flex>
    )
}

export default LyricView

const styles = StyleSheet.create({
    scrollview: {
        paddingHorizontal: 10,
        paddingTop: 20,
        width: SCREEN_WIDTH,
    },
})
