import { Injectable, Logger } from '@nestjs/common'
import { NatsConnectionService } from './nats-connection.service'
import {
    Payload,
    StringCodec,
    JSONCodec,
    Empty,
    SubscriptionOptions,
    Subscription,
    headers,
    ErrorCode,
} from 'nats'
import {
    NatsResponse,
    RequestOptions,
} from '../nats-interfaces/nats.interfaces'
import { isObject, isUndefined } from '@nestjs/common/utils/shared.utils'
import { CommonError, CommonErrorsEnum } from 'core/common'
import { NatsErrorsEnum } from '../nats-errors/nats-errors.enum'
import { NATS_ERROR_TITLES } from '../nats-errors/nats-errors.enum'

@Injectable()
export class NatsClientService {
    constructor(private readonly natsConnection: NatsConnectionService) {}

    async request<T, K>(
        subject: string,
        payload?: T,
        options?: RequestOptions,
    ): Promise<NatsResponse<K>> {
        const nc = this.natsConnection.getNatsConnection()

        const encodedPayload: Payload = this.encodeMessage(payload)

        const requestHeaders = headers()
        if (options?.headers) {
            for (const [k, v] of Object.entries(options.headers)) {
                requestHeaders.append(k, v)
            }
        }

        try {
            const msg = await nc.request(subject, encodedPayload, {
                timeout: 10000,
                ...options,
                headers: requestHeaders,
            })

            return {
                subject,
                headers: msg.headers,
                data: this.decodeMessage(msg.data) as K,
            }
        } catch (error) {
            if (error.code === ErrorCode.NoResponders) {
                throw new CommonError(
                    NatsErrorsEnum.NoResponders,
                    NATS_ERROR_TITLES,
                )
            }

            if (error.code === ErrorCode.Timeout) {
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

        return nc.subscribe(subject, options)
    }

    decodeMessage<T>(data: Uint8Array): T {
        const sc = StringCodec()
        const jc = JSONCodec<T>()

        try {
            return jc.decode(data)
        } catch {
            return sc.decode(data) as T
        }
    }

    encodeMessage<T>(data?: T): Uint8Array {
        const sc = StringCodec()
        const jc = JSONCodec<T>()

        if (isObject(data)) {
            return jc.encode(data)
        } else if (!isUndefined(data)) {
            return sc.encode(`${data}`)
        }

        return Empty
    }
}
