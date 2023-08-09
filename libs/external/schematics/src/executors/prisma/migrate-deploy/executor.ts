/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getExecOutput } from '@actions/exec'
import { ExecutorContext } from '@nx/devkit'

import { findPrismaSchemaPath } from '../find-prisma-schemas-paths'
import { PrismaMigrateDeployExecutorSchema } from './schema'

export default async function runExecutor(
    options: PrismaMigrateDeployExecutorSchema,
    context: ExecutorContext,
) {
    const prismaSchemasPath = findPrismaSchemaPath(options, context)

    const replaceEnv = {}

    if (options.replaceUrlEnv) {
        replaceEnv[options.replaceUrlEnv.from] =
            process.env[options.replaceUrlEnv.to]
    }

    const env = {
        ...(process.env as Record<string, string>),
        ...replaceEnv,
    }

    await getExecOutput(
        `npx prisma migrate deploy`,
        [`--schema=${prismaSchemasPath}`],
        {
            ignoreReturnCode: true,
            env,
        },
    ).then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(`${res.stderr.trim() ?? 'unknown error'}`)
        }
    })

    return {
        success: true,
    }
}
