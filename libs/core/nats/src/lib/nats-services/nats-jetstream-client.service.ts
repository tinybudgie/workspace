import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { CommonError, CommonErrorsEnum } from 'core/common'
import {
    ConsumerConfig,
    ConsumerInfo,
    ConsumerUpdateConfig,
    ErrorCode,
    JetStreamManager,
    Payload,
    PubAck,
    StreamInfo,
    StreamInfoRequestOptions,
    StreamUpdateConfig,
} from 'nats'

import {
    NATS_ERROR_TITLES,
    NatsErrorsEnum,
} from '../nats-errors/nats-errors.enum'
import {
    CreateStream,
    PublishOptions,
} from '../nats-interfaces/nats.interfaces'
import { encodeMessage, parseHeaders } from '../nats-utils/nats.utils'
import { NatsConnectionService } from './nats-connection.service'

@Injectable()
export class NatsJetStreamClientService implements OnApplicationBootstrap {
    private _jsm?: JetStreamManager
    private jsmError?: CommonError<any>

    constructor(private readonly natsConnection: NatsConnectionService) {}

    async onApplicationBootstrap() {
        try {
            this._jsm = await this.natsConnection.getJetStreamManager()
        } catch (error) {
            if (error?.code === ErrorCode.JetStreamNotEnabled) {
                this.jsmError = new CommonError(
                    NatsErrorsEnum.JetStreamNotEnabled,
                    NATS_ERROR_TITLES,
                )
            }

            this.jsmError = new CommonError(
                CommonErrorsEnum.UnexpectedError,
                error.message,
            )
        }
    }

    async publish<T>(
        subject: string,
        payload?: T,
        options?: PublishOptions,
    ): Promise<PubAck> {
        const js = this.natsConnection.getNatsConnection().jetstream()

        const encodedPayload: Payload = encodeMessage(payload)

        return await js.publish(subject, encodedPayload, {
            timeout: 10000,
            ...options,
            headers: parseHeaders(options?.headers),
        })
    }

    /**
     * Create or **update** stream. Set `autoupdate` flag to false, if you dont want to update stream
     */
    async createStream(options: CreateStream): Promise<StreamInfo> {
        try {
            return await this.jsm.streams.add(options)
        } catch (error) {
            // stream name already in use with a different configuration
            if (
                error?.api_error === 400 &&
                error?.api_error?.err_code === 10058 &&
                options.autoupdate !== false
            ) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return await this.jsm.streams.update(options.name!, options)
            }

            throw error
        }
    }

    async updateStream(
        name: string,
        options: Partial<StreamUpdateConfig>,
    ): Promise<StreamInfo> {
        return await this.jsm.streams.update(name, options)
    }

    async deleteStream(name: string): Promise<boolean> {
        return await this.jsm.streams.delete(name)
    }

    async streamInfo(
        stream: string,
        options?: Partial<StreamInfoRequestOptions>,
    ): Promise<StreamInfo> {
        return this.jsm.streams.info(stream, options)
    }

    async createConsumer(
        stream: string,
        options: Partial<ConsumerConfig>,
    ): Promise<ConsumerInfo> {
        return await this.jsm.consumers.add(stream, options)
    }

    async updateConsumer(
        stream: string,
        durable: string,
        options: Partial<ConsumerUpdateConfig>,
    ): Promise<ConsumerInfo> {
        return await this.jsm.consumers.update(stream, durable, options)
    }

    async deleteConsumer(stream: string, consumer: string): Promise<boolean> {
        return await this.jsm.consumers.delete(stream, consumer)
    }

    async consumerInfo(
        stream: string,
        consumer: string,
    ): Promise<ConsumerInfo> {
        return await this.jsm.consumers.info(stream, consumer)
    }

    get jsm() {
        if (!this._jsm) {
            throw this.jsmError
        }

        return this._jsm
    }
}
