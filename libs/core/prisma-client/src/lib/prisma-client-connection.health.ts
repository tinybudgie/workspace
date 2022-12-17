import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nx/core/health-checks'
import { PrismaClientService } from './prisma-client.service'

@Injectable()
export class PrismaClientConnectionHealthIndicator implements HealthIndicator {
    name = 'database'

    constructor(private readonly prismaClientService: PrismaClientService) {}

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.prismaClientService.$queryRaw<
                { dt: string }[]
            >`SELECT now() dt`

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
