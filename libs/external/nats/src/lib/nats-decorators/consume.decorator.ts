/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { applyDecorators, SetMetadata } from '@nestjs/common'

import { CONSUME_METADATA } from '../nats-constants/nats.constants'
import { ConsumeOptions } from '../nats-interfaces/nats.interfaces'

export function Consume(options: ConsumeOptions) {
    return applyDecorators(SetMetadata(CONSUME_METADATA, options))
}
