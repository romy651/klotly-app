/**
 * @Project Summarised
 * @File Player.tsx
 * @Path app/components/Player
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import * as React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Flex, FlexProps} from '../layout/Flex'
import {StyleSheet, useWindowDimensions} from 'react-native'
import {Text} from '../core/Text/Text'
import {Box} from '../layout/Box'
import Image from '../core/Image/Image'
import Slider from '@react-native-community/slider'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {useTranslation} from 'react-i18next'
import BottomPlayerItems from './BottomPlayerItems'
import TouchableIcon from '../core/Button/TouchableIcon'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import TrackPlayer, {Track, useActiveTrack, useIsPlaying} from 'react-native-track-player'
import TextTicker from 'react-native-text-ticker'

interface PlayerProps {
    onPress: () => void
    track: Track
    position_r: number
    duration: number
    buffered: number
    isReading: boolean
    setIsReading: React.Dispatch<React.SetStateAction<boolean>>
}

const Player: React.FC<PlayerProps & FlexProps> = ({
    onPress,
    track,
    position_r,
    duration,
    isReading,
    setIsReading,
    ...props
}): JSX.Element => {
    const theme = useAppTheme()
    const {t} = useTranslation()
    const {width, height} = useWindowDimensions()
    const {playing} = useIsPlaying()

    const formatSeconds = (time: number): string =>
        new Date(time * 1000).toISOString().slice(14, 19)

    const seekBackward = async (): Promise<void> => {
        TrackPlayer.seekBy(-10)
    }

    const seekForward = async (): Promise<void> => {
        TrackPlayer.seekBy(10)
    }

    const skipBack = async (): Promise<void> => {
        TrackPlayer.skipToPrevious()
    }

    const skipNext = async (): Promise<void> => {
        TrackPlayer.skipToNext()
    }

    const key_idea = `${t('key_idea')} ${track.order_no} ${t('of')} ${track.number_of_chapters}`

    const animatedText = React.useMemo(
        () => (
            <Flex>
                <TextTicker bounce={false} scrollSpeed={30}>
                    <Text color="white" fontWeight="bold" textAlign="center" variant="bodyLarge">
                        {`${track.order_no === 0 ? t('Introduction') : key_idea} - ${track.title}`}
                    </Text>
                </TextTicker>
            </Flex>
        ),
        [track],
    )

    return (
        <Flex {...props} backgroundColor="black" height={height} width={width} zIndex="tooltip">
            <Flex
                style={[
                    styles.imageBackground,
                    {width, height: height + 20, backgroundColor: '#042330'},
                ]}>
                <Flex mt="spacing36" padding="spacing20">
                    <Flex flexDirection="row" justifyContent="space-between">
                        <TouchableIcon
                            Component={Ionicons}
                            action={onPress}
                            color="white"
                            name="chevron-down-sharp"
                            ripColor="rgba(255,255,255,0.2)"
                            size={24}
                        />

                        <TouchableIcon
                            Component={MatIcon}
                            action={(): void => {}}
                            color="white"
                            name="playlist-play"
                            ripColor="rgba(255,255,255,0.2)"
                            size={28}
                        />
                    </Flex>
                    <Box alignItems="center" style={{marginTop: -15}}>
                        <Image
                            resizeMode="cover"
                            source={{uri: track.artwork}}
                            style={{
                                height: 300,
                                width: 300 / 1.4518,
                                borderRadius: 5,
                            }}
                        />
                    </Box>
                </Flex>

                <Flex flex={1} px="spacing10" style={{marginTop: 'auto'}}>
                    <Flex flexDirection="column" marginVertical="spacing20" width="100%">
                        {animatedText}
                        <Text
                            color="white"
                            style={{marginTop: -10}}
                            textAlign="center"
                            variant="bodySmall">
                            {`${t('by')} ${track.artist}`}
                        </Text>
                    </Flex>
                    <Slider
                        maximumValue={duration}
                        minimumTrackTintColor="white"
                        minimumValue={0}
                        style={{width: '100%'}}
                        thumbTintColor="white"
                        value={position_r}
                        onSlidingComplete={TrackPlayer.seekTo}
                    />
                    <Flex
                        flexDirection="row"
                        justifyContent="space-between"
                        px="spacing16"
                        style={{marginTop: -15}}>
                        <Text color="white" textAlign="center" variant="bodyMicro">
                            {formatSeconds(position_r)}
                        </Text>
                        <Text color="white" textAlign="center" variant="bodyMicro">
                            {formatSeconds(Math.max(0, duration - position_r))}
                        </Text>
                    </Flex>
                    <Box height={20} />
                    <Flex
                        alignContent="center"
                        flexDirection="row"
                        gap="none"
                        justifyContent="space-evenly"
                        style={{marginTop: 'auto'}}
                        width="100%">
                        <TouchableIcon
                            Component={Ionicons}
                            action={skipBack}
                            color={theme.colors.white}
                            name="ios-play-skip-back"
                            ripColor="rgba(255,255,255,0.2)"
                            size={28}
                        />
                        <TouchableIcon
                            Component={MaterialIcons}
                            action={seekBackward}
                            color={theme.colors.white}
                            name="replay-10"
                            ripColor="rgba(255,255,255,0.2)"
                            size={28}
                        />

                        <Flex style={{marginTop: -20}}>
                            <TouchableIcon
                                Component={Ionicons}
                                action={playing ? TrackPlayer.pause : TrackPlayer.play}
                                color={theme.colors.white}
                                height={85}
                                name={playing ? 'md-pause-circle' : 'md-play-circle'}
                                ripColor="rgba(255,255,255,0.2)"
                                size={80}
                                width={85}
                            />
                        </Flex>
                        <TouchableIcon
                            Component={MaterialIcons}
                            action={seekForward}
                            color={theme.colors.white}
                            name="forward-10"
                            ripColor="rgba(255,255,255,0.2)"
                            size={32}
                        />
                        <TouchableIcon
                            Component={Ionicons}
                            action={skipNext}
                            color={theme.colors.white}
                            name="ios-play-skip-forward"
                            ripColor="rgba(255,255,255,0.2)"
                            size={28}
                        />
                    </Flex>
                    <BottomPlayerItems isReading={isReading} setIsReading={setIsReading} />
                </Flex>
            </Flex>
        </Flex>
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        justifyContent: 'center',
        rezideMode: 'stretch',
    },
})

export default Player
