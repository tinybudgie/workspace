import { Module } from '@nestjs/common'
import { HealthChecksModule } from '@nx/core/health-checks'
import { EventloopFrozenDetectorModule } from '@nx/core/eventloop-frozen-detector'
import { SampleModule, SamplePrismaClientModule } from '@nx/sample'
import { GraphQLModule } from '@nestjs/graphql'
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import * as env from 'env-var'

@Module({
    imports: [
        HealthChecksModule,
        GraphQLModule.forRoot<YogaDriverConfig>({
            driver: YogaDriver,
            autoSchemaFile: 'schema.graphql',
        }),
        SamplePrismaClientModule.forRoot({
            databaseUrl: env.get('DATABASE_URL').required().asString(),
            logging: 'long_queries',
            maxQueryExecutionTime: 5000,
        }),
        SampleModule.forRoot({}),
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
