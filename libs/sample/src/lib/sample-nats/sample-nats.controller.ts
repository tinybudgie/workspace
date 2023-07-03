import { Controller } from '@nestjs/common'
import { Reply } from 'core/nats'
import { MsgHdrs } from 'nats'

import { SampleNatsRoutesEnum } from './sample-nats.routes'

@Controller()
export class SampleNatsController {
    @Reply(SampleNatsRoutesEnum.PING)
    async ping(payload: any, headers: MsgHdrs) {
        const allHeaders = headers
            .keys()
            .map((k) => `"${k}" => "${headers.get(k)}"`)

        return `pong with message ${JSON.stringify(
            payload,
        )} and headers: [${allHeaders.join(', ')}]`
    }
}
