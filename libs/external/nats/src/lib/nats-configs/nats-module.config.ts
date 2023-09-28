import { ConfigurableModuleBuilder } from '@nestjs/common'
import { merge } from 'lodash'
import { ConnectionOptions } from 'nats'

export interface NatsConnectionConfig extends ConnectionOptions {
    /**
     * Connection name, provide it if you want to support different NATS connection (NOT clusters)
     */
    connectionName?: string

    /**
     * @default: true
     */
    enableJetstream?: boolean
}

export interface NatsConfig {
    connections: NatsConnectionConfig[]

    /**
     * When set to `true` the client will print protocol messages that it receives
     * or sends to the server using NestJS logger. If you want to debug logs from `nats.io` directly
     * use `debug: true` in `NatsConnectionConfig`
     */
    debugLog?: {
        enable:
            | boolean
            | {
                  request?: boolean
                  reply?: boolean
                  publish?: boolean
                  consume?: boolean
              }
        prettify?: boolean
    }
}

export const DEFAULT_NATS_CONFIG: Pick<NatsConfig, 'debugLog'> = {
    debugLog: {
        enable: false,
    },
}

export function patchNatsConfig(
    config: Pick<typeof NATS_OPTIONS_TYPE, keyof typeof DEFAULT_NATS_CONFIG>,
) {
    if (config) {
        Object.assign(
            config,
            merge(DEFAULT_NATS_CONFIG, config),
        ) as typeof NATS_OPTIONS_TYPE
    }
    return config
}

export const {
    ConfigurableModuleClass: NatsConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: NATS_CONFIG,
    ASYNC_OPTIONS_TYPE: NATS_ASYNC_OPTIONS_TYPE,
    OPTIONS_TYPE: NATS_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<NatsConfig, 'forRoot'>({
    optionsInjectionToken: `NATS_CONFIG`,
}).build()
