import { Controller } from '@nestjs/common'
import { Reply } from 'core/nats'
import { SampleNatsRoutesEnum } from './sample-nats.routes'

@Controller()
export class SampleNatsController {
    @Reply(SampleNatsRoutesEnum.PING)
    async ping() {
        return 'pong'
    }
}
