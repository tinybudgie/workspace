/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext, logger } from '@nrwl/devkit'

export function findPrismaSchemaPath(
    context: ExecutorContext,
): string | undefined {
    const projectName = context.projectName

    if (!projectName) {
        logger.error(`prisma-generate must run only in projects`)
    }

    const projectFiles = context.projectGraph?.nodes[projectName!].data.files

    if (projectFiles) {
        for (const { file } of projectFiles) {
            if (file.indexOf('schema.prisma') !== -1) {
                return file
            }
        }
    }

    return undefined
}
