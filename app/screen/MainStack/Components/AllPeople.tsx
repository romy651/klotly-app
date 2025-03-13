import {SCREEN_WIDTH} from '@gorhom/bottom-sheet'
import {Flex} from 'app/components/layout/Flex'
import React, {useEffect, useState} from 'react'
import {StyleSheet} from 'react-native'
import {Tabs} from 'react-native-collapsible-tab-view'
import UserItem from './UserItem'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {UserInfo} from 'app/redux/user/userReducer'
import firestore from '@react-native-firebase/firestore'

const AllPeople = () => {
    const me = useAppSelector(state => state.user)
    const [users, setUsers] = useState<UserInfo[]>([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const usersCollection = await firestore()
                .collection('users')
                .where('id', '!=', me.id)
                .get()
            const usersData = usersCollection.docs.map(doc => doc.data() as UserInfo)
            //console.log('Users:', usersData)
            setUsers(usersData)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const renderItem = ({item, index}: {item: any; index: number}) => (
        <Flex style={{...styles.itemView, marginRight: index % 2 == 1 ? 0 : 4}}>
            <UserItem user={item} />
        </Flex>
    )

    return (
        <Flex paddingHorizontal={'spacing4'}>
            <Tabs.FlatList
                data={users}
                numColumns={2}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </Flex>
    )
}

export default AllPeople

const styles = StyleSheet.create({
    itemView: {
        width: (SCREEN_WIDTH - 12) / 2,
        height: (2 * SCREEN_WIDTH) / 3,
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 4,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
})
