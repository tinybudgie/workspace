import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/sample-client'
import { CustomInject, CustomInjectorService } from 'nestjs-custom-injector'
import {
    SamplePrismaClientConfig,
    SAMPLE_PRISMA_CLIENT_CONFIG,
} from './sample-prisma-client.config'

@Injectable()
export class SamplePrismaClientService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    public static instance: SamplePrismaClientService

    private logger = new Logger(SamplePrismaClientService.name)

    @CustomInject(SAMPLE_PRISMA_CLIENT_CONFIG)
    private readonly prismaClientConfig!: SamplePrismaClientConfig

    constructor(customInjectorService: CustomInjectorService) {
        super({
            datasources: {
                db: {
                    url: customInjectorService.getProvider<SamplePrismaClientConfig>(
                        SAMPLE_PRISMA_CLIENT_CONFIG,
                    ).databaseUrl,
                },
            },
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'event',
                    level: 'error',
                },
            ],
        })
        SamplePrismaClientService.instance = this
    }

    async onModuleInit(): Promise<void> {
        this.logger.log('onModuleInit')
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(this as any).$on('query', (e) => {
                if (this.prismaClientConfig.logging === 'all_queries') {
                    if (e.query !== 'SELECT 1') {
                        this.logger.log(
                            `query: ${e.query}, params: ${e.params}, duration: ${e.duration}`,
                        )
                    }
                }
                if (this.prismaClientConfig.logging === 'long_queries') {
                    if (
                        e.duration >=
                        this.prismaClientConfig.maxQueryExecutionTime
                    ) {
                        this.logger.warn(
                            `query is slow: ${e.query}, params: ${e.params}, execution time: ${e.duration}`,
                        )
                    }
                }
            })
            await this.$connect()
            setInterval(
                () =>
                    this.$queryRaw`SELECT 1`.catch((err) =>
                        this.logger.error(err, err.stack),
                    ),
                5 * 60000,
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (!String(err).includes('fake')) {
                this.logger.error(err, err.stack)
            }
            this.$disconnect()
        }
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log('onModuleDestroy')
        await this.$disconnect()
    }
}
