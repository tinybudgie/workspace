import { HealthIndicatorResult } from './health-indicator-result.interface'

export interface HealthIndicator {
    name: string
    isHealthy(): Promise<HealthIndicatorResult>
}
