import { Module } from '@nestjs/common'
import { HealthChecksModule } from '@nx/core/health-checks'
import { PrismaClientModule } from '@nx/core/prisma-client'
import { EventloopFrozenDetectorModule } from '@nx/core/eventloop-frozen-detector'

import * as env from 'env-var'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        HealthChecksModule,
        PrismaClientModule.forRoot({
            databaseUrl: env.get('DATABASE_URL').required().asString(),
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
