/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { ExecutorContext } from '@nx/devkit'

import { getProjectRoot } from '../../utils/get-project-root'
import { PrismaGenerateExecutorSchema } from './generate/schema'

export function findPrismaSchemaPath(
    options: PrismaGenerateExecutorSchema,
    context: ExecutorContext,
): string | undefined {
    const { schema } = options

    if (!schema) {
        const defaultProjectRoot = join(
            getProjectRoot(context),
            'src/prisma/schema.prisma',
        )

        if (!existsSync(defaultProjectRoot)) {
            throw new Error(
                `Can't find prisma schema in your lib, specify schema manually or add it to src/prisma/schema.prisma`,
            )
        }

        return defaultProjectRoot
    }

    if (!existsSync(schema)) {
        throw new Error(`Provided --schema at ${schema} does not exist`)
    }

    return schema
}
