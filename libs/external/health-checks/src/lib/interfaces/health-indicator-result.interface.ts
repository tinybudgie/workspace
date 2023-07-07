export type HealthIndicatorStatus = 'up' | 'down'

export type HealthIndicatorResult = {
    name: string
    status: HealthIndicatorStatus
    error?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: Record<string, any>
}
