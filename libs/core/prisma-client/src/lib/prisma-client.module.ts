import { DynamicModule, Module } from '@nestjs/common'
import { CustomInjectorModule } from 'nestjs-custom-injector'
import {
    PrismaClientConfig,
    PRISMA_CLIENT_CONFIG,
} from './prisma-client.config'
import { PrismaClientService } from './prisma-client.service'

@Module({
    imports: [CustomInjectorModule],
    providers: [PrismaClientService],
    exports: [PrismaClientService],
})
class PrismaClientModuleCore {}

@Module({
    imports: [PrismaClientModuleCore],
    exports: [PrismaClientModuleCore],
})
export class PrismaClientModule {
    static forRoot(config: PrismaClientConfig): DynamicModule {
        return {
            module: PrismaClientModule,
            providers: [
                {
                    provide: PRISMA_CLIENT_CONFIG,
                    useValue: config,
                },
            ],
        }
    }
}
