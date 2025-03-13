/**
 * @Project Summarised
 * @File FullBanner.tsx
 * @Path app/components/Banner
 * @Author BRICE ZELE
 * @Date 01/07/2023
 */
import {ImageBackground, ImageBackgroundProps} from 'react-native'
import React from 'react'
import {Text} from '../core/Text/Text'
import {TouchableArea} from '../core/Button/TouchableArea'
import GradientBackground from '../gradients/GradientBackground'
import {Box} from '../layout/Box'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface FullBannerProps extends ImageBackgroundProps {
    title: string
    description?: string
    onPress: () => void
}

const FullBanner: React.FC<FullBannerProps> = ({
    title,
    description,
    onPress,
    ...props
}): JSX.Element => {
    return (
        <TouchableArea onPress={onPress}>
            <ImageBackground
                {...props}
                borderRadius={10}
                style={[{height: 120, padding: 10, flexDirection: 'row'}, props.style]}>
                <GradientBackground backgroundColor="background60" />
                <Box alignContent="space-between" flex={1} padding="none">
                    <Text color="textOnBrightSecondary" variant="headlineMedium">
                        {title}
                    </Text>
                    <Text color="textOnBrightSecondary" variant="bodySmall">
                        {description}
                    </Text>
                </Box>
                <Box
                    alignContent="center"
                    alignItems="center"
                    backgroundColor="background60"
                    borderRadius="roundedFull"
                    height={40}
                    justifyContent="center"
                    width={40}>
                    <Ionicons
                        name="play"
                        size={25}
                        style={{
                            marginLeft: 2,
                            backgroundColor: 'transparent',
                            color: 'rgba(255, 255, 255, 0.8)',
                            zIndex: 999,
                        }}
                    />
                </Box>
            </ImageBackground>
        </TouchableArea>
    )
}

export default FullBanner
