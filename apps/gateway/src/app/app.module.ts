import { Module } from '@nestjs/common'
import { EventloopFrozenDetectorModule } from 'core/eventloop-frozen-detector'
import { GraphQLModule } from '@nestjs/graphql'
import * as env from 'env-var'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { IntrospectAndCompose } from '@apollo/gateway'

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
