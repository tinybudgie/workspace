/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext, logger, stripIndents } from '@nrwl/devkit'
import { findPrismaSchemaPath } from '../find-prisma-schemas-paths'
import { runCommand } from '../run-command'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    const prismaSchemasPath = findPrismaSchemaPath(context)

    if (prismaSchemasPath) {
        logger.debug(stripIndents`
            Found prisma schema:
            ${prismaSchemasPath}
        `)

        await runCommand({
            command: `prisma generate`,
            args: [`--schema=${prismaSchemasPath}`],
        })
    }

    return {
        success: true,
    }
}
