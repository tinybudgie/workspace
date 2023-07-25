import { applyDecorators, SetMetadata } from '@nestjs/common'

import { HEALTH_INDICATOR_METADATA } from '../health-checks-constants/health-checks.constants'

export function HealthIndicator(name: string) {
    return applyDecorators(SetMetadata(HEALTH_INDICATOR_METADATA, { name }))
}
