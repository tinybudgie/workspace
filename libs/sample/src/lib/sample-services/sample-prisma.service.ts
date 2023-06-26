import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/sample-client'
import {
    SAMPLE_CONFIG,
    SampleConfig,
} from '../sample-configs/sample-module.config'

@Injectable()
export class SamplePrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    public static instance: SamplePrismaService

    private logger = new Logger(SamplePrismaService.name)

    constructor(
        @Inject(SAMPLE_CONFIG)
        private readonly config: SampleConfig,
    ) {
        super({
            datasources: {
                db: {
                    url: config.database.url,
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
        SamplePrismaService.instance = this
    }

    async onModuleInit(): Promise<void> {
        const { logging, maxQueryExecutionTime } = this.config.database

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-extra-semi
            ;(this as any).$on('query', (e) => {
                if (logging === 'all_queries') {
                    if (e.query !== 'SELECT 1') {
                        this.logger.log(
                            `query: ${e.query}, params: ${e.params}, duration: ${e.duration}`,
                        )
                    }
                }
                if (logging === 'long_queries') {
                    if (e.duration >= maxQueryExecutionTime) {
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
        await this.$disconnect()
    }
}
