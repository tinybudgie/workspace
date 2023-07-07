import { Controller, Logger } from '@nestjs/common'
import {
    Consume,
    ConsumePayload,
    ConsumerAcks,
    Reply,
    ReplyPayload,
    ReplyResponse,
} from '@tematools/nats'
import { AckPolicy } from 'nats'

import {
    SAMPLE_STREAM_NAME,
    SampleNatsJetStreamSubjectsEnum,
} from './sample-nats.stream'

export enum SampleNatsRoutesEnum {
    PING = 'sample.ping',
}

@Controller()
export class SampleNatsController {
    private logger = new Logger(SampleNatsController.name)

    @Reply(SampleNatsRoutesEnum.PING)
    async ping(payload: ReplyPayload<any>): Promise<ReplyResponse<string>> {
        const response = `pong with message ${JSON.stringify(payload.data)}`

        const responseHeaders = {
            ping: 'pong',
        }

        return {
            data: response,
            headers: responseHeaders,
        }
    }

    @Consume({
        stream: SAMPLE_STREAM_NAME,
        consumer: {
            durable_name: 'sample-consumer',
            filter_subject: SampleNatsJetStreamSubjectsEnum.PING,
            ack_policy: AckPolicy.All,
        },
    })
    async listenPing(payload: ConsumePayload<any>, acks: ConsumerAcks) {
        this.logger.log(`New message: ${JSON.stringify(payload, null, 2)}`)

        acks.ack()
    }
}
