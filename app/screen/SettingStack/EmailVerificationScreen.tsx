import {NativeStackScreenProps} from '@react-navigation/native-stack'
import TouchableIcon from 'app/components/core/Button/TouchableIcon'
import {Text} from 'app/components/core/Text/Text'
import {Flex} from 'app/components/layout/Flex'
import {Screen} from 'app/components/layout/Screen'
import {useAppTheme} from 'app/hooks/theme/useAppTheme'
import {AppStackParamList} from 'app/routes/screens/Screens.types'
import {Stack} from 'app/routes/screens/Stack'
import React, {useCallback, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {View, StyleSheet, FlatList, Platform, UIManager} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {UserInfo} from 'app/redux/user/userReducer'
import UserBlockedItem from 'app/components/UserMessageItem/UserBlockedItem'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = NativeStackScreenProps<AppStackParamList, Stack.EmailVerificationScreen>

const EmailVerificationScreen: React.FC<Props> = ({navigation}): JSX.Element => {
    const theme = useAppTheme()
    const {t} = useTranslation()

    useEffect(() => {}, [])

    return (
        <Screen edges={['top']}>
            <View style={{...styles.headerView, borderBottomColor: theme.colors.background2}}>
                <TouchableIcon
                    Component={Ionicon}
                    name="chevron-back"
                    size={24}
                    color={theme.colors.textPrimary}
                    action={navigation.goBack}
                    style={styles.backButton}
                />
                <Flex flexDirection={'row'}>
                    <Text
                        textTransform={'capitalize'}
                        fontWeight={'bold'}
                        variant={'buttonLabelMedium'}
                        color={'textPrimary'}>
                        {t('email_verification')}
                    </Text>
                </Flex>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    loadingFlex: {
        height: SCREEN_HEIGHT - 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerView: {
        width: '100%',
        height: 53,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    touchable_item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingRight: 10,
        paddingLeft: 15,
    },
    saveButton: {
        position: 'absolute',
        right: 10,
    },
})

export default EmailVerificationScreen
