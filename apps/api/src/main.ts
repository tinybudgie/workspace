import { INestApplication, Logger } from '@nestjs/common'

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

import { NestFactory } from '@nestjs/core'
import env from 'env-var'
import { AppModule } from './app/app.module'
import { SpelunkerModule } from 'nestjs-spelunker'

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
    const app = await NestFactory.create(AppModule)

    const diGraph = buildDIGraph(app)

    const port = env.get('PORT').default(3000).asPortNumber()

    await app.listen(port, () => {
        logger.log(`🚀 Application is running on: http://localhost:${port}`)
        logger.debug(`DI Graph tree\n${diGraph}`)
    })
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

// Copy output to mermaid.live
function buildDIGraph(app: INestApplication) {
    const tree = SpelunkerModule.explore(app)
    const root = SpelunkerModule.graph(tree)
    const edges = SpelunkerModule.findGraphEdges(root)

    const mermaidEdges = edges
        .filter(
            ({ from, to }) =>
                !(
                    from.module.name === 'ConfigHostModule' ||
                    from.module.name === 'LoggerModule' ||
                    to.module.name === 'ConfigHostModule' ||
                    to.module.name === 'LoggerModule'
                ),
        )
        .map(({ from, to }) => `${from.module.name}-->${to.module.name}`)

    return `graph TD\n\t${mermaidEdges.join('\n\t')}`
}
