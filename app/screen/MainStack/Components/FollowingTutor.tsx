import {Flex} from 'app/components/layout/Flex'
import React, {useCallback, useEffect, useState} from 'react'
import {Tabs} from 'react-native-collapsible-tab-view'
import {UserInfo} from 'app/redux/user/userReducer'
import TutorItem from './TutorItem'
import firestore from '@react-native-firebase/firestore'
import {Button, ButtonEmphasis, ButtonSize} from 'app/components/core/Button/Button'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/core'
import {Text} from 'app/components/core/Text/Text'
import {useUser} from 'app/hooks/useUser'
import {LayoutAnimation, Platform, UIManager} from 'react-native'

type Props = {
    onBack: () => void
}

const FollowingTutor = ({onBack}: Props): React.JSX.Element => {
    const [tutors, setTutors] = useState<UserInfo[]>([])
    const {user} = useUser()
    const {t} = useTranslation()
    const navigation = useNavigation<any>()

    const renderItems = ({item}: {item: UserInfo}) => {
        return <TutorItem user={item} />
    }

    React.useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
    }, [])

    useEffect(() => {
        ;(async () => {
            const rq = await firestore()
                .collection('users')
                .where('id', 'in', user.following)
                .where('isTutor', '==', true)
                .get()
            const data = rq.docs.map(_ => _.data() as UserInfo).filter(_ => _.id !== user.id)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setTutors(data)
        })()
    }, [user.following])

    const footerComponent = useCallback(
        () => (
            <Flex pt={'spacing10'} px={'spacing20'} width="100%">
                <Button
                    backgroundColor={'accentActive'}
                    emphasis={ButtonEmphasis.Outline}
                    size={ButtonSize.Medium}
                    style={{borderRadius: 10}}
                    onPress={onBack}>
                    {t('find_tutor')}
                </Button>
            </Flex>
        ),
        [],
    )

    return (
        <Flex style={{marginLeft: -5}} paddingHorizontal={'spacing4'}>
            {tutors.length == 0 ? (
                <Tabs.ScrollView>
                    <Flex
                        paddingVertical={'spacing16'}
                        backgroundColor={'accentSuccessSoft'}
                        px={'spacing10'}
                        mt={'spacing24'}>
                        <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                            {t('following_empty')}
                        </Text>
                        <Text variant={'bodySmall'} color={'textSecondary'}>
                            {t('following_empty_desc')}
                        </Text>
                        {footerComponent()}
                    </Flex>
                </Tabs.ScrollView>
            ) : (
                <Tabs.FlatList
                    data={tutors}
                    contentContainerStyle={{paddingBottom: 200}}
                    numColumns={1}
                    renderItem={renderItems}
                    keyExtractor={item => item.id}
                />
            )}
        </Flex>
    )
}

export default FollowingTutor
