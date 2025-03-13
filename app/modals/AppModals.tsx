/**
 * @Project Summarised
 * @File AppModals.tsx
 * @Path app/ModalStack
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import React from 'react'
import {ModalName} from '../routes/modals/Modals'
import LazyModalRenderer from './components/LazyModalRenderer'
import PlanModal from './PlanModal'

const AppModals: React.FC = (): JSX.Element => {
    return (
        <>
            <LazyModalRenderer name={ModalName.Plan}>
                <PlanModal />
            </LazyModalRenderer>
        </>
    )
}

export default AppModals
