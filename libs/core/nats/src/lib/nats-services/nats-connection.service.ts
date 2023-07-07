/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import { isObject } from '@nestjs/common/utils/shared.utils'
import {
    connect,
    JetStreamManager,
    JetStreamOptions,
    NatsConnection,
} from 'nats'

import { NATS_CONFIG, NatsConfig } from '../nats-configs/nats-module.config'
import {
    NATS_ERROR_TITLES,
    NatsErrorsEnum,
} from '../nats-errors/nats-errors.enum'

@Injectable()
export class NatsConnectionService implements OnModuleInit, OnModuleDestroy {
    private logger = new Logger(NatsConnectionService.name)
    private natsConnection?: NatsConnection
    private natsConnectionStatus: {
        connected: boolean
        error?: string
    } = {
        connected: false,
    }

    constructor(
        @Inject(NATS_CONFIG)
        private readonly config: NatsConfig,
    ) {}

    async onModuleInit() {
        try {
            const natsConnection = await connect(this.config)
            this.handleStatusUpdates(natsConnection)

            this.natsConnection = natsConnection
            this.natsConnectionStatus.connected = true
        } catch (error) {
            this.natsConnectionStatus = {
                connected: false,
                error,
            }
            this.logger.error(error)
        }
    }

    async onModuleDestroy() {
        if (this.natsConnection === undefined) {
            return
        }

        const connectionClosed = this.natsConnection?.closed()

        await this.natsConnection?.drain()

        const error = await connectionClosed
        this.logger.log('NATS connection closed')

        if (error) {
            this.logger.error(`Error closing NATS:`, error)
        }
    }

    status(): { connected: boolean; error?: string } {
        return this.natsConnectionStatus
    }

    getNatsConnection(): NatsConnection {
        if (!this.natsConnection) {
            throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
        }

        return this.natsConnection
    }

    async getJetStreamManager(
        options?: JetStreamOptions,
    ): Promise<JetStreamManager> {
        if (!this.natsConnection) {
            throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
        }

        return await this.natsConnection.jetstreamManager(options)
    }

    // TODO: add LDM mode
    public async handleStatusUpdates(natsConnection: NatsConnection) {
        for await (const status of natsConnection.status()) {
            const data =
                status.data && isObject(status.data)
                    ? JSON.stringify(status.data)
                    : status.data

            switch (status.type) {
                case 'error':
                case 'disconnect': {
                    const message = `NatsError: type: "${status.type}", data: "${data}".`

                    this.natsConnectionStatus.connected = false
                    this.natsConnectionStatus.error = message

                    this.logger.error(message)
                    break
                }

                case 'pingTimer': {
                    if (this.config.debug) {
                        this.logger.debug(
                            `NatsStatus: type: "${status.type}", data: "${data}".`,
                        )
                    }
                    break
                }

                case 'reconnect': {
                    const message = `NatsStatus: type: "${status.type}", data: "${data}".`

                    this.natsConnectionStatus.connected = true
                    this.natsConnectionStatus.error = undefined

                    this.logger.log(message)
                    break
                }

                case 'reconnecting': {
                    const message = `NatsError: type: "${status.type}", data: "${data}".`

                    this.natsConnectionStatus.connected = false
                    this.natsConnectionStatus.error = message

                    this.logger.error(message)
                    break
                }

                default: {
                    this.logger.log(
                        `NatsStatus: type: "${status.type}", data: "${data}".`,
                    )
                    break
                }
            }
        }
    }
}
