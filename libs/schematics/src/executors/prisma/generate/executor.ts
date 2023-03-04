/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext, logger, stripIndents } from '@nrwl/devkit'
import { findPrismaSchemaPaths } from '../find-prisma-schemas-paths'
import { runCommand } from '../run-command'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    const prismaSchemasPaths = findPrismaSchemaPaths(context)

    for (const prismaPath of prismaSchemasPaths) {
        logger.log(stripIndents`
            Found prisma schema:
            ${prismaPath}
        `)

        await runCommand({
            command: `prisma generate`,
            args: [`--schema=${prismaPath}`],
        })
    }

    return {
        success: true,
    }
}
