/**
 * @Project Summarised
 * @File modal.reducer.ts
 * @Path app/redux/ModalStack
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import {ModalName} from '../../routes/modals/Modals'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {getKeys} from '../../utils/objects'
import {RootState} from '../rootReducer'
import {trigger} from 'react-native-haptic-feedback'

export interface AppModalState<T> {
    isOpen: boolean
    initialState?: T
}

type PlanModalParams = {name: ModalName.Plan; initialState?: undefined}

export type OpenModalParams = PlanModalParams

export interface ModalsState {
    [ModalName.Plan]: AppModalState<undefined>
}

export const initialModalState: ModalsState = {
    [ModalName.Plan]: {
        isOpen: false,
        initialState: undefined,
    },
}

const modalSlice = createSlice({
    name: 'modals',
    initialState: initialModalState,
    reducers: {
        openModal: (state, action: PayloadAction<OpenModalParams>) => {
            trigger('impactMedium')
            const {name, initialState} = action.payload
            state[name].isOpen = true
            state[name].initialState = initialState
        },
        closeModal: (state, action: PayloadAction<{name: keyof ModalsState}>) => {
            const {name} = action.payload
            state[name].isOpen = false
            state[name].initialState = undefined
        },
        closeAllModals: state => {
            getKeys(state).forEach(modalName => {
                state[modalName].isOpen = false
                state[modalName].initialState = undefined
            })
        },
    },
})

export const modalReducer = modalSlice.reducer

export function selectModalState<T extends keyof ModalsState>(
    name: T,
): (state: RootState) => ModalsState[T] {
    return state => state.modals[name]
}

export function selectSomeModalOpen(state: RootState): boolean {
    return Object.values(state.modals).some(modalState => modalState.isOpen)
}

export const {openModal, closeModal, closeAllModals} = modalSlice.actions
