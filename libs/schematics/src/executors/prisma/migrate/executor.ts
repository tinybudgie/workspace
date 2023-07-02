/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext } from '@nx/devkit'

import { runCommand } from '../../../utils/run-command'
import { findPrismaSchemaPath } from '../find-prisma-schemas-paths'
import { PrismaMigrateExecutorSchema } from './schema'

export default async function runExecutor(
    options: PrismaMigrateExecutorSchema,
    context: ExecutorContext,
) {
    const prismaSchemasPath = findPrismaSchemaPath(options, context)

    await runCommand({
        command: `prisma migrate deploy`,
        args: [`--schema=${prismaSchemasPath}`],
    })

    return {
        success: true,
    }
}
