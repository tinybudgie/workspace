import { DynamicModule, Module } from '@nestjs/common'
import {
    SampleConfigurableModuleClass,
    SAMPLE_ASYNC_OPTIONS_TYPE,
    SAMPLE_CONFIG,
    SAMPLE_OPTIONS_TYPE,
    patchSampleConfig,
} from './sample-configs/sample-module.config'
import { SamplePrismaClientModule } from './sample-prisma-client/sample-prisma-client.module'

@Module({})
export class SampleModule extends SampleConfigurableModuleClass {
    static forRoot(options: typeof SAMPLE_OPTIONS_TYPE): DynamicModule {
        return {
            ...this.forRootAsync({
                useFactory: async () => options,
            }),
        }
    }

    static forRootAsync(
        options?: typeof SAMPLE_ASYNC_OPTIONS_TYPE,
    ): DynamicModule {
        const useFactory = options?.useFactory
        const useClass = options?.useClass

        if (options?.useExisting) {
            throw new Error(`options?.useExisting is not supported!`)
        }

        return {
            module: SampleModule,
            imports: [...(options?.imports || []), SamplePrismaClientModule],
            providers: [
                ...(useClass
                    ? [
                          {
                              provide: `${String(SAMPLE_CONFIG)}_TEMP`,
                              useClass,
                          },
                          {
                              provide: SAMPLE_CONFIG,
                              useFactory: async (config) =>
                                  patchSampleConfig(config),
                              inject: [`${String(SAMPLE_CONFIG)}_TEMP`],
                          },
                      ]
                    : []),
                ...(useFactory
                    ? [
                          {
                              provide: SAMPLE_CONFIG,
                              useFactory: async (...args) =>
                                  patchSampleConfig(await useFactory(...args)),
                              inject: options?.inject || [],
                          },
                      ]
                    : [
                          {
                              provide: SAMPLE_CONFIG,
                              useValue: patchSampleConfig({}),
                          },
                      ]),
            ],
            exports: [SAMPLE_CONFIG],
        }
    }
}
