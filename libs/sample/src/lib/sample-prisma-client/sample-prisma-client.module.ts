import { DynamicModule, Module } from '@nestjs/common'
import { HEALTH_CHECKS_PROVIDER } from '@nx/core/health-checks'
import { CustomInjectorModule } from 'nestjs-custom-injector'
import { SamplePrismaClientConnectionHealthIndicator } from './sample-prisma-client-connection.health'
import {
    SamplePrismaClientConfig,
    SAMPLE_PRISMA_CLIENT_CONFIG,
} from './sample-prisma-client.config'
import { SamplePrismaClientService } from './sample-prisma-client.service'

@Module({
    imports: [CustomInjectorModule],
    providers: [
        SamplePrismaClientService.instance
            ? {
                  provide: SamplePrismaClientService,
                  useValue: SamplePrismaClientService.instance,
              }
            : {
                  provide: SamplePrismaClientService,
                  useClass: SamplePrismaClientService,
              },
    ],
    exports: [SamplePrismaClientService],
})
class SamplePrismaClientModuleCore {}

@Module({
    imports: [SamplePrismaClientModuleCore],
    exports: [SamplePrismaClientModuleCore],
})
export class SamplePrismaClientModule {
    static forRoot(config: SamplePrismaClientConfig): DynamicModule {
        return {
            module: SamplePrismaClientModule,
            providers: [
                {
                    provide: SAMPLE_PRISMA_CLIENT_CONFIG,
                    useValue: {
                        ...config,
                        databaseUrl: config.databaseUrl,
                    },
                },
                {
                    provide: HEALTH_CHECKS_PROVIDER,
                    useClass: SamplePrismaClientConnectionHealthIndicator,
                },
            ],
        }
    }
}
