/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Tree } from '@nrwl/devkit'
import {
    addGlobal,
    removeChange,
} from '@nrwl/workspace/src/utilities/ast-utils'
import type { NormalizedOptions } from '../schema'
import { ensureTypescript } from '@nrwl/js/src/utils/typescript/ensure-typescript'

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

    if (options.prisma) {
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-prisma-client/${options.fileName}-prisma-client-connection.health';`,
        )
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-prisma-client/${options.fileName}-prisma-client.config';`,
        )
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-prisma-client/${options.fileName}-prisma-client.module';`,
        )
        sourceFile = addGlobal(
            tree,
            sourceFile,
            indexPath,
            `export * from './lib/${options.fileName}-prisma-client/${options.fileName}-prisma-client.service';`,
        )
    }
}
