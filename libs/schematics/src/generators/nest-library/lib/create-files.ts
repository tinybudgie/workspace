import type { Tree } from '@nrwl/devkit'
import {
    generateFiles,
    joinPathFragments,
    names,
    offsetFromRoot,
} from '@nrwl/devkit'
import type { NormalizedOptions } from '../schema'

export function createFiles(tree: Tree, options: NormalizedOptions): void {
    const substitutions = {
        ...options,
        ...names(options.projectName),
        tmpl: '',
        offsetFromRoot: offsetFromRoot(options.projectRoot),
    }

    generateFiles(
        tree,
        joinPathFragments(__dirname, '..', 'files', 'common'),
        options.projectRoot,
        substitutions,
    )

    if (options.prisma) {
        generateFiles(
            tree,
            joinPathFragments(__dirname, '..', 'files', 'prisma'),
            options.projectRoot,
            substitutions,
        )
    }
}
