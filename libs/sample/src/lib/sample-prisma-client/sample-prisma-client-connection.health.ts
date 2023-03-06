import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nx/core/health-checks'
import { SamplePrismaClientService } from './sample-prisma-client.service'

@Injectable()
export class SamplePrismaClientConnectionHealthIndicator
    implements HealthIndicator
{
    name = 'sample-database'

    constructor(
        private readonly prismaClientService: SamplePrismaClientService,
    ) {}

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
