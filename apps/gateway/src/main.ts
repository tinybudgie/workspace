import { Logger } from '@nestjs/common'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloGateway } from '@apollo/gateway'
import { readFileSync } from 'fs'
const logger = new Logger('Application')

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

import env from 'env-var'
import { join } from 'path'

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

async function bootstrap() {
    const port = env.get('GATEWAY_PORT').default(3052).asPortNumber()

    const server = new ApolloServer({
        gateway: new ApolloGateway({
            supergraphSdl: readFileSync(
                join(__dirname, 'assets', 'supergraph.graphql'),
            ).toString(),
        }),
    })

    const { url } = await startStandaloneServer(server, {
        listen: {
            port,
        },
    })

    logger.log(`Gateway ready at ${url}`)
}

try {
    bootstrap().catch((err) => {
        logger.error(err, err.stack)
    })
} catch (err) {
    logger.error(err, err.stack)
}

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        logger.log('exit: clean')
    }
    if (exitCode || exitCode === 0) {
        if (exitCode !== 0) {
            logger.error(exitCode, exitCode.stack)
        } else {
            logger.log(`exit: code - ${exitCode}`)
        }
    }
    if (options.exit) {
        process.exit()
    }
}
