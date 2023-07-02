import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from 'core/health-checks'

import { NatsConnectionService } from '../nats-services/nats-connection.service'

@Injectable()
export class NatsConnectionHealthIndicator implements HealthIndicator {
    name = 'nats'

    constructor(private readonly natsConnection: NatsConnectionService) {}

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            const status = this.natsConnection.status()

            if (status.connected) {
                return {
                    name: this.name,
                    status: 'up',
                }
            }

            return {
                name: this.name,
                status: 'down',
                error: status.error,
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
