import {changeCurrentTrackIndex} from 'app/redux/config/config.reducer'
import {store} from 'app/store'
import TrackPlayer, {Event} from 'react-native-track-player'

export async function PlaybackService(): Promise<void> {
    TrackPlayer.addEventListener(Event.RemotePause, () => {
        console.log('Event.RemotePause')
        TrackPlayer.pause()
    })

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        console.log('Event.RemotePlay')
        TrackPlayer.play()
    })

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        console.log('Event.RemoteNext')
        TrackPlayer.skipToNext()
    })

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        console.log('Event.RemotePrevious')
        TrackPlayer.skipToPrevious()
    })

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
        console.log('Event.RemoteJumpForward', event)
        TrackPlayer.seekBy(event.interval)
    })

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
        console.log('Event.RemoteJumpBackward', event)
        TrackPlayer.seekBy(-event.interval)
    })

    TrackPlayer.addEventListener(Event.RemoteSeek, event => {
        console.log('Event.RemoteSeek', event)
        TrackPlayer.seekTo(event.position)
    })

    TrackPlayer.addEventListener(Event.RemoteDuck, async event => {
        console.log('Event.RemoteDuck', event)
    })

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, event => {
        console.log('Event.PlaybackQueueEnded', event)
    })

    TrackPlayer.addEventListener(Event.PlaybackState, event => {
        console.log('Event.PlaybackState', event)
    })
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, event => {
        console.log('Event.PlaybackState', event.index)
        store.dispatch(changeCurrentTrackIndex(event.index as number))
    })
}
