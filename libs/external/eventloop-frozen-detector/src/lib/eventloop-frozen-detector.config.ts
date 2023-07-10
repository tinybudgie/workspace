export const EVENTLOOP_FROZEN_DETECTOR_CONFIG = Symbol(
    'EVENTLOOP_FROZEN_DETECTOR_CONFIG',
)

export interface EventloopFrozenDetectorConfig {
    delay: number
    interval?: number
}
