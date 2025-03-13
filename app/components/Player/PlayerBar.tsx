/**
 * @Project Summarised
 * @File PlayerBar.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import * as React from 'react'
import {ActivityIndicator} from 'react-native'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import {BaseButtonProps, TouchableArea} from '../core/Button/TouchableArea'
import {Text} from '../core/Text/Text'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useResponsiveProp} from '@shopify/restyle'
import {Box} from '../layout/Box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextTicker from 'react-native-text-ticker'
import Image from '../core/Image/Image'
//import {Source} from 'react-native-fast-image'
import TouchableIcon from '../core/Button/TouchableIcon'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import TrackPlayer, {Track, useIsPlaying} from 'react-native-track-player'
import {Flex} from '../layout/Flex'
import AnimatedBar from './AnimatedBar'
import {useTranslation} from 'react-i18next'
export const PLAYER_BAR_HEIGHT = 60

type Prop = {
    track: Track
    position_r: number
    duration: number
}

const PlayerBar: React.FC<BaseButtonProps & Prop> = ({
    track,
    position_r,
    duration,
    ...props
}): JSX.Element => {
    const theme = useAppTheme()
    const {t} = useTranslation()
    const iconSize = useResponsiveProp({
        phone: theme.iconSizes.icon20,
        longPhone: theme.iconSizes.icon28,
    })
    const {playing, bufferingDuringPlay} = useIsPlaying()

    const seekBackward = async (): Promise<void> => {
        TrackPlayer.seekBy(-10)
    }

    const key_idea = `${t('key_idea')} ${track.order_no} ${t('of')} ${track.number_of_chapters}`

    const title = React.useMemo(() => {
        return (
            <TextTicker bounce={false} scrollSpeed={50}>
                <Text color="white" marginVertical="none" variant="buttonLabelSmall">
                    {`${track.order_no === 0 ? t('Introduction') : key_idea} - ${track.title}`}
                </Text>
            </TextTicker>
        )
    }, [track])

    return (
        <>
            <TouchableArea
                {...props}
                activeOpacity={0.9}
                alignItems="center"
                columnGap="spacing2"
                elevation={4}
                flexDirection="row"
                height={PLAYER_BAR_HEIGHT}
                paddingHorizontal="spacing8"
                paddingVertical="spacing8"
                style={{
                    backgroundColor: '#042330',
                    borderBottomColor: '#4a4a4a',
                    borderBottomWidth: 1,
                }}
                width="100%">
                <Flex flex={2} flexDirection="row">
                    <Box
                        alignContent="center"
                        elevation={0}
                        flexDirection="column"
                        justifyContent="space-between"
                        paddingLeft="spacing6"
                        paddingRight="spacing1"
                        paddingVertical="spacing6">
                        <Image
                            resizeMode="cover"
                            source={{uri: track.artwork}}
                            style={{
                                height: 28 * 1.4518,
                                width: 28,
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                    <Box
                        flexDirection="column"
                        justifyContent="center"
                        marginHorizontal="spacing1"
                        paddingVertical="spacing1"
                        width={SCREEN_WIDTH - 180}>
                        <Text
                            color="white"
                            fontWeight="bold"
                            marginVertical="none"
                            mb="spacing4"
                            numberOfLines={1}
                            variant="bodyMicro">
                            {track.artist}
                        </Text>
                        {title}
                    </Box>
                </Flex>
                {!bufferingDuringPlay ? (
                    <Flex
                        alignItems="center"
                        flex={1}
                        flexDirection="row"
                        justifyContent="flex-end">
                        <TouchableIcon
                            Component={MaterialIcons}
                            action={seekBackward}
                            color="white"
                            name="replay-10"
                            ripColor="rgba(255,255,255,0.2)"
                            size={iconSize as number}
                        />
                        <TouchableIcon
                            Component={Ionicons}
                            action={playing ? TrackPlayer.pause : TrackPlayer.play}
                            color="white"
                            name={playing ? 'pause' : 'play'}
                            ripColor="rgba(255,255,255,0.2)"
                            size={iconSize as number}
                        />
                    </Flex>
                ) : (
                    <ActivityIndicator color="white" size="small" />
                )}
            </TouchableArea>
            <AnimatedBar bottom={0} color="white" duration={duration} position={position_r} />
        </>
    )
}

export default PlayerBar
