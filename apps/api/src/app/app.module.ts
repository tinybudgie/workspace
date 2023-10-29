import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import {
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { HealthChecksModule } from '@tinybudgie/health-checks'
import { NatsModule } from '@tinybudgie/nats'
import * as env from 'env-var'
import { SampleModule } from 'sample'

@Module({
    imports: [
        HealthChecksModule,
        NatsModule.forRoot({
            connections: [
                {
                    servers: env.get('NATS_URL').required().asString(),
                },
            ],
        }),
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: { federation: 2 },
            playground: false,
            introspection: true,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        SampleModule.forRoot({
            database: {
                url: env.get('SAMPLE_DATABASE_URL').required().asString(),
                logging: 'long_queries',
                maxQueryExecutionTime: 5000,
            },
            api: {
                nats: true,
                graphql: true,
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
