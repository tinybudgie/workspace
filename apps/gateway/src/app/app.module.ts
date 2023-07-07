import { IntrospectAndCompose } from '@apollo/gateway'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { EventloopFrozenDetectorModule } from '@tematools/eventloop-frozen-detector'
import * as env from 'env-var'

@Module({
    imports: [
        EventloopFrozenDetectorModule.forRoot({
            delay: 3000,
        }),
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            server: {
                playground: false,
                plugins: [ApolloServerPluginLandingPageLocalDefault()],
            },
            gateway: {
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: env
                        .get('GATEWAY_SUBGRAPHS')
                        .required()
                        .asJsonArray() as {
                        name: string
                        url: string
                    }[],
                    subgraphHealthCheck: true,
                    pollIntervalInMs: 10000,
                }),
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
