import { Module } from '@nestjs/common'

import { HealthChecksController } from './health-checks.controller'

@Module({
    controllers: [HealthChecksController],
})
export class HealthChecksModule {}
