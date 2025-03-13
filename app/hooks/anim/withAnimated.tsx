/**
 * @Project Summarised
 * @File withAnimated.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 16/03/2023
 */
import React, {ComponentClass} from 'react'
import Animated, {AnimateProps} from 'react-native-reanimated'

export function withAnimated(
    WrappedComponent: React.ComponentType<any>,
): ComponentClass<AnimateProps<any>> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

    class WithAnimated extends React.Component {
        static displayName = `WithAnimated(${displayName})`

        render(): React.ReactNode {
            return <WrappedComponent {...this.props} />
        }
    }

    return Animated.createAnimatedComponent(WithAnimated)
}
