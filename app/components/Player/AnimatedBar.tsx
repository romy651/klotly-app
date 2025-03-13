import * as React from 'react'
import {AnimatedFlex} from '../layout/Flex'
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {useSharedValue, withTiming} from 'react-native-reanimated'

type Prop = {
    position: number
    duration: number
    top?: number
    bottom?: number
    color: string
}

const AnimatedBar: React.FC<Prop> = ({duration, position, top, bottom, color}): JSX.Element => {
    const translateX = useSharedValue<number>(0)

    React.useEffect(() => {
        translateX.value = withTiming(-SCREEN_WIDTH + (SCREEN_WIDTH * position) / duration)
    }, [position])

    return (
        <AnimatedFlex
            bottom={bottom}
            height={2}
            position="absolute"
            style={{transform: [{translateX}], backgroundColor: color}}
            top={top}
            width={SCREEN_WIDTH}
        />
    )
}

export default React.memo(AnimatedBar)
