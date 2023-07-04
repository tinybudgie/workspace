import { Injectable, OnModuleInit } from '@nestjs/common'
import { NatsJetStreamClientService, PublishOptions } from 'core/nats'
import { PubAck, RetentionPolicy, StorageType } from 'nats'

export enum SampleNatsJetStreamSubjectsEnum {
    PING = 'js.sample.ping',
}

export const SAMPLE_STREAM_NAME = 'sample_stream'

@Injectable()
export class SampleNatsStream implements OnModuleInit {
    constructor(
        private readonly natsJetStreamClient: NatsJetStreamClientService,
    ) {}

    async onModuleInit() {
        await this.natsJetStreamClient.createStream({
            autoupdate: true,
            name: SAMPLE_STREAM_NAME,
            retention: RetentionPolicy.Limits,
            storage: StorageType.File,
            subjects: Object.values(SampleNatsJetStreamSubjectsEnum),
        })
    }

    async publish<T>(
        subject: SampleNatsJetStreamSubjectsEnum,
        payload: T,
        options?: PublishOptions,
    ): Promise<PubAck> {
        return await this.natsJetStreamClient.publish(subject, payload, options)
    }
}
