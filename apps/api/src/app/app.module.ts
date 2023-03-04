import { Module } from '@nestjs/common'
import { HealthChecksModule } from '@nx/core/health-checks'
import { EventloopFrozenDetectorModule } from '@nx/core/eventloop-frozen-detector'
import * as env from 'env-var'

@Module({
    imports: [
        HealthChecksModule,
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
