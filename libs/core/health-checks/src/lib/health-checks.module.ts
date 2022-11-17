import { DynamicModule, Module, Type } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import {
    HealthChecksAsyncConfig,
    HEALTH_CHECKS_CONFIG,
    HEALTH_CHECKS_PROVIDER,
} from './health-checks.config'
import { HealthChecksController } from './health-checks.controller'
import { VersionHealthIndicator } from './version.health'

@Module({})
export class HealthChecksModule {
    static forRootAsync(config: HealthChecksAsyncConfig): DynamicModule {
        return {
            module: HealthChecksModule,
            imports: [TerminusModule, ...(config.imports || [])],
            providers: [
                {
                    provide: HEALTH_CHECKS_CONFIG,
                    useFactory: async (...args) => {
                        return await config.useFactory(...args)
                    },
                    inject: [...(config.inject || [])],
                },
                ...(config.healthIndicators || []).map((healthIndicator) => {
                    const useFactory =
                        typeof healthIndicator === 'object'
                            ? healthIndicator?.useFactory
                            : undefined
                    const useClass =
                        healthIndicator !== 'object'
                            ? (healthIndicator as Type)
                            : undefined
                    const useValue =
                        healthIndicator === 'object'
                            ? healthIndicator?.useValue
                            : undefined
                    const inject =
                        (healthIndicator === 'object'
                            ? healthIndicator?.inject
                            : undefined) || []
                    if (useFactory) {
                        return {
                            provide: HEALTH_CHECKS_PROVIDER,
                            useFactory: async (...args) =>
                                await useFactory(...args),
                            inject,
                        }
                    }
                    if (useClass) {
                        return {
                            provide: HEALTH_CHECKS_PROVIDER,
                            useClass,
                        }
                    }
                    if (useValue) {
                        return {
                            provide: HEALTH_CHECKS_PROVIDER,
                            useValue,
                        }
                    }
                    return {
                        provide: HEALTH_CHECKS_PROVIDER,
                        useValue: null,
                    }
                }),
                VersionHealthIndicator,
            ],
            controllers: [HealthChecksController],
        }
    }
}
