import { ConfigurableModuleBuilder } from '@nestjs/common'
import { merge } from 'lodash'

export interface SampleConfig {
    database: {
        url: string
        logging: 'all_queries' | 'long_queries'
        maxQueryExecutionTime: number
    }
    temp?: boolean
}

export const DEFAULT_SAMPLE_CONFIG: Pick<SampleConfig, 'temp'> = {
    temp: false,
}

export function patchSampleConfig(
    config: Pick<
        typeof SAMPLE_OPTIONS_TYPE,
        keyof typeof DEFAULT_SAMPLE_CONFIG
    >,
) {
    if (config) {
        Object.assign(
            config,
            merge(DEFAULT_SAMPLE_CONFIG, config),
        ) as typeof SAMPLE_OPTIONS_TYPE
    }
    return config
}

export const {
    ConfigurableModuleClass: SampleConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: SAMPLE_CONFIG,
    ASYNC_OPTIONS_TYPE: SAMPLE_ASYNC_OPTIONS_TYPE,
    OPTIONS_TYPE: SAMPLE_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<SampleConfig, 'forRoot'>({
    optionsInjectionToken: `SAMPLE_CONFIG`,
}).build()
