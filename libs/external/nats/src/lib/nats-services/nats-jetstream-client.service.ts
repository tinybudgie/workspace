import { Inject, Injectable, Logger } from '@nestjs/common'
import {
    ConsumeOptions,
    ConsumerConfig,
    ConsumerInfo,
    ConsumerUpdateConfig,
    ErrorCode,
    Payload,
    PubAck,
    StreamInfo,
    StreamInfoRequestOptions,
    StreamUpdateConfig,
} from 'nats'

import { NATS_CONFIG, NatsConfig } from '../nats-configs/nats-module.config'
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
export class NatsJetStreamClientService {
    private logger = new Logger(NatsJetStreamClientService.name)

    constructor(
        @Inject(NATS_CONFIG)
        private readonly config: NatsConfig,
        private readonly natsConnection: NatsConnectionService,
    ) {}

    async publish<T>(
        subject: string,
        payload?: T,
        options?: PublishOptions,
        connectionName?: string,
    ): Promise<PubAck> {
        const js = this.natsConnection
            .getNatsConnection(connectionName)
            .connection.jetstream()

        const encodedPayload: Payload = encodeMessage(payload)

        const published = await js.publish(subject, encodedPayload, {
            timeout: 10000,
            ...options,
            headers: parseHeaders(options?.headers),
        })

        const logEnabled = this.config.debugLog?.enable

        if (
            (typeof logEnabled === 'boolean' && logEnabled === true) ||
            (typeof logEnabled === 'object' && logEnabled?.publish === true)
        ) {
            const data = {
                meta: 'NATS_PUBLISH',
                subject: subject,
                payload,
                published,
                options,
                requestHeaders: options?.headers,
            }

            const logMessage = this.config.debugLog?.prettify
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data)

            this.logger.debug(logMessage)
        }

        return published
    }

    /**
     * Create or **update** stream. Set `autoupdate` flag to false, if you dont want to update stream
     */
    async createStream(
        options: CreateStream,
        connectionName?: string,
    ): Promise<StreamInfo> {
        const jsm = await this.jsm(connectionName)

        try {
            return await jsm.streams.add(options)
        } catch (error) {
            // stream name already in use with a different configuration
            if (
                error?.api_error?.code === 400 &&
                error?.api_error?.err_code === 10058 &&
                options.autoupdate !== false
            ) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return await jsm.streams.update(options.name!, options)
            }
            throw error
        }
    }

    async updateStream(
        name: string,
        options: Partial<StreamUpdateConfig>,
        connectionName?: string,
    ): Promise<StreamInfo> {
        const jsm = await this.jsm(connectionName)

        return await jsm.streams.update(name, options)
    }

    async deleteStream(
        name: string,
        connectionName?: string,
    ): Promise<boolean> {
        const jsm = await this.jsm(connectionName)

        return await jsm.streams.delete(name)
    }

    async streamInfo(
        stream: string,
        options?: Partial<StreamInfoRequestOptions>,
        connectionName?: string,
    ): Promise<StreamInfo> {
        const jsm = await this.jsm(connectionName)

        return await jsm.streams.info(stream, options)
    }

    async consume(
        stream: string,
        consumerName?: string,
        options?: ConsumeOptions,
        connectionName?: string,
    ) {
        const js = this.natsConnection
            .getNatsConnection(connectionName)
            .connection.jetstream()

        const consumer = await js.consumers.get(stream, consumerName)

        consumer.consume(options)

        this.logger.log(
            `Mapped {${stream} -> ${consumerName}, NATS JetStream} route`,
        )
    }

    async createConsumer(
        stream: string,
        options: Partial<ConsumerConfig>,
        connectionName?: string,
    ): Promise<ConsumerInfo> {
        const jsm = await this.jsm(connectionName)

        return await jsm.consumers.add(stream, options)
    }

    async updateConsumer(
        stream: string,
        durable: string,
        options: Partial<ConsumerUpdateConfig>,
        connectionName?: string,
    ): Promise<ConsumerInfo> {
        const jsm = await this.jsm(connectionName)

        return await jsm.consumers.update(stream, durable, options)
    }

    async deleteConsumer(
        stream: string,
        consumer: string,
        connectionName?: string,
    ): Promise<boolean> {
        const jsm = await this.jsm(connectionName)

        return await jsm.consumers.delete(stream, consumer)
    }

    async consumerInfo(
        stream: string,
        consumer: string,
        connectionName?: string,
    ): Promise<ConsumerInfo> {
        const jsm = await this.jsm(connectionName)

        return await jsm.consumers.info(stream, consumer)
    }

    async jsm(connectionName?: string) {
        const natsConnection =
            this.natsConnection.getNatsConnection(connectionName)

        if (!natsConnection.options.enableJetstream === false) {
            throw new Error(
                NATS_ERROR_TITLES[NatsErrorsEnum.JetStreamNotEnabledConfig],
            )
        }

        try {
            const jsm = await this.natsConnection.getJetStreamManager({
                connectionName,
            })

            return jsm
        } catch (error) {
            if (error?.code === ErrorCode.JetStreamNotEnabled) {
                throw new Error(
                    NATS_ERROR_TITLES[NatsErrorsEnum.JetStreamNotEnabled],
                )
            }

            throw error
        }
    }
}
