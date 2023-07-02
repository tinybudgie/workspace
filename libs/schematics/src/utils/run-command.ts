import { getExecOutput } from '@actions/exec'
import { getPackageManagerCommand } from '@nx/devkit'

export interface PrismaCommands {
    command: string
    args: string[]
}

export const runCommand = async ({
    command,
    args,
}: PrismaCommands): Promise<{ success: true }> => {
    const cmd = `${getPackageManagerCommand().exec} ${command}`
    await getExecOutput(cmd, args, { ignoreReturnCode: true }).then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(`${res.stderr.trim() ?? 'unknown error'}`)
        }
    })

    return { success: true }
}
