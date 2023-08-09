export interface PrismaMigrateDeployExecutorSchema {
    schema?: string
    replaceUrlEnv?: {
        from: string
        to: string
    }
} // eslint-disable-line
