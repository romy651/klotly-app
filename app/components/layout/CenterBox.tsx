/**
 * @Project Summarised
 * @File CenterBox.tsx
 * @Path app/components/layout
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */

import React from 'react'
import {ViewProps} from 'react-native'
import {Box, BoxProps} from './Box'

const CenterBox: React.FC<BoxProps & ViewProps> = (props): JSX.Element => {
    return <Box alignItems="center" justifyContent="center" {...props} />
}

export default CenterBox
