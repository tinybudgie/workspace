export const SAMPLE_PRISMA_CLIENT_CONFIG = Symbol('SAMPLE_PRISMA_CLIENT_CONFIG')

export interface SamplePrismaClientConfig {
    databaseUrl: string
    logging: 'all_queries' | 'long_queries'
    maxQueryExecutionTime: number
}
