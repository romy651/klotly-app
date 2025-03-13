/**
 * @Project Summarised
 * @File ListImageLeft.tsx
 * @Path app/components/List
 * @Author BRICE ZELE
 * @Date 20/06/2023
 */
import {BaseButtonProps, TouchableArea} from '../core/Button/TouchableArea'
import Image from '../core/Image/Image'
import {StyleSheet} from 'react-native'
import {Box} from '../layout/Box'
import {Text} from '../core/Text/Text'
import React from 'react'

interface ListImageLeftItemProps {
    image: string
    title: string
}

export type ListImageLeftProps = ListImageLeftItemProps & BaseButtonProps

const ListImageLeft: React.FC<ListImageLeftProps> = ({image, title, ...props}): JSX.Element => (
    <TouchableArea
        {...props}
        alignItems="center"
        backgroundColor="translucentBackground"
        borderRadius="rounded4"
        flexDirection="row">
        <Image source={{uri: image}} style={styles.image} />
        <Box flex={1} paddingHorizontal="spacing6">
            <Text numberOfLines={2} variant="bodyMicro">
                {title}
            </Text>
        </Box>
    </TouchableArea>
)

export default ListImageLeft

const styles = StyleSheet.create({
    image: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        height: 50,
        width: 50,
    },
})
