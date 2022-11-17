import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { CustomInject } from 'nestjs-custom-injector'
import {
    HealthChecksConfig,
    HEALTH_CHECKS_CONFIG,
} from './health-checks.config'

@Injectable()
export class VersionHealthIndicator extends HealthIndicator {
    @CustomInject<HealthChecksConfig>(HEALTH_CHECKS_CONFIG)
    private healthChecksConfig!: HealthChecksConfig

    constructor() {
        super()
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        return this.getStatus(key, true, this.healthChecksConfig)
    }
}
