/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Tree, names } from '@nx/devkit'
import {
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nx/devkit'
import type { NormalizedOptions } from '../schema'

export function addPrismaCommands(
    tree: Tree,
    options: NormalizedOptions,
): void {
    if (!options.prisma) {
        return
    }

    const projectNames = names(options.projectName)

    const project = readProjectConfiguration(tree, options.projectName)

    project.targets!['prisma:generate'] = {
        executor: '@nx/schematics:prisma-generate',
        outputs: [
            `{workspaceRoot}/node_modules/@prisma/${projectNames.fileName}-client`,
        ],
    }

    project.targets!['prisma:pull'] = {
        executor: '@nx/schematics:prisma-pull',
    }

    project.targets!['prisma:migrate'] = {
        executor: '@nx/schematics:prisma-migrate',
    }

    updateProjectConfiguration(tree, options.projectName, project)
}
