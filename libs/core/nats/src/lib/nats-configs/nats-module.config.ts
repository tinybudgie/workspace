import { ConfigurableModuleBuilder } from '@nestjs/common'
import { merge } from 'lodash'
import { ConnectionOptions } from 'nats'

export interface NatsConfig extends ConnectionOptions {
    /**
     * @default: true
     */
    enableJetstream?: boolean
}

export const DEFAULT_NATS_CONFIG: Pick<NatsConfig, 'enableJetstream'> = {
    enableJetstream: true,
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
