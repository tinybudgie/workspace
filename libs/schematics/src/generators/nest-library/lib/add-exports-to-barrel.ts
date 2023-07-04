/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Tree } from '@nx/devkit'
import { addGlobal, removeChange } from '@nx/js'
import { ensureTypescript } from '@nx/js/src/utils/typescript/ensure-typescript'

import type { NormalizedOptions } from '../schema'

let tsModule: typeof import('typescript')

export function addExportsToBarrelFile(
    tree: Tree,
    options: NormalizedOptions,
): void {
    if (!tsModule) {
        tsModule = ensureTypescript()
    }
    const indexPath = `${options.projectRoot}/src/index.ts`
    const indexContent = tree.read(indexPath, 'utf-8')
    let sourceFile = tsModule.createSourceFile(
        indexPath,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        indexContent!,
        tsModule.ScriptTarget.Latest,
        true,
    )

    sourceFile = removeChange(
        tree,
        sourceFile,
        indexPath,
        0,
        `export * from './lib/${options.fileName}';`,
    )
    sourceFile = addGlobal(
        tree,
        sourceFile,
        indexPath,
        `export * from './lib/${options.fileName}.module';`,
    )
    sourceFile = addGlobal(
        tree,
        sourceFile,
        indexPath,
        `export * from './lib/${options.fileName}-configs/${options.fileName}-module.config';`,
    )
    sourceFile = addGlobal(
        tree,
        sourceFile,
        indexPath,
        `export * from './lib/${options.fileName}-nats/${options.fileName}-nats.controller';`,
    )
    sourceFile = addGlobal(
        tree,
        sourceFile,
        indexPath,
        `export * from './lib/${options.fileName}-nats/${options.fileName}-nats.stream';`,
    )
    sourceFile = addGlobal(
        tree,
        sourceFile,
        indexPath,
        `export * from './lib/${options.fileName}-graphql/${options.fileName}.resolver';`,
    )

    if (options.prisma) {
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-indicators/${options.fileName}-prisma-connection.health';`,
        )
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-services/${options.fileName}-prisma.service';`,
        )
    }
}
