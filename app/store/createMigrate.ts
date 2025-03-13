/**
 * @Project Summarised
 * @File createMigrate.ts
 * @Path app/store
 * @Author BRICE ZELE
 * @Date 05/03/2023
 */
// Adapted from https://github.com/rt2zz/redux-persist/blob/master/src/createMigrate.ts to add more logging
import type {MigrationManifest, PersistedState} from 'redux-persist'
import {DEFAULT_VERSION} from 'redux-persist/es/constants'
import {Logger} from '../utils/logger'

export default function createMigrate(
    migrations: MigrationManifest,
): (state: PersistedState, currentVersion: number) => Promise<PersistedState> {
    return function (state: PersistedState, currentVersion: number): Promise<PersistedState> {
        try {
            if (!state) {
                Logger.debug(
                    'redux-persist',
                    'createMigrate',
                    'no inbound state, skipping migration',
                )
                return Promise.resolve(undefined)
            }

            const inboundVersion: number = state._persist?.version ?? DEFAULT_VERSION

            if (inboundVersion === currentVersion) {
                Logger.debug(
                    'redux-persist',
                    'createMigrate',
                    `versions match (${currentVersion}), noop migration`,
                )
                return Promise.resolve(state)
            }

            if (inboundVersion > currentVersion) {
                Logger.debug(
                    'redux-persist',
                    'createMigrate',
                    'downgrading version is not supported',
                )
                return Promise.resolve(state)
            }

            const migrationKeys = Object.keys(migrations)
                .map(ver => parseInt(ver, 10))
                .filter(key => currentVersion >= key && key > inboundVersion)
                .sort((a, b) => a - b)

            Logger.debug('redux-persist', 'createMigrate', `migrationKeys: ${migrationKeys}`)

            const migratedState: PersistedState = migrationKeys.reduce(
                (versionState: PersistedState, versionKey) => {
                    Logger.debug(
                        'redux-persist',
                        'createMigrate',
                        `running migration for versionKey: ${versionKey}`,
                    )
                    // Safe non-null assertion because `versionKey` comes from `Object.keys(migrations)`

                    return migrations[versionKey]!(versionState)
                },
                state,
            )

            return Promise.resolve(migratedState)
        } catch (err) {
            Logger.error('redux-persist', 'createMigrate', 'Error:', err)
            return Promise.reject(err)
        }
    }
}
