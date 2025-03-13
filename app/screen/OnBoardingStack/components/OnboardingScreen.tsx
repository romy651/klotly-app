/**
 * @Project Summarised
 * @File OnboardingScreen.tsx
 * @Path app/screen/OnBoardingStack/components
 * @Author BRICE ZELE
 * @Date 29/03/2023
 */
import {Theme} from '../../../themes/Theme'
import React from 'react'
import {useHeaderHeight} from '@react-navigation/elements'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useResponsiveProp} from '@shopify/restyle'
import {ScrollView, StyleSheet} from 'react-native'
import {AnimatedFlex, Flex} from '../../../components/layout/Flex'
import {FadeInUp} from 'react-native-reanimated'
import {Text} from '../../../components/core/Text/Text'
import {Screen} from '../../../components/layout/Screen'

type OnboardingContainerProps = {
    subtitle?: string
    title?: string
    enableScroll?: boolean
    paddingTop?: keyof Theme['spacing']
    childrenGap?: keyof Theme['spacing']
    content: JSX.Element
    footer?: JSX.Element | null
}

const OnboardingScreen: React.FC<OnboardingContainerProps> = ({
    title,
    subtitle,
    content,
    enableScroll = true,
    footer,
    paddingTop = 'none',
}): JSX.Element => {
    const headerHeight = useHeaderHeight()
    const insets = useSafeAreaInsets()

    const subtitleMaxFontScaleMultiplier = useResponsiveProp({
        phone: 1.1,
    })

    const titleSize = useResponsiveProp({
        phone: 'subheadLarge',
        longPhone: 'headlineSmall',
    })

    const subtitleSize = useResponsiveProp({
        phone: 'bodySmall',
        longPhone: 'bodyLarge',
    })

    const responsiveHeaderHeight = useResponsiveProp({
        phone: headerHeight * 0.88,
        longPhone: headerHeight,
    })

    return (
        <Screen edges={['right', 'left', 'bottom']} style={{paddingTop: responsiveHeaderHeight}}>
            <Flex mb={'spacing80'} flex={1} px="spacing16">
                <AnimatedFlex
                    entering={FadeInUp.delay(400).duration(200).springify()}
                    gap="spacing12"
                    mt="spacing12">
                    {title && (
                        <Text
                            allowFontScaling={false}
                            paddingTop={paddingTop}
                            textAlign="left"
                            fontWeight={'bold'}
                            variant={titleSize}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text
                            textAlign="left"
                            color="textSecondary"
                            maxFontSizeMultiplier={subtitleMaxFontScaleMultiplier}
                            variant={subtitleSize}>
                            {subtitle}
                        </Text>
                    )}
                </AnimatedFlex>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    scrollEnabled={enableScroll}>
                    <Flex grow justifyContent="space-between">
                        {content}
                    </Flex>
                </ScrollView>
            </Flex>
            <Flex
                bottom={insets.bottom}
                left={insets.left}
                position="absolute"
                px="spacing16"
                right={insets.right}>
                {footer}
            </Flex>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
})

export default OnboardingScreen
