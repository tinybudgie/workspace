import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'

import {
    EVENTLOOP_FROZEN_DETECTOR_CONFIG,
    EventloopFrozenDetectorConfig,
} from './eventloop-frozen-detector.config'

@Injectable()
export class EventloopFrozenDetectorService
    implements OnModuleInit, OnModuleDestroy
{
    private readonly _logger = new Logger(EventloopFrozenDetectorService.name)
    private intervalRef!: NodeJS.Timer

    constructor(
        @Inject(EVENTLOOP_FROZEN_DETECTOR_CONFIG)
        private readonly config: EventloopFrozenDetectorConfig,
    ) {}

    onModuleInit() {
        this._logger.log('onModuleInit')
        let tmStart = new Date().getTime()

        this.intervalRef = setInterval(() => {
            const endTime = new Date().getTime()
            const diff = endTime - tmStart

            if (diff >= this.config.delay) {
                this._logger.error(
                    `NodeJS event loop was frozen more than ${(
                        this.config.delay / 1000
                    ).toFixed(4)}s. Freeze duration was: ${diff}ms.`,
                )
            }

            tmStart = endTime
        }, this.config.interval || 1000)
    }

    onModuleDestroy() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef)
        }
    }
}
