import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import * as React from 'react'
import {useAppSelector} from 'app/hooks/state/useAppSelector'
import {UserInfo} from 'app/redux/user/userReducer'
import {countryToLanguage} from 'app/constants/languages'
import {Booking} from './useBooking'
import moment from 'moment'
import {convertTimezone} from 'app/utils/tools'

//firestore.FieldValue.serverTimestamp()

const playLink = ''

const appLink = ''

export type Notif = {
    id: number
    userId: string
    type: string
    type2: 'follow' | 'gift' | 'verif_notif' | 'message'
    message: string
    from: {
        id: string
        username: string
    }
    createdAt: FirebaseFirestoreTypes.FieldValue
    metadata?: string
    seen: boolean
}

export const useEmail = () => {
    const me = useAppSelector(state => state.user)

    React.useEffect(() => {}, [])

    const sendMessage = async (message: string, targetUser: UserInfo) => {
        const req = firestore()
        const target_language = countryToLanguage[targetUser.country] as string
        const template_lg = ['en', 'fr'].includes(target_language)
            ? `message_${target_language}`
            : 'message_en'
        const data = {
            from: me.firstName,
            target: targetUser.firstName,
            message: truncateString(message),
            email: targetUser.email,
            image: me.avatar,
            playLink,
            appLink,
        }
        await req.collection('mail').add({
            to: targetUser.email,
            template: {
                name: template_lg,
                data,
            },
        })
    }

    const notifyBookingCreation = async (me: UserInfo, tutor: UserInfo, booking: Booking) => {
        console.log('NOW WE PUSH THE EMAIL')
        const req = firestore()
        //we send to me
        const myLanguage = countryToLanguage[me.country] as string
        const time = convertTimezone(
            [booking.time],
            booking.date,
            booking.timeZone,
            me.timeZone,
        )[0] as string
        const date = `${moment(booking.date).format('ll')} - ${time}`
        const template_lg = ['en'].includes(myLanguage)
            ? `confirmation_student_${myLanguage}`
            : 'confirmation_student_en'
        const data = {
            tutor: tutor.firstName,
            date,
            student: me.firstName,
            email: me.email,
            image: tutor.avatar,
            topic: booking.topic,
            playLink,
            appLink,
        }
        await req.collection('mail').add({
            to: me.email,
            template: {
                name: 'confirmation_student_en',
                data,
            },
        })
        // we send to the tutor
        const t_date = `${booking.date} - ${booking.time}`
        const t_language = countryToLanguage[tutor.country] as string
        const t_template_lg = ['en'].includes(t_language)
            ? `confirmation_tutor_${t_language}`
            : 'confirmation_tutor_en'
        const t_data = {
            tutor: tutor.firstName,
            date: t_date,
            student: me.firstName,
            email: tutor.email,
            topic: booking.topic,
            image: me.avatar,
            playLink,
            appLink,
        }
        await req.collection('mail').add({
            to: tutor.email,
            template: {
                name: 'confirmation_tutor_en',
                data: t_data,
            },
        })
    }

    const truncateString = (str: string) => {
        if (str.length > 100) {
            return str.slice(0, 100 - 3) + '...'
        }
        return str
    }

    return {
        sendMessage,
        notifyBookingCreation,
    }
}
