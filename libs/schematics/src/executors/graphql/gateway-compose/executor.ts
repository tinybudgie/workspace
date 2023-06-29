/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLGatewayComposeExecutorSchema } from './schema'
import { getExecOutput } from '@actions/exec'

export default async function runExecutor(
    options: GraphQLGatewayComposeExecutorSchema,
) {
    const args: string[] = []

    options.config
        ? args.push(`--config=${options.config}`)
        : args.push(`--config=apps/gateway/supergraph.config.yaml`)

    options.output
        ? args.push(`-o=${options.output}`)
        : args.push(`-o=apps/gateway/src/assets/supergraph.graphql`)

    await getExecOutput(`rover supergraph compose`, args, {
        ignoreReturnCode: true,
    }).then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(`${res.stderr.trim() ?? 'unknown error'}`)
        }
    })

    return {
        success: true,
    }
}
