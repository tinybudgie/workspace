import { Controller, Get } from '@nestjs/common'
import { CustomInject } from 'nestjs-custom-injector'

import { HEALTH_CHECKS_PROVIDER } from './health-checks.config'
import { HealthCheckResult } from './interfaces/health-check-result.interface'
import { HealthIndicator } from './interfaces/health-indicator.interface'

@Controller()
export class HealthChecksController {
    private _appStartedAt: number = Date.now()

    @CustomInject<HealthIndicator>(HEALTH_CHECKS_PROVIDER, {
        multi: true,
    })
    private healthIndicators!: HealthIndicator[]

    @Get('/health')
    async check(): Promise<HealthCheckResult> {
        const timestamp = Date.now()
        const uptime = Math.floor((timestamp - this._appStartedAt) / 1000)

        const services = await Promise.all(
            this.healthIndicators.map(
                async (indicator) => await indicator.isHealthy(),
            ),
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
