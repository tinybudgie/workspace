import { HealthIndicatorResult } from './health-indicator-result.interface'

export interface HealthCheckResult {
    healthy: boolean
    ratio: number // ratio = (failed services / all services)
    uptime: number
    timestamp: number
    services: HealthIndicatorResult[]
}
