import { join } from 'node:path'

import { ExecutorContext } from '@nx/devkit'

export const getProjectRoot = (
    context: Pick<ExecutorContext, 'root' | 'workspace' | 'projectName'>,
) => {
    return join(
        context.root,
        context.workspace?.projects?.[context.projectName || '']?.root || '',
    )
}
