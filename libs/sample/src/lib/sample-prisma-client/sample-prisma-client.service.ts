import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/sample-client'
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

    constructor(
        @Inject(SAMPLE_PRISMA_CLIENT_CONFIG)
        private readonly config: SamplePrismaClientConfig,
    ) {
        super({
            datasources: {
                db: {
                    url: config.databaseUrl,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-extra-semi
            ;(this as any).$on('query', (e) => {
                if (this.config.logging === 'all_queries') {
                    if (e.query !== 'SELECT 1') {
                        this.logger.log(
                            `query: ${e.query}, params: ${e.params}, duration: ${e.duration}`,
                        )
                    }
                }
                if (this.config.logging === 'long_queries') {
                    if (e.duration >= this.config.maxQueryExecutionTime) {
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
