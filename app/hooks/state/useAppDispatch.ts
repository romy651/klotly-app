/**
 * @Project Summarised
 * @File useAppDispatch.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */

import {ThunkDispatch} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import {AppDispatch} from '../../store'

export const useAppDispatch = (): ThunkDispatch<any, any, any> => useDispatch<AppDispatch>()
