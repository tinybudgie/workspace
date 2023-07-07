import { Injectable } from '@nestjs/common'
import {
    HealthIndicator,
    HealthIndicatorResult,
} from '@tematools/health-checks'

import { SamplePrismaService } from '../sample-services/sample-prisma.service'

@Injectable()
export class SamplePrismaConnectionHealthIndicator implements HealthIndicator {
    name = 'sample-database'

    constructor(private readonly prisma: SamplePrismaService) {}

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.prisma.$queryRaw<{ dt: string }[]>`SELECT now() dt`

            return {
                name: this.name,
                status: 'up',
            }
        } catch (error) {
            return {
                name: this.name,
                status: 'down',
                error: error.message,
            }
        }
    }
}
