import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Flex} from 'app/components/layout/Flex'
import {Screen} from 'app/components/layout/Screen'
import InstagramStories from 'app/components/StoryView'
import {AppStackParamList} from 'app/routes/screens/Screens.types'
import {Stack} from 'app/routes/screens/Stack'
import React from 'react'

type Props = NativeStackScreenProps<AppStackParamList, Stack.StoryScreen>

const StoryScreen: React.FC<Props> = ({navigation, route}): JSX.Element => {
    const story = route.params.story
    return (
        <Screen edges={['top']} flex={1}>
            <InstagramStories animationDuration={1} stories={[story]} />
        </Screen>
    )
}

export default StoryScreen
