import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
} from 'react-native-track-player'

export const DefaultRepeatMode = RepeatMode.Queue
export const DefaultAudioServiceBehaviour =
    AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification

export const setupPlayer = async (): Promise<void> => {
    const setup = async (): Promise<string | undefined> => {
        try {
            await TrackPlayer.setupPlayer({waitForBuffer: true})
        } catch (error) {
            console.log('THERE IS AN ERROR: ', error)
            return (error as Error & {code?: string}).code
        }
    }
    while ((await setup()) === 'android_cannot_setup_player_in_background') {
        // A timeout will mostly only execute when the app is in the foreground,
        // and even if we were in the background still, it will reject the promise
        // and we'll try again:
        await new Promise<void>(resolve => setTimeout(resolve, 1000))
        console.log('THERE IS AN ERROR: ')
    }
}

export const SetupService = async (): Promise<void> => {
    await setupPlayer()
    await TrackPlayer.updateOptions({
        android: {
            appKilledPlaybackBehavior: DefaultAudioServiceBehaviour,
        },
        // This flag is now deprecated. Please use the above to define playback mode.
        // stoppingAppPausesPlayback: true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SeekTo,
            Capability.JumpForward,
            Capability.JumpBackward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
        progressUpdateEventInterval: 2,
    })
    await TrackPlayer.setRepeatMode(DefaultRepeatMode)
}
