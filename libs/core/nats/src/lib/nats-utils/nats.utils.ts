import { isObject, isUndefined } from '@nestjs/common/utils/shared.utils'
import { Empty, headers, JSONCodec, MsgHdrs, StringCodec } from 'nats'

export function decodeMessage<T>(data: Uint8Array): T {
    const sc = StringCodec()
    const jc = JSONCodec<T>()

    try {
        return jc.decode(data)
    } catch {
        return sc.decode(data) as T
    }
}

export function encodeMessage<T>(data?: T): Uint8Array {
    const sc = StringCodec()
    const jc = JSONCodec<T>()

    if (isObject(data)) {
        return jc.encode(data)
    } else if (!isUndefined(data)) {
        return sc.encode(`${data}`)
    }

    return Empty
}

export function parseHeaders(hdrs?: Record<string, string>): MsgHdrs {
    const requestHeaders = headers()
    if (hdrs) {
        for (const [k, v] of Object.entries(hdrs)) {
            requestHeaders.append(k, v)
        }
    }

    return requestHeaders
}
