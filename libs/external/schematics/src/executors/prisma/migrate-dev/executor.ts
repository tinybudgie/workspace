/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getExecOutput } from '@actions/exec'
import { ExecutorContext } from '@nx/devkit'

import { findPrismaSchemaPath } from '../find-prisma-schemas-paths'
import { PrismaMigrateDevExecutorSchema } from './schema'

export default async function runExecutor(
    options: PrismaMigrateDevExecutorSchema,
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

    if (!options.name) {
        throw new Error('Specify migration name, ex. --name init')
    }

    const args = [`--schema=${prismaSchemasPath}`, `--name=${options.name}`]

    if (options.skipGenerate) {
        args.push(`--skip-generate`)
    }

    if (options.createOnly) {
        args.push(`--create-only`)
    }

    if (options.skipSeed) {
        args.push(`--skip-seed`)
    }

    console.log(args)

    await getExecOutput(`npx prisma migrate dev`, args, {
        ignoreReturnCode: true,
        env,
    }).then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(`${res.stderr.trim() ?? 'unknown error'}`)
        }
    })

    return {
        success: true,
    }
}
