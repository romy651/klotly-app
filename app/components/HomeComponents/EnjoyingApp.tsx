import {StyleSheet} from 'react-native'
import React from 'react'
import {AnimatedFlex, Flex} from '../layout/Flex'
import {Text} from '../core/Text/Text'
import {Button, ButtonEmphasis, ButtonSize} from '../core/Button/Button'
import useDarkMode from 'app/hooks/theme/useDarkMode'
import {useResponsiveProp} from '@shopify/restyle'
import {useTranslation} from 'react-i18next'

const EnjoyingApp = () => {
    const isDarkMode = useDarkMode()
    const buttonSize = useResponsiveProp({
        phone: ButtonSize.Medium,
        tablet: ButtonSize.Large,
    })
    const {t} = useTranslation()
    return (
        <Flex
            width={'100%'}
            mt={'spacing48'}
            mb={'spacing70'}
            backgroundColor={'background3'}
            alignItems={'center'}
            justifyContent={'center'}
            pt={'spacing14'}>
            <Text variant={'bodyLarge'} color={'userThemeSlate'}>
                Enjoying Summarised?
            </Text>
            <AnimatedFlex height={50} mb={'spacing20'} justifyContent="flex-end">
                <Button
                    backgroundColor={isDarkMode ? 'translucentBackground' : 'black'}
                    emphasis={isDarkMode ? ButtonEmphasis.Secondary : ButtonEmphasis.Primary}
                    size={buttonSize}
                    style={{borderRadius: 8, width: 250}}
                    onPress={() => {}}>
                    {t('Share with a friend')}
                </Button>
            </AnimatedFlex>
        </Flex>
    )
}

export default EnjoyingApp

const styles = StyleSheet.create({})
