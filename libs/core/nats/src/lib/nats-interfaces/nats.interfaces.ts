import {
    JetStreamPublishOptions,
    MsgHdrs,
    RequestOptions as NatsRequestOptions,
    StreamConfig,
    SubscriptionOptions as NatsSubscriptionOptions,
} from 'nats'

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

export interface PublishOptions
    extends Omit<Partial<JetStreamPublishOptions>, 'headers' | 'timeout'> {
    timeout?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, string>
}

export interface CreateStream extends Partial<StreamConfig> {
    autoupdate?: boolean
}
