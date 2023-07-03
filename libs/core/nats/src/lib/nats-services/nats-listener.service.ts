import { DiscoveryService } from '@golevelup/nestjs-discovery'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ExternalContextCreator } from '@nestjs/core'
import { SubscriptionOptions } from 'nats'

import { REPLY_METADATA } from '../nats-constants/nats.constants'
import { NatsClientService } from './nats-client.service'

@Injectable()
export class NatsListenerService implements OnApplicationBootstrap {
    private logger = new Logger(NatsListenerService.name)

    constructor(
        private readonly natsClient: NatsClientService,
        private readonly discovery: DiscoveryService,
        private readonly externalContextCreator: ExternalContextCreator,
    ) {}

    async onApplicationBootstrap() {
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
                REPLY_METADATA,
            )

            this.natsClient.reply(listener.meta.subject, {
                ...listener.meta.options,
                callback: async (_error, message) => {
                    const args = this.natsClient.decodeMessage(message.data)
                    const headers = message.headers

                    try {
                        message.respond(
                            this.natsClient.encodeMessage(
                                await methodHandler(args, headers),
                            ),
                        )
                    } catch (error) {
                        message.respond(this.natsClient.encodeMessage(error))
                    }
                },
            })

            this.logger.log(`Mapped {${listener.meta.subject}, NATS} route`)
        }
    }
}
