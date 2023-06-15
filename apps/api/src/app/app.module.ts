import { Module } from '@nestjs/common'
import { HealthChecksModule } from 'core/health-checks'
import { EventloopFrozenDetectorModule } from 'core/eventloop-frozen-detector'
import { SampleModule, SamplePrismaClientModule } from 'sample'
import { GraphQLModule } from '@nestjs/graphql'
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import * as env from 'env-var'

@Module({
    imports: [
        HealthChecksModule,
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
        GraphQLModule.forRoot<YogaDriverConfig>({
            driver: YogaDriver,
            autoSchemaFile: 'schema.graphql',
        }),
        SamplePrismaClientModule.forRoot({
            databaseUrl: env.get('SAMPLE_DATABASE_URL').required().asString(),
            logging: 'long_queries',
            maxQueryExecutionTime: 5000,
        }),
        SampleModule.forRoot({}),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
