import {
    ConsumeOptions as NatsConsumeOptions,
    ConsumerConfig,
    JetStreamOptions,
    JetStreamPublishOptions,
    MsgHdrs,
    NatsConnection,
    RequestOptions as NatsRequestOptions,
    StreamConfig,
    SubscriptionOptions as NatsSubscriptionOptions,
} from 'nats'

import { NatsConnectionConfig } from '../nats-configs/nats-module.config'

export interface NatsResponse<T> {
    subject: string
    data: T
    headers?: MsgHdrs
}

export type SubscriptionOptions = Omit<NatsSubscriptionOptions, 'callback'>

export interface RequestOptions
    extends Omit<NatsRequestOptions, 'headers' | 'timeout'> {
    timeout?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, string>
}

export interface NatsConnectionObject {
    name: string
    options: NatsConnectionConfig
    connection: NatsConnection
}

export interface GetJetStreamManagerOptions {
    connectionName?: string
    options?: JetStreamOptions
}

export interface PublishOptions
    extends Omit<Partial<JetStreamPublishOptions>, 'headers' | 'timeout'> {
    timeout?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, string>
}

export interface CreateStream extends Partial<StreamConfig> {
    autoupdate?: boolean
}

export interface ReplyPayload<T> {
    subject: string
    data: T
    headers?: MsgHdrs
}

export interface ReplyResponse<T> {
    data: T
    headers?: Record<string, string>
}

export interface ConsumePayload<T> {
    data: T
    headers?: MsgHdrs
    subject: string
}

export interface ConsumerAcks {
    /**
     * Indicate to the JetStream server that the message was processed
     * successfully.
     */
    ack(): void
    /**
     * Indicate to the JetStream server that processing of the message
     * failed, and that it should be resent after the spefied number of
     * milliseconds.
     * @param millis
     */
    nak(millis?: number): void
    /**
     * Indicate to the JetStream server that processing of the message
     * is on going, and that the ack wait timer for the message should be
     * reset preventing a redelivery.
     */
    working(): void
    /**
     * Indicate to the JetStream server that processing of the message
     * failed and that the message should not be sent to the consumer again.
     */
    term(): void
    /**
     * Indicate to the JetStream server that the message was processed
     * successfully and that the JetStream server should acknowledge back
     * that the acknowledgement was received.
     */
    ackAck(): Promise<boolean>
}

export interface ConsumeOptions {
    connectionName?: string
    stream: string
    consumer: Partial<ConsumerConfig>
    options?: Omit<NatsConsumeOptions, 'callback'>
}
