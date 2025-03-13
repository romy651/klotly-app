/**
 * @Project Summarised
 * @File NavigationContainer.tsx
 * @Path app/navigation
 * @Author BRICE ZELE
 * @Date 19/03/2023
 */
import {
    createNavigationContainerRef,
    DefaultTheme,
    NavigationContainer as NativeNavigationContainer,
    NavigationContainerRefWithCurrent,
} from '@react-navigation/native'
import React, {PropsWithChildren, useState} from 'react'
import analytics from '@react-native-firebase/analytics'
import {useAppTheme} from '../hooks/theme/useAppTheme'
import {AppScreen} from '../routes/screens/Stack'
import useDarkMode from '../hooks/theme/useDarkMode'

interface NavigationContainerProps {
    onReady: (
        // eslint-disable-next-line no-undef
        navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
    ) => void
}

export const navigationRef = createNavigationContainerRef()

const NavigationContainer: React.FC<PropsWithChildren<NavigationContainerProps>> = ({
    children,
    onReady,
}) => {
    const theme = useAppTheme()
    const isDarkMode = useDarkMode()
    const [routeName, setRouteName] = useState<AppScreen>()

    return (
        <NativeNavigationContainer
            ref={navigationRef}
            theme={{
                dark: isDarkMode,
                colors: {
                    ...DefaultTheme.colors,
                    background: theme.colors.background0,
                    text: theme.colors.textPrimary,
                    primary: theme.colors.userThemeColor,
                },
            }}
            onReady={(): void => {
                onReady(navigationRef)
                const initialRoute = navigationRef.getCurrentRoute()?.name as AppScreen
                setRouteName(initialRoute)
            }}
            onStateChange={async (): Promise<void> => {
                const previousRouteName = routeName
                const currentRouteName: AppScreen = navigationRef.getCurrentRoute()
                    ?.name as AppScreen

                if (previousRouteName !== currentRouteName) {
                    setRouteName(currentRouteName)
                }
            }}>
            {children}
        </NativeNavigationContainer>
    )
}

export default NavigationContainer
