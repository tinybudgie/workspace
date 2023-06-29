import { Module } from '@nestjs/common'
import { HealthChecksModule } from 'core/health-checks'
import { EventloopFrozenDetectorModule } from 'core/eventloop-frozen-detector'
import { SampleModule } from 'sample'
import { GraphQLModule } from '@nestjs/graphql'
import * as env from 'env-var'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver } from '@nestjs/apollo'

@Module({
    imports: [
        HealthChecksModule,
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: '../../schema.graphql',
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        SampleModule.forRoot({
            database: {
                url: env.get('SAMPLE_DATABASE_URL').required().asString(),
                logging: 'long_queries',
                maxQueryExecutionTime: 5000,
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
