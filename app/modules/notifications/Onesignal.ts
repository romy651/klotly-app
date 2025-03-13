/**
 * @Project Summarised
 * @File Onesignal.ts
 * @Path app/modules/notifications
 * @Author BRICE ZELE
 * @Date 10/04/2023
 */

//TODO Onesignal not configured yet

// @ts-ignore
export const getOneSignalUserIdOrError = async (): Promise<string> => {
    /*    const onesignalUserId = (await OneSignal.getDeviceState())?.userId
    if (!onesignalUserId) throw new Error('Onesignal user ID is not defined')
    return onesignalUserId*/
}

export const initOneSignal = (): void => {
    /*    OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId('' + Config.onesignalAppId)

    OneSignal.setNotificationWillShowInForegroundHandler(
        async (event: NotificationReceivedEvent) => {
            try {
                // Log to Sentry when a push notification is received while app is open.
                // Used to debug users reporting not receiving notifications.
                const pushId = await getOneSignalUserIdOrError()
                Logger.info(
                    'Onesignal',
                    'NotificationWillShowInForeground',
                    `${pushId} received notification while app is open: ${
                        event.getNotification().body
                    }`,
                )
            } catch (error) {
                Logger.error('Onesignal', 'NotificationWillShowInForeground', 'Error:', error)
            }

            // Complete with undefined means don't show OS notifications while app is in foreground
            event.complete()
        },
    )

    OneSignal.setNotificationOpenedHandler((event: OpenedEvent) => {
        Logger.debug(
            'Onesignal',
            'setNotificationOpenedHandler',
            `Notification opened: ${event.notification}`,
        )

        // This emits an url event when coldStart = false. Don't call openURI because that will
        // send the user to Safari to open the universal link. When coldStart = true, OneSignal
        // handles the url event and navigates correctly.
        if (event.notification.launchURL) {
            Linking.emit('url', {url: event.notification.launchURL})
        }
    })*/
}
/*
export const promptPushPermission = (
successCallback?: () => void,
failureCallback?: () => void,
): void => {
OneSignal.promptForPushNotificationsWithUserResponse(response => {
    Logger.debug(
        'Onesignal',
        'promptForPushNotificationsWithUserResponse',
        `Prompt response: ${response}`,
    )
    if (response) {
        successCallback?.()
    } else {
        failureCallback?.()
    }
})
}
*/
