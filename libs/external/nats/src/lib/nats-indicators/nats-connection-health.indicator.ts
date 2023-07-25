import { Injectable } from '@nestjs/common'
import {
    HealthIndicator,
    HealthIndicatorResult,
} from '@tematools/health-checks'

import { NatsConnectionService } from '../nats-services/nats-connection.service'

@Injectable()
export class NatsConnectionHealthIndicator {
    constructor(private readonly natsConnection: NatsConnectionService) {}

    @HealthIndicator('nats')
    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            const status = this.natsConnection.status()

            if (status.connected) {
                return {
                    status: 'up',
                }
            }

            return {
                status: 'down',
                error: status.error,
            }
        } catch (error) {
            return {
                status: 'down',
                error: error.message,
            }
        }
    }
}
