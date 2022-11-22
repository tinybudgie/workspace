import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import {
    EventloopFrozenDetectorConfig,
    EVENTLOOP_FROZEN_DETECTOR_CONFIG,
} from './eventloop-frozen-detector.config'

@Injectable()
export class EventloopFrozenDetectorService
    implements OnModuleInit, OnModuleDestroy
{
    private readonly _logger = new Logger(EventloopFrozenDetectorService.name)
    private _intervalRef!: NodeJS.Timer

    constructor(
        @Inject(EVENTLOOP_FROZEN_DETECTOR_CONFIG)
        private readonly _config: EventloopFrozenDetectorConfig,
    ) {}

    onModuleInit() {
        this._logger.log('onModuleInit')
        let tmStart = new Date().getTime()

        this._intervalRef = setInterval(() => {
            const endTime = new Date().getTime()
            const diff = endTime - tmStart

            if (diff >= this._config.delay) {
                this._logger.error(
                    `NodeJS event loop was frozen more than 3s. Freeze duration was: ${diff}ms.`,
                )
            }

            tmStart = endTime
        }, 1000)
    }

    onModuleDestroy() {
        this._logger.log('onModuleDestroy')

        if (this._intervalRef) {
            clearInterval(this._intervalRef)
        }
    }
}
