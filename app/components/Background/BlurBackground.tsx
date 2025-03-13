/**
 * @Project Summarised
 * @File BlurBackground.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 28/05/2023
 */
import * as React from 'react'
import {memo} from 'react'
import {View} from 'react-native'
import {BlurView} from '@react-native-community/blur'
import {BlurViewProps} from '@react-native-community/blur/src'
import useDarkMode from '../../hooks/theme/useDarkMode'

const BlurBackground: React.FC<
    React.PropsWithChildren<BlurViewProps & React.RefAttributes<View>>
> = ({children, ...props}): JSX.Element => {
    const isDarkMode = useDarkMode()
    return (
        <BlurView
            {...props}
            blurAmount={10}
            blurRadius={25}
            blurType={isDarkMode ? 'dark' : 'xlight'}
            overlayColor="transparent"
            style={props.style}>
            {children}
        </BlurView>
    )
}

export default memo(BlurBackground)
