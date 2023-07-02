import { applyDecorators, SetMetadata } from '@nestjs/common'

import { SubscriptionOptions } from '../nats-interfaces/nats.interfaces'

export const REPLY_METADATA = 'nats.reply.metadata'

export function Reply(subject: string, options?: SubscriptionOptions) {
    return applyDecorators(SetMetadata(REPLY_METADATA, { subject, options }))
}
