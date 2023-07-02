import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ExternalContextCreator } from '@nestjs/core'
import { SubscriptionOptions } from 'nats'
import { NatsClientService } from './nats-client.service'
import { REPLY_METADATA } from '../nats-decorators/reply.decorator'
import { DiscoveryService } from '@golevelup/nestjs-discovery'

@Injectable()
export class NatsListenerService implements OnApplicationBootstrap {
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
                    message.respond(
                        this.natsClient.encodeMessage(await methodHandler()),
                    )
                },
            })
        }
    }
}
