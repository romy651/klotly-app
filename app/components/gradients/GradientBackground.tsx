/**
 * @Project Summarised
 * @File GradientBackground.tsx
 * @Path app/components/gradients
 * @Author BRICE ZELE
 * @Date 10/04/2023
 */
import React, {PropsWithChildren} from 'react'
import {Box, BoxProps} from '../layout/Box'

// Fills up entire parent by default
const GradientBackground: React.FC<PropsWithChildren<BoxProps>> = ({
    children,
    ...rest
}): JSX.Element => {
    return (
        <Box
            bottom={0}
            left={0}
            position="absolute"
            right={0}
            top={0}
            zIndex="background"
            {...rest}>
            {children}
        </Box>
    )
}

export default GradientBackground
