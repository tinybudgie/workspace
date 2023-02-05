import { HealthIndicatorResult } from './health-indicator-result.interface'

export interface HealthCheckResult {
    ratio: number // ratio = (failed services / all services)
    uptime: number
    timestamp: number
    services: HealthIndicatorResult[]
}
