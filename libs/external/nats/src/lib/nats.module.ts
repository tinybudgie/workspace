import { DiscoveryModule } from '@golevelup/nestjs-discovery'
import { DynamicModule, Module } from '@nestjs/common'

import {
    NATS_ASYNC_OPTIONS_TYPE,
    NATS_CONFIG,
    NATS_OPTIONS_TYPE,
    NatsConfigurableModuleClass,
    patchNatsConfig,
} from './nats-configs/nats-module.config'
import { NatsConnectionHealthIndicator } from './nats-indicators/nats-connection-health.indicator'
import { NatsClientService } from './nats-services/nats-client.service'
import { NatsConnectionService } from './nats-services/nats-connection.service'
import { NatsJetStreamClientService } from './nats-services/nats-jetstream-client.service'
import { NatsListenerService } from './nats-services/nats-listener.service'

@Module({})
export class NatsModule extends NatsConfigurableModuleClass {
    static forRoot(options: typeof NATS_OPTIONS_TYPE): DynamicModule {
        return {
            ...this.forRootAsync({
                useFactory: async () => options,
            }),
        }
    }

    static forRootAsync(
        options?: typeof NATS_ASYNC_OPTIONS_TYPE,
    ): DynamicModule {
        const useFactory = options?.useFactory
        const useClass = options?.useClass

        if (options?.useExisting) {
            throw new Error(`options?.useExisting is not supported!`)
        }

        return {
            global: true,
            module: NatsModule,
            imports: [...(options?.imports || []), DiscoveryModule],
            providers: [
                NatsConnectionService,
                NatsClientService,
                NatsJetStreamClientService,
                NatsListenerService,
                NatsConnectionHealthIndicator,
                ...(useClass
                    ? [
                          {
                              provide: `${String(NATS_CONFIG)}_TEMP`,
                              useClass,
                          },
                          {
                              provide: NATS_CONFIG,
                              useFactory: async (config) =>
                                  patchNatsConfig(config),
                              inject: [`${String(NATS_CONFIG)}_TEMP`],
                          },
                      ]
                    : []),
                ...(useFactory
                    ? [
                          {
                              provide: NATS_CONFIG,
                              useFactory: async (...args) =>
                                  patchNatsConfig(await useFactory(...args)),
                              inject: options?.inject || [],
                          },
                      ]
                    : [
                          {
                              provide: NATS_CONFIG,
                              useValue: patchNatsConfig({}),
                          },
                      ]),
            ],
            exports: [
                NATS_CONFIG,
                NatsConnectionService,
                NatsClientService,
                NatsListenerService,
                NatsJetStreamClientService,
            ],
        }
    }
}
