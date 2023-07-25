import { DiscoveryService } from '@golevelup/nestjs-discovery'
import { Controller, Get } from '@nestjs/common'
import { ExternalContextCreator } from '@nestjs/core'

import {
    HEALTH_INDICATOR_ARGS_METADATA,
    HEALTH_INDICATOR_METADATA,
} from '../health-checks-constants/health-checks.constants'
import {
    HealthCheckResult,
    HealthIndicatorResult,
} from '../health-checks-interfaces/health-checks.interfaces'

@Controller()
export class HealthChecksController {
    private _appStartedAt: number = Date.now()

    constructor(
        private readonly discovery: DiscoveryService,
        private readonly externalContextCreator: ExternalContextCreator,
    ) {}

    @Get('/health')
    async check(): Promise<HealthCheckResult> {
        const timestamp = Date.now()
        const uptime = Math.floor((timestamp - this._appStartedAt) / 1000)

        const indicators = await this.discovery.providerMethodsWithMetaAtKey<{
            name: string
        }>(HEALTH_INDICATOR_METADATA)

        const services = await Promise.all(
            indicators.map(async (indicator) => {
                const { parentClass, handler, methodName } =
                    indicator.discoveredMethod

                const methodHandler = this.externalContextCreator.create(
                    parentClass.instance,
                    handler,
                    methodName,
                    HEALTH_INDICATOR_ARGS_METADATA,
                    undefined,
                    undefined, // contextId
                    undefined, // inquirerId
                    undefined, // options
                    'health.indicator', // contextType
                )

                const healthResult =
                    (await methodHandler()) as HealthIndicatorResult

                return {
                    name: indicator.meta.name,
                    ...healthResult,
                }
            }),
        )

        const successfulServices = services.filter(
            (s) => s.status === 'up',
        ).length
        const ratio = +(successfulServices / services.length).toFixed(2)

        return {
            healthy: successfulServices === services.length,
            ratio,
            uptime,
            timestamp,
            services,
        }
    }
}
