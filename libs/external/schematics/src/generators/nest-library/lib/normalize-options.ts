import { extractLayoutDirectory, Tree } from '@nx/devkit'
import { getWorkspaceLayout, joinPathFragments, names } from '@nx/devkit'
import { Linter } from '@nx/eslint'
import type { LibraryGeneratorSchema as JsLibraryGeneratorSchema } from '@nx/js/src/utils/schema'

import type { LibraryGeneratorOptions, NormalizedOptions } from '../schema'

export function normalizeOptions(
    tree: Tree,
    options: LibraryGeneratorOptions,
): NormalizedOptions {
    const { layoutDirectory, projectDirectory } = extractLayoutDirectory(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        options.directory!,
    )
    const { libsDir: defaultLibsDir } = getWorkspaceLayout(tree)
    const libsDir = layoutDirectory ?? defaultLibsDir
    const name = names(options.name).fileName
    const fullProjectDirectory = projectDirectory
        ? `${names(projectDirectory).fileName}/${name}`
        : name

    const projectName = fullProjectDirectory.replace(new RegExp('/', 'g'), '-')
    const fileName = projectName
    const projectRoot = joinPathFragments(libsDir, fullProjectDirectory)

    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : []

    const normalized: NormalizedOptions = {
        ...options,
        prisma: options.prisma ?? true,
        fileName,
        global: options.global ?? false,
        linter: options.linter ?? Linter.EsLint,
        parsedTags,
        prefix: '', // we could also allow customizing this
        projectDirectory: fullProjectDirectory,
        projectName,
        projectRoot,
        target: options.target ?? 'es6',
        testEnvironment: options.testEnvironment ?? 'node',
        libsDir,
    }

    return normalized
}

export function toJsLibraryGeneratorOptions(
    options: LibraryGeneratorOptions,
): JsLibraryGeneratorSchema {
    return {
        name: options.name,
        buildable: options.buildable,
        directory: options.directory,
        importPath: options.importPath,
        linter: options.linter,
        publishable: options.publishable,
        skipFormat: true,
        skipTsConfig: options.skipTsConfig,
        strict: options.strict,
        tags: options.tags,
        testEnvironment: options.testEnvironment,
        config: options.standaloneConfig ? 'project' : 'workspace',
        setParserOptionsProject: options.setParserOptionsProject,
        unitTestRunner: options.unitTestRunner ?? 'jest',
    }
}
