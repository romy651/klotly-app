/**
 * @Project Summarised
 * @File CategoryGrid.tsx
 * @Path app/components/Category
 * @Author BRICE ZELE
 * @Date 01/07/2023
 */
import {BaseButtonProps, TouchableArea} from '../core/Button/TouchableArea'
import {ImageRequireSource, StyleProp} from 'react-native'
import {ImageStyle, Source} from 'react-native-fast-image'
import React from 'react'
import {Text} from '../core/Text/Text'
import Image from '../core/Image/Image'
import {Box} from '../layout/Box'

interface CategoryGridProps extends BaseButtonProps {
    image: Source | ImageRequireSource
    title: string
    author: string
    imageStyle?: StyleProp<ImageStyle>
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
    image,
    title,
    author,
    imageStyle = {},
    ...props
}): JSX.Element => {
    return (
        <TouchableArea {...props} style={[{flex: 1}, props.style]}>
            <Box flex={1} flexDirection="column" rowGap="spacing4">
                <Image
                    source={image}
                    style={[{height: 150, width: '100%', borderRadius: 10}, imageStyle]}
                />
                <Text fontWeight="800" numberOfLines={2} variant="bodyLarge">
                    {title}
                </Text>
                <Text numberOfLines={2} variant="bodyMicro">
                    {author}
                </Text>
            </Box>
        </TouchableArea>
    )
}

export default CategoryGrid
