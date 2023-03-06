/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Tree } from '@nrwl/devkit'
import {
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nrwl/devkit'
import type { NormalizedOptions } from '../schema'

export function addPrismaCommands(tree: Tree, options: NormalizedOptions): void {
    if (!options.prisma) {
        return
    }

    const project = readProjectConfiguration(tree, options.projectName)

    project.targets!['prisma:generate'] = {
        executor: '@nx/schematics:prisma-generate'
    }

    project.targets!['prisma:pull'] = {
        executor: '@nx/schematics:prisma-pull'
    }

    project.targets!['prisma:migrate'] = {
        executor: '@nx/schematics:prisma-migrate'
    }

    updateProjectConfiguration(tree, options.projectName, project)
}
