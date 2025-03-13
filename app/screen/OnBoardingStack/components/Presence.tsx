/**
 * @Project Summarised
 * @File Presence.tsx
 * @Path app/screen/OnBoardingStack/components
 * @Author BRICE ZELE
 * @Date 28/04/2023
 */
import React, {ComponentProps, PropsWithChildren} from 'react'
import {MotiView} from 'moti'

interface PresenceProps {
    index: number
    style?: ComponentProps<typeof MotiView>['style']
}

const presenceAnimation: ComponentProps<typeof MotiView> = {
    from: {
        opacity: 0,
        translateY: 4,
    },
    animate: {
        opacity: 1,
        translateY: 0,
    },
    exit: {
        opacity: 0,
        translateY: 0,
    },
}

const Presence: React.FC<PropsWithChildren<PresenceProps>> = ({
    index,
    style,
    children,
}): JSX.Element => (
    <MotiView delay={index * 40} {...presenceAnimation} style={style}>
        {children}
    </MotiView>
)

export default Presence
