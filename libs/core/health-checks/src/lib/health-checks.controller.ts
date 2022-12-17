import { Controller, Get, Logger } from '@nestjs/common'
import { execSync } from 'child_process'
import { CustomInject } from 'nestjs-custom-injector'
import { HEALTH_CHECKS_PROVIDER } from './health-checks.config'
import { HealthCheckResult } from './interfaces/health-check-result.interface'
import { HealthIndicator } from './interfaces/health-indicator.interface'

@Controller()
export class HealthChecksController {
    private _logger = new Logger(HealthChecksController.name)
    private _appStartedAt: number = Date.now()

    @CustomInject<HealthIndicator>(HEALTH_CHECKS_PROVIDER, {
        multi: true,
    })
    private healthIndicators!: HealthIndicator[]

    @Get('/health')
    async check(): Promise<HealthCheckResult> {
        const uptime = Math.floor((Date.now() - this._appStartedAt) / 1000)
        const commit = this._getCommit()
        const tag = this._getTag()
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
            ratio,
            uptime,
            commit,
            tag,
            services,
        }
    }

    private _getCommit(): string | undefined {
        try {
            return execSync('git rev-parse HEAD').toString().trim()
        } catch (error) {
            this._logger.warn(`Can't get GIT commit, ignoring`)
            return
        }
    }

    private _getTag(): string | undefined {
        try {
            const tag = execSync('git tag --points-at HEAD').toString().trim()

            if (tag === '') {
                return
            }

            return tag
        } catch (error) {
            this._logger.warn(`Can't get GIT commit, ignoring`)
            return
        }
    }
}
