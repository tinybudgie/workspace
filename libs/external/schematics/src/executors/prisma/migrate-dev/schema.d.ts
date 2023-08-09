export interface PrismaMigrateDevExecutorSchema {
    schema?: string
    replaceUrlEnv?: {
        from: string
        to: string
    }
    name: string
    createOnly: boolean
    skipGenerate: boolean
    skipSeed: boolean
} // eslint-disable-line
