import {QueueInitialTracksService, SetupService} from 'app/service'
import {useState, useEffect} from 'react'
import TrackPlayer from 'react-native-track-player'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useSetupPlayer() {
    const [playerReady, setPlayerReady] = useState<boolean>(false)

    useEffect(() => {
        let unmounted = false
        ;(async (): Promise<void> => {
            await SetupService()
            if (unmounted) return
            setPlayerReady(true)
            const queue = await TrackPlayer.getQueue()
            if (unmounted) return
            if (queue.length <= 0) {
                await QueueInitialTracksService()
            }
        })()
        return (): any => {
            unmounted = true
        }
    }, [])
    return playerReady
}
