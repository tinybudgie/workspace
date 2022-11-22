import { Module } from '@nestjs/common'
import { HealthChecksModule } from '@nxnest/core/health-checks'
import {
    PrismaClientConnectionHealthIndicator,
    PrismaClientModule,
} from '@nxnest/core/prisma-client'
import { EventloopFrozenDetectorModule } from '@nxnest/core/eventloop-frozen-detector'

import * as env from 'env-var'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        HealthChecksModule.forRootAsync({
            imports: [PrismaClientModule],
            useFactory: async () => ({
                tag: env.get('TAG_VERSION').asString(),
                commit: env.get('DEPLOY_COMMIT').asString(),
                version: env.get('DEPLOY_VERSION').asString(),
                date: env.get('DEPLOY_DATE').asString(),
            }),
            healthIndicators: [PrismaClientConnectionHealthIndicator],
        }),
        PrismaClientModule.forRoot({
            databaseUrl: env.get('POSTGRES_URL').required().asString(),
            logging: 'long_queries',
            maxQueryExecutionTime: 5000,
        }),
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
