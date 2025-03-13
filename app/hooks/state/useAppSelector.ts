/**
 * @Project Summarised
 * @File useAppSelector.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */

import {TypedUseSelectorHook, useSelector} from 'react-redux'
import {RootState} from '../../redux/rootReducer'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
