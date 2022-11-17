import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { PrismaClientService } from './prisma-client.service'

@Injectable()
export class PrismaClientConnectionHealthIndicator extends HealthIndicator {
    name = 'database'

    constructor(private readonly prismaClientService: PrismaClientService) {
        super()
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const result = await this.prismaClientService.$queryRaw<
                { dt: string }[]
            >`SELECT now() dt`

            return this.getStatus(key, true, {
                date: result[0].dt,
            })
        } catch (error) {
            return this.getStatus(key, false, {
                error: error.message.replaceAll('\n', ' '),
            })
        }
    }
}
