export interface HealthCheckResult {
    healthy: boolean
    ratio: number // ratio = (failed services / all services)
    uptime: number
    timestamp: number
    services: HealthIndicatorResult[]
}

export type HealthIndicatorStatus = 'up' | 'down'

export type HealthIndicatorResult = {
    status: HealthIndicatorStatus
    error?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: Record<string, any>
}
