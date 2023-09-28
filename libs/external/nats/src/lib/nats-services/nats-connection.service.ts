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
import { connect, JetStreamManager, NatsConnection } from 'nats'

import { NATS_CONFIG, NatsConfig } from '../nats-configs/nats-module.config'
import { DEFAULT_CONNECTION_NAME } from '../nats-constants/nats.constants'
import {
    NATS_ERROR_TITLES,
    NatsErrorsEnum,
} from '../nats-errors/nats-errors.enum'
import {
    GetJetStreamManagerOptions,
    NatsConnectionObject,
} from '../nats-interfaces/nats.interfaces'

@Injectable()
export class NatsConnectionService implements OnModuleInit, OnModuleDestroy {
    private logger = new Logger(NatsConnectionService.name)
    private natsConnections: NatsConnectionObject[] = []
    private natsConnectionsStatus: {
        name: string
        connected: boolean
        error?: string
    }[] = []

    constructor(
        @Inject(NATS_CONFIG)
        private readonly config: NatsConfig,
    ) {}

    async onModuleInit() {
        const connections = this.config.connections

        if (this.config.connections.length === 0) {
            throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
        }

        if (this.config.connections.length >= 2) {
            for (const connection of connections) {
                if (!connection.connectionName) {
                    throw new Error(
                        NATS_ERROR_TITLES[NatsErrorsEnum.UnknownConnectionName],
                    )
                }
            }
        }

        for (const connection of connections) {
            const connectionName =
                connection.connectionName ?? DEFAULT_CONNECTION_NAME

            try {
                const natsConnection = await connect(connection)

                const natsConnectionObject = {
                    name: connectionName,
                    options: connection,
                    connection: natsConnection,
                }

                this.handleStatusUpdates(natsConnectionObject)

                this.natsConnections.push(natsConnectionObject)

                this.natsConnectionsStatus.push({
                    name: connectionName,
                    connected: true,
                })
            } catch (error) {
                this.natsConnectionsStatus.push({
                    name: connectionName,
                    connected: false,
                    error,
                })
                this.logger.error(error)
            }
        }
    }

    async onModuleDestroy() {
        for (const { name, connection } of this.natsConnections) {
            if (connection === undefined) {
                return
            }

            const connectionClosed = connection?.closed()

            await connection?.drain()

            const error = await connectionClosed
            this.logger.log(`NATS (${name}) connection closed`)

            if (error) {
                this.logger.error(`Error closing NATS (${name}):`, error)
            }
        }
    }

    status(connectionName?: string): { connected: boolean; error?: string } {
        if (!connectionName) {
            return this.natsConnectionsStatus[0]
        }

        const natsConnectionStatus = this.natsConnectionsStatus.find(
            (v) => v.name === connectionName,
        )

        if (!natsConnectionStatus) {
            throw new Error(
                `No connection status found with name: ${connectionName}`,
            )
        }

        return natsConnectionStatus
    }

    getAllConnections(): NatsConnectionObject[] {
        return this.natsConnections
    }

    getNatsConnection(connectionName?: string): NatsConnectionObject {
        if (!connectionName) {
            const defaultConnection = this.natsConnections[0]

            if (!defaultConnection) {
                throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
            }

            return defaultConnection
        }

        const natsConnection = this.natsConnections.find(
            (v) => v.name === connectionName,
        )

        if (!natsConnection) {
            throw new Error(`No connection found with name: ${connectionName}`)
        }

        if (!natsConnection.connection) {
            throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
        }

        return natsConnection
    }

    async getJetStreamManager(
        options?: GetJetStreamManagerOptions,
    ): Promise<JetStreamManager> {
        const { connectionName, options: jsOptions } = options || {}

        if (!connectionName) {
            const defaultConnection = this.natsConnections[0].connection

            if (!defaultConnection) {
                throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
            }

            return defaultConnection.jetstreamManager(jsOptions)
        }

        const natsConnection = this.natsConnections.find(
            (v) => v.name === connectionName,
        )

        if (!natsConnection) {
            throw new Error(`No connection found with name: ${connectionName}`)
        }

        if (!natsConnection.connection) {
            throw new Error(NATS_ERROR_TITLES[NatsErrorsEnum.NoConnection])
        }

        return natsConnection.connection.jetstreamManager(jsOptions)
    }

    // TODO: add LDM mode
    public async handleStatusUpdates(natsConnection: NatsConnectionObject) {
        const { name, connection, options } = natsConnection

        for await (const status of connection.status()) {
            const data =
                status.data && isObject(status.data)
                    ? JSON.stringify(status.data)
                    : status.data

            const connectionStatusIndex = this.natsConnectionsStatus.findIndex(
                (v) => v.name === name,
            )

            switch (status.type) {
                case 'error':
                case 'disconnect': {
                    const message = `NatsError (${name}): type: "${status.type}", data: "${data}".`

                    this.natsConnectionsStatus[
                        connectionStatusIndex
                    ].connected = false
                    this.natsConnectionsStatus[connectionStatusIndex].error =
                        message

                    this.logger.error(message)
                    break
                }

                case 'pingTimer': {
                    if (options.debug) {
                        this.logger.debug(
                            `NatsStatus (${name}): type: "${status.type}", data: "${data}".`,
                        )
                    }
                    break
                }

                case 'reconnect': {
                    const message = `NatsStatus (${name}): type: "${status.type}", data: "${data}".`

                    this.natsConnectionsStatus[
                        connectionStatusIndex
                    ].connected = true
                    this.natsConnectionsStatus[connectionStatusIndex].error =
                        undefined

                    this.logger.log(message)
                    break
                }

                case 'reconnecting': {
                    const message = `NatsError (${name}): type: "${status.type}", data: "${data}".`

                    this.natsConnectionsStatus[
                        connectionStatusIndex
                    ].connected = false
                    this.natsConnectionsStatus[connectionStatusIndex].error =
                        message

                    this.logger.error(message)
                    break
                }

                default: {
                    this.logger.log(
                        `NatsStatus (${name}): type: "${status.type}", data: "${data}".`,
                    )
                    break
                }
            }
        }
    }
}
