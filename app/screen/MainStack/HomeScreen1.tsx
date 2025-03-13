/**
 * @Project Summarised
 * @File HomeScreen1.tsx
 * @Path app/screen/MainStack
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {BottomTabsStackParamList} from '../../routes/screens/Screens.types'
import {BottomTabsScreens} from '../../routes/screens/Stack'
import * as React from 'react'
import GradientBackground from '../../components/gradients/GradientBackground'
import {ThemedGradient} from '../../components/gradients/ThemedGradient'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import CenterBox from '../../components/layout/CenterBox'
import {Text} from '../../components/core/Text/Text'
import {Screen} from '../../components/layout/Screen'
import {ScrollView} from 'react-native'
import Image from '../../components/core/Image/Image'

type Props = NativeStackScreenProps<BottomTabsStackParamList, BottomTabsScreens.HomeScreen1>

const HomeScreen1: React.FC<Props> = (): JSX.Element => {
    const isDarkMode = useDarkMode()
    const theme = useAppTheme()

    return (
        <>
            <GradientBackground>
                <ThemedGradient
                    gradientEndColor={theme.colors.userThemeColor}
                    gradientStartColor={theme.colors.background0}
                    opacity={isDarkMode ? 0.3 : 0.2}
                />
            </GradientBackground>
            <Screen edges={['bottom', 'left', 'right', 'top']}>
                <CenterBox>
                    <Text variant="headlineLarge">Home</Text>
                    <ScrollView contentContainerStyle={{flex: 1}}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
                            }}
                            style={{width: 800, height: 300}}
                        />
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
                            }}
                            style={{width: 1024, height: 300}}
                        />
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
                            }}
                            style={{width: 1024, height: 300}}
                        />
                    </ScrollView>
                </CenterBox>
            </Screen>
        </>
    )
}

export default HomeScreen1
