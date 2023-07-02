import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import {
    SampleConfigurableModuleClass,
    SAMPLE_CONFIG,
    SAMPLE_OPTIONS_TYPE,
    patchSampleConfig,
} from './sample-configs/sample-module.config'
import { SampleResolver } from './sample-graphql/sample.resolver'
import { HEALTH_CHECKS_PROVIDER } from 'core/health-checks'
import { SamplePrismaConnectionHealthIndicator } from './sample-indicators/sample-prisma-connection.health'
import { SamplePrismaService } from './sample-services/sample-prisma.service'
import { SampleNatsController } from './sample-nats/sample-nats.controller'
import { CustomInjectorModule } from 'nestjs-custom-injector'

@Module({})
export class SampleModule extends SampleConfigurableModuleClass {
    static forRoot(options: typeof SAMPLE_OPTIONS_TYPE): DynamicModule {
        const imports: any[] = [CustomInjectorModule]
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
            {
                provide: HEALTH_CHECKS_PROVIDER,
                useClass: SamplePrismaConnectionHealthIndicator,
            },
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
