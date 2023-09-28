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
            const allConnections = this.natsConnection.getAllConnections()
            let allConnected = true
            const details: Record<string, any> = []

            for (const connection of allConnections) {
                const status = this.natsConnection.status(connection.name)

                if (!status.connected) {
                    allConnected = false
                    details.push({
                        connectionName: connection.name,
                        connected: false,
                        error: status.error,
                    })
                } else {
                    details.push({
                        connectionName: connection.name,
                        connected: true,
                    })
                }
            }

            if (allConnected) {
                return {
                    status: 'up',
                    details,
                }
            }

            return {
                status: 'down',
                details,
            }
        } catch (error) {
            return {
                status: 'down',
                error: error.message,
            }
        }
    }
}
