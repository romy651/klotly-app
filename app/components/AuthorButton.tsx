/**
 * @Project Summarised
 * @File AuthorButton.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 08/04/2023
 */
import React from 'react'
import {useAppTheme} from '../hooks/theme/useAppTheme'
import {useResponsiveProp} from '@shopify/restyle'
import {TouchableArea} from './core/Button/TouchableArea'
import {Text} from './core/Text/Text'
import {Flex} from './layout/Flex'
import Image from './core/Image/Image'
import Ionicons from 'react-native-vector-icons/Ionicons'

export interface AuthorButtonProps {
    name: string
    picture?: string
    onPress: () => void
    selected?: boolean
}

const IMAGE_WIDTH = 100

const AuthorButton: React.FC<AuthorButtonProps> = ({
    name,
    picture,
    onPress,
    selected = false,
}): JSX.Element => {
    const theme = useAppTheme()

    const iconSize = useResponsiveProp({
        phone: theme.iconSizes.icon20,
        longPhone: theme.iconSizes.icon28,
    })

    return (
        <Flex fill mb="spacing20">
            <TouchableArea alignItems="center" onPress={onPress}>
                {selected && (
                    <Flex
                        alignItems="center"
                        backgroundColor="translucentThemeColor"
                        borderRadius="roundedFull"
                        height={IMAGE_WIDTH}
                        justifyContent="center"
                        position="absolute"
                        top={8}
                        width={IMAGE_WIDTH}
                        zIndex="dropdown">
                        <Ionicons
                            color={theme.colors.white}
                            name="checkmark-circle-sharp"
                            size={iconSize}
                        />
                    </Flex>
                )}
                <Flex
                    grow
                    borderColor={selected ? 'userThemeColor' : 'none'}
                    borderRadius="roundedFull"
                    borderWidth={3}
                    mb="spacing8"
                    p="spacing4">
                    <Image
                        source={{uri: picture}}
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH,
                            borderRadius: IMAGE_WIDTH / 2,
                        }}
                    />
                </Flex>
                <Text color={selected ? 'userThemeColor' : 'textPrimary'} variant="bodySmall">
                    {name}
                </Text>
            </TouchableArea>
        </Flex>
    )
}

export default AuthorButton
