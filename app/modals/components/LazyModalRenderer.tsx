/**
 * @Project Summarised
 * @File LazyModalRenderer.ts
 * @Path app/ModalStack
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import React, {PropsWithChildren} from 'react'
import {ModalsState, selectModalState} from '../../redux/modals/modal.reducer'
import {useAppSelector} from '../../hooks/state/useAppSelector'

interface Props {
    name: keyof ModalsState
}

const LazyModalRenderer: React.FC<PropsWithChildren<Props>> = ({
    name,
    children,
}): JSX.Element | null => {
    const modalState = useAppSelector(selectModalState(name))

    if (!modalState.isOpen) return null

    return <>{children}</>
}

export default LazyModalRenderer
