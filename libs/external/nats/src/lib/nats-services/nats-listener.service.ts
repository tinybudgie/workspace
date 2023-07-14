import { DiscoveryService } from '@golevelup/nestjs-discovery'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ExternalContextCreator } from '@nestjs/core'
import { JsMsg, SubscriptionOptions } from 'nats'

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
    private logger = new Logger(NatsListenerService.name)

    constructor(
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

            this.natsClient.reply(listener.meta.subject, {
                ...listener.meta.options,
                callback: async (_error, message) => {
                    try {
                        message.respond(
                            encodeMessage(
                                await methodHandler({
                                    data: decodeMessage(message.data),
                                    subject: message.subject,
                                    headers: message.headers,
                                }),
                            ),
                        )
                    } catch (error) {
                        message.respond(encodeMessage(error))
                    }
                },
            })
        }
    }

    async setupConsumeListeners() {
        const listeners =
            await this.discovery.controllerMethodsWithMetaAtKey<ConsumeOptions>(
                CONSUME_METADATA,
            )

        for (const listener of listeners) {
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

            const { stream, consumer, options } = listener.meta

            const consumerInfo = await this.natsJetStreamClient.createConsumer(
                stream,
                consumer,
            )

            this.natsJetStreamClient.consume(stream, consumerInfo.name, {
                ...options,
                callback: async (message: JsMsg) => {
                    await methodHandler(
                        {
                            data: decodeMessage(message.data),
                            headers: message.headers,
                            subject: message.subject,
                        },
                        // pass message to be able to use acks
                        message,
                    )
                },
            })
        }
    }
}
