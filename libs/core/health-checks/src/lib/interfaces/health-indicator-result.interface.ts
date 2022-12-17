export type HealthIndicatorStatus = 'up' | 'down'

export type HealthIndicatorResult = {
    name: string
    status: HealthIndicatorStatus
    error?: string
}
