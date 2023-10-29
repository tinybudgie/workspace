import { Injectable } from '@nestjs/common'
import {
    HealthIndicator,
    HealthIndicatorResult,
} from '@tinybudgie/health-checks'

import { SamplePrismaService } from '../sample-services/sample-prisma.service'

@Injectable()
export class SamplePrismaConnectionHealthIndicator {
    constructor(private readonly prisma: SamplePrismaService) {}

    @HealthIndicator('sample-database')
    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.prisma.$queryRaw<{ dt: string }[]>`SELECT now() dt`

            return {
                status: 'up',
            }
        } catch (error) {
            return {
                status: 'down',
                error: error.message,
            }
        }
    }
}
