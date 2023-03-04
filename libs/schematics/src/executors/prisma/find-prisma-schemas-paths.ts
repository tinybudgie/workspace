/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutorContext, logger } from '@nrwl/devkit'

export function findPrismaSchemaPaths(context: ExecutorContext) {
    const projectName = context.projectName

    if (!projectName) {
        logger.error(`prisma-generate must run only in projects`)
    }

    const projectFiles = context.projectGraph?.nodes[projectName!].data.files

    const prismaSchemasPaths: string[] = []

    if (projectFiles !== undefined) {
        const onlyProjectDependenciesTargets = projectFiles
            .flatMap((file) =>
                file.dependencies !== undefined ? file.dependencies : [],
            )
            .flatMap((dep) =>
                dep.target.indexOf('npm:') === -1 ? [dep.target] : [],
            )

        for (const target of onlyProjectDependenciesTargets) {
            const targetFileData =
                context.projectGraph?.nodes[target].data.files

            if (targetFileData) {
                for (const targetFile of targetFileData) {
                    if (targetFile.file.indexOf('schema.prisma') !== -1) {
                        prismaSchemasPaths.push(targetFile.file)
                    }
                }
            }
        }
    }

    return prismaSchemasPaths
}
