import { DynamicModule, Module } from '@nestjs/common'
import { HEALTH_CHECKS_PROVIDER } from 'core/health-checks'
import { SamplePrismaClientConnectionHealthIndicator } from './sample-prisma-client-connection.health'
import {
    SamplePrismaClientConfig,
    SAMPLE_PRISMA_CLIENT_CONFIG,
} from './sample-prisma-client.config'
import { SamplePrismaClientService } from './sample-prisma-client.service'

@Module({})
export class SamplePrismaClientModule {
    static forRoot(config: SamplePrismaClientConfig): DynamicModule {
        return {
            module: SamplePrismaClientModule,
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
