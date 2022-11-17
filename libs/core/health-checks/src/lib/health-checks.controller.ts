import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { CustomInject } from 'nestjs-custom-injector'
import {
    HealthCheckIndicator,
    HEALTH_CHECKS_PROVIDER,
} from './health-checks.config'
import { VersionHealthIndicator } from './version.health'

@Controller()
export class HealthChecksController {
    @CustomInject<HealthCheckIndicator>(HEALTH_CHECKS_PROVIDER, {
        multi: true,
    })
    private healthIndicators!: HealthCheckIndicator[]

    constructor(
        private health: HealthCheckService,
        private versionHealthIndicator: VersionHealthIndicator,
    ) {}

    @Get('/health')
    @HealthCheck()
    check() {
        return this.health.check([
            async () => this.versionHealthIndicator.isHealthy('version'),
            ...this.healthIndicators.map(
                (healthIndicator) => () =>
                    healthIndicator.isHealthy(healthIndicator.name),
            ),
        ])
    }
}
