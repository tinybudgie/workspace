import { Controller, OnApplicationBootstrap } from '@nestjs/common'
import { NatsClientService } from 'core/nats'
import { SampleNatsRoutesEnum } from './sample-nats.routes'

@Controller()
export class SampleNatsController implements OnApplicationBootstrap {
    constructor(private readonly natsClient: NatsClientService) {}

    async onApplicationBootstrap() {
        this.ping()
    }

    async ping() {
        this.natsClient.reply(SampleNatsRoutesEnum.PING, {
            callback: (_error, message) => {
                message.respond(this.natsClient.encodeMessage('pong'))
            },
        })
    }
}
