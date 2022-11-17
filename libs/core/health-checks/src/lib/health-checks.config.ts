import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common'

import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'

export const HEALTH_CHECKS_CONFIG = Symbol('HEALTH_CHECKS_CONFIG')

export interface HealthChecksConfig {
    tag?: string
    version?: string
    commit?: string
    date?: string
}

export const HEALTH_CHECKS_PROVIDER = Symbol('HEALTH_CHECKS_PROVIDER')

export interface HealthChecksAsyncConfig<
    T extends HealthChecksConfig = HealthChecksConfig,
    P extends HealthCheckIndicator = HealthCheckIndicator,
> {
    useFactory: FactoryProvider<Promise<T>>['useFactory']
    inject?: FactoryProvider['inject']
    imports?: ModuleMetadata['imports']
    healthIndicators?: (
        | {
              useFactory?: FactoryProvider<Promise<P>>['useFactory']
              inject?: FactoryProvider['inject']
              useValue?: P
          }
        | Type<P>
    )[]
}

export type HealthCheckIndicator = HealthIndicator & {
    name: string
    isHealthy(key: string): Promise<HealthIndicatorResult>
}
