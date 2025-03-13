/**
 * @Project Summarised
 * @File SwipeCard.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 09/04/2023
 */
import React from 'react'
import {Flex} from '../layout/Flex'
import {useWindowDimensions} from 'react-native'
import Image from '../core/Image/Image'

export interface SwipeCardProps {
    title?: string
    picture?: string
}

const SwipeCard: React.FC<SwipeCardProps> = ({picture}): JSX.Element => {
    const {height} = useWindowDimensions()

    return (
        <Flex
            borderRadius="rounded12"
            height={height - 350}
            justifyContent="center"
            alignItems={'center'}
            width="91%">
            <Image
                resizeMode="cover"
                source={picture}
                style={{borderRadius: 12, height: 300 * 1.4816, width: 300}}
            />
            {/*            <Flex
                alignItems="flex-start"
                bottom={10}
                flexDirection="column"
                justifyContent="flex-end"
                left={10}
                position="absolute">
                <Text
                    color="white"
                    textAlign="center"
                    textShadowColor="black"
                    textShadowRadius={10}
                    variant={titleSize}>
                    {title}
                </Text>
            </Flex>*/}
        </Flex>
    )
}

export default SwipeCard
