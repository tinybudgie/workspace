import { Injectable, Logger } from '@nestjs/common'
import { CommonError, CommonErrorsEnum } from 'core/common'
import { ErrorCode, Payload, Subscription, SubscriptionOptions } from 'nats'

import { NATS_ERROR_TITLES } from '../nats-errors/nats-errors.enum'
import { NatsErrorsEnum } from '../nats-errors/nats-errors.enum'
import {
    NatsResponse,
    RequestOptions,
} from '../nats-interfaces/nats.interfaces'
import {
    decodeMessage,
    encodeMessage,
    parseHeaders,
} from '../nats-utils/nats.utils'
import { NatsConnectionService } from './nats-connection.service'

@Injectable()
export class NatsClientService {
    private logger = new Logger(NatsClientService.name)

    constructor(private readonly natsConnection: NatsConnectionService) {}

    async request<T, K>(
        subject: string,
        payload?: T,
        options?: RequestOptions,
    ): Promise<NatsResponse<K>> {
        const nc = this.natsConnection.getNatsConnection()

        const encodedPayload: Payload = encodeMessage(payload)

        try {
            const msg = await nc.request(subject, encodedPayload, {
                timeout: 10000,
                ...options,
                headers: parseHeaders(options?.headers),
            })

            return {
                subject,
                headers: msg.headers,
                data: decodeMessage(msg.data) as K,
            }
        } catch (error) {
            if (error?.code === ErrorCode.NoResponders) {
                throw new CommonError(
                    NatsErrorsEnum.NoResponders,
                    NATS_ERROR_TITLES,
                )
            }

            if (error?.code === ErrorCode.Timeout) {
                throw new CommonError(NatsErrorsEnum.Timeout, NATS_ERROR_TITLES)
            }

            throw new CommonError(
                CommonErrorsEnum.UnexpectedError,
                error.message,
            )
        }
    }

    /**
     * Subscribe to subject and reply with particular response
     *
     * Example:
     * ```ts
     *  this.reply('hello.world', {
     *      callback: (error, message) => {
     *          const responseHeaders = headers()
     *          responseHeaders.append('key', 'value')
     *          message.respond(this.encodeMessage('hello'), {
     *              headers: responseHeaders,
     *          })
     *      },
     *  })
     * ```
     * @returns {Subscription}
     */
    async reply(
        subject: string,
        options?: SubscriptionOptions,
    ): Promise<Subscription> {
        const nc = this.natsConnection.getNatsConnection()

        const subscription = nc.subscribe(subject, options)

        this.logger.log(`Mapped {${subject}, NATS} route`)

        return subscription
    }
}
