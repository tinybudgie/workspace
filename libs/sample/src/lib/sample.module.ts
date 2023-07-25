import { DynamicModule, Module, Provider, Type } from '@nestjs/common'

import {
    patchSampleConfig,
    SAMPLE_CONFIG,
    SAMPLE_OPTIONS_TYPE,
    SampleConfigurableModuleClass,
} from './sample-configs/sample-module.config'
import { SampleResolver } from './sample-graphql/sample.resolver'
import { SamplePrismaConnectionHealthIndicator } from './sample-indicators/sample-prisma-connection.health'
import { SampleNatsController } from './sample-nats/sample-nats.controller'
import { SampleNatsStream } from './sample-nats/sample-nats.stream'
import { SamplePrismaService } from './sample-services/sample-prisma.service'

@Module({})
export class SampleModule extends SampleConfigurableModuleClass {
    static forRoot(options: typeof SAMPLE_OPTIONS_TYPE): DynamicModule {
        const imports: any[] = []
        const controllers: Type<any>[] = []
        const exports: any[] = [SAMPLE_CONFIG]
        const providers: Provider[] = [
            SamplePrismaService.instance
                ? {
                      provide: SamplePrismaService,
                      useValue: SamplePrismaService.instance,
                  }
                : {
                      provide: SamplePrismaService,
                      useClass: SamplePrismaService,
                  },
            SamplePrismaConnectionHealthIndicator,
            {
                provide: SAMPLE_CONFIG,
                useValue: patchSampleConfig(options),
            },
        ]

        if (options.api?.graphql !== false) {
            providers.push(SampleResolver)
            exports.push(SampleResolver)
        }

        if (options.api?.nats !== false) {
            controllers.push(SampleNatsController)
            providers.push(SampleNatsStream)
        }

        return {
            module: SampleModule,
            imports,
            controllers,
            providers,
            exports,
        }
    }
}
