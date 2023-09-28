import { DiscoveryService } from '@golevelup/nestjs-discovery'
import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common'
import { ExternalContextCreator } from '@nestjs/core'
import { JsMsg, SubscriptionOptions } from 'nats'

import { NATS_CONFIG, NatsConfig } from '../nats-configs/nats-module.config'
import {
    CONSUME_ARGS_METADATA,
    CONSUME_METADATA,
    REPLY_ARGS_METADATA,
    REPLY_METADATA,
} from '../nats-constants/nats.constants'
import { ConsumeOptions } from '../nats-interfaces/nats.interfaces'
import { decodeMessage, encodeMessage } from '../nats-utils/nats.utils'
import { NatsClientService } from './nats-client.service'
import { NatsJetStreamClientService } from './nats-jetstream-client.service'

@Injectable()
export class NatsListenerService implements OnApplicationBootstrap {
    private readonly logger = new Logger(NatsListenerService.name)

    constructor(
        @Inject(NATS_CONFIG)
        private readonly config: NatsConfig,
        private readonly natsClient: NatsClientService,
        private readonly natsJetStreamClient: NatsJetStreamClientService,
        private readonly discovery: DiscoveryService,
        private readonly externalContextCreator: ExternalContextCreator,
    ) {}

    async onApplicationBootstrap() {
        await this.setupReplyListeners()
        await this.setupConsumeListeners()
    }

    async setupReplyListeners() {
        const listeners = await this.discovery.controllerMethodsWithMetaAtKey<{
            subject: string
            options: SubscriptionOptions
            connectionName?: string
        }>(REPLY_METADATA)

        for (const listener of listeners) {
            const { parentClass, handler, methodName } =
                listener.discoveredMethod

            const methodHandler = this.externalContextCreator.create(
                parentClass.instance,
                handler,
                methodName,
                REPLY_ARGS_METADATA,
                undefined,
                undefined, // contextId
                undefined, // inquirerId
                undefined, // options
                'nats', // contextType
            )

            this.natsClient.reply(
                listener.meta.subject,
                {
                    ...listener.meta.options,
                    callback: async (_error, message) => {
                        let response: any

                        const decodedMessage = decodeMessage(message.data)

                        try {
                            response = await methodHandler({
                                data: decodedMessage,
                                subject: message.subject,
                                headers: message.headers,
                            })

                            message.respond(encodeMessage(response))
                        } catch (error) {
                            response = error
                            message.respond(encodeMessage(error))
                        }

                        const logEnabled = this.config.debugLog?.enable

                        if (
                            (typeof logEnabled === 'boolean' &&
                                logEnabled === true) ||
                            (typeof logEnabled === 'object' &&
                                logEnabled?.reply === true)
                        ) {
                            const data = {
                                meta: 'NATS_REPLY',
                                subject: message.subject,
                                request: decodedMessage,
                                requestHeaders: message.headers,
                                response: response?.data
                                    ? response.data
                                    : response,
                                responseHeaders: response?.headers
                                    ? response.headers
                                    : undefined,
                            }

                            const logMessage = this.config.debugLog?.prettify
                                ? JSON.stringify(data, null, 2)
                                : JSON.stringify(data)

                            this.logger.debug(logMessage)
                        }
                    },
                },
                listener.meta.connectionName,
            )
        }
    }

    async setupConsumeListeners() {
        const listeners =
            await this.discovery.controllerMethodsWithMetaAtKey<ConsumeOptions>(
                CONSUME_METADATA,
            )

        for (const listener of listeners) {
            try {
                const { parentClass, handler, methodName } =
                    listener.discoveredMethod

                const methodHandler = this.externalContextCreator.create(
                    parentClass.instance,
                    handler,
                    methodName,
                    CONSUME_ARGS_METADATA,
                    undefined,
                    undefined, // contextId
                    undefined, // inquirerId
                    undefined, // options
                    'nats', // contextType
                )

                const { stream, consumer, options, connectionName } =
                    listener.meta

                const consumerInfo =
                    await this.natsJetStreamClient.createConsumer(
                        stream,
                        consumer,
                    )

                this.natsJetStreamClient.consume(
                    stream,
                    consumerInfo.name,
                    {
                        ...options,
                        callback: async (message: JsMsg) => {
                            const decodedMessage = decodeMessage(message.data)

                            await methodHandler(
                                {
                                    data: decodedMessage,
                                    headers: message.headers,
                                    subject: message.subject,
                                },
                                // pass &message to be able to use acks
                                message,
                            )

                            const logEnabled = this.config.debugLog?.enable

                            if (
                                (typeof logEnabled === 'boolean' &&
                                    logEnabled === true) ||
                                (typeof logEnabled === 'object' &&
                                    logEnabled?.consume === true)
                            ) {
                                const data = {
                                    meta: 'NATS_CONSUME',
                                    subject: message.subject,
                                    data: decodedMessage,
                                    headers: message.headers,
                                }

                                const logMessage = this.config.debugLog
                                    ?.prettify
                                    ? JSON.stringify(data, null, 2)
                                    : JSON.stringify(data)

                                this.logger.debug(logMessage)
                            }
                        },
                    },
                    connectionName,
                )
            } catch (error) {
                this.logger.error(
                    `${error.message}: ${JSON.stringify({
                        moduleName:
                            listener?.discoveredMethod?.parentClass
                                ?.parentModule?.name,
                        className:
                            listener?.discoveredMethod?.parentClass?.name,
                        methodName: listener?.discoveredMethod?.methodName,
                        consumerName: listener?.meta?.consumer?.durable_name,
                        streamName: listener?.meta?.stream,
                        connectionName: listener?.meta?.connectionName,
                    })}`,
                )
            }
        }
    }
}
