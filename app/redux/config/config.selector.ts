/**
 * @Project Summarised
 * @File config.selector.ts
 * @Path app/redux/config
 * @Author BRICE ZELE
 * @Date 12/03/2023
 */
import {RootState} from '../rootReducer'
import {AppConfigurationType} from './config.reducer'
import {createSelector} from '@reduxjs/toolkit'

export const selectConfigReducer = (state: RootState): AppConfigurationType => state.application

export const selectAppConfig = createSelector(selectConfigReducer, appConfig => appConfig)
