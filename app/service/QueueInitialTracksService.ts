import {store} from 'app/store'
import TrackPlayer from 'react-native-track-player'

export const QueueInitialTracksService = async (): Promise<void> => {
    const bookInfo = store.getState().application.currentTrack
    console.log('THE CURRENT TRACK: ', bookInfo)
    if (bookInfo) {
        await TrackPlayer.add([...bookInfo.album], bookInfo.index)
        TrackPlayer.seekTo(bookInfo.position)
    }
}
