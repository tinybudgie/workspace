import { ConfigurableModuleBuilder } from '@nestjs/common'
import { merge } from 'lodash'
import { ConnectionOptions } from 'nats'

export interface NatsConfig extends ConnectionOptions {
    /**
     * @default: true
     */
    enableJetstream?: boolean

    /**
     * When set to `true` the client will print protocol messages that it receives
     * or sends to the server using NestJS logger. If you want to debug logs from `nats.io` directly
     * use `debug: true`
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

export const DEFAULT_NATS_CONFIG: Pick<
    NatsConfig,
    'enableJetstream' | 'debugLog'
> = {
    enableJetstream: true,
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
