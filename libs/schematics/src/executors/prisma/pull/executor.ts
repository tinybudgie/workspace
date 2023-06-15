/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext } from '@nx/devkit'
import { findPrismaSchemaPath } from '../find-prisma-schemas-paths'
import { runCommand } from '../run-command'
import { PrismaPullExecutorSchema } from './schema'

export default async function runExecutor(
    options: PrismaPullExecutorSchema,
    context: ExecutorContext,
) {
    const prismaSchemasPath = findPrismaSchemaPath(options, context)

    await runCommand({
        command: `prisma db pull`,
        args: [`--schema=${prismaSchemasPath}`],
    })

    return {
        success: true,
    }
}
