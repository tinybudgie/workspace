import { MsgHdrs, RequestOptions as NatsRequestOptions } from 'nats'

export interface NatsResponse<T> {
    subject: string
    data: T
    headers?: MsgHdrs
}

export interface RequestOptions
    extends Omit<NatsRequestOptions, 'headers' | 'timeout'> {
    timeout?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, string>
}
