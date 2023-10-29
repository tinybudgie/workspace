import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@tinybudgie/logger'
import env from 'env-var'
import { SpelunkerModule } from 'nestjs-spelunker'

import { AppModule } from './app/app.module'

const logger = new Logger()

logger.configure({
    json: env.get('LOGGING_JSON').asBool(),
})

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger })

    app.enableShutdownHooks()

    // const diGraph = buildDIGraph(app)

    const port = env.get('PORT').default(3000).asPortNumber()

    await app.listen(port, () => {
        logger.log(`🚀 Application is running on: http://localhost:${port}`)
        // logger.debug(`DI Graph tree\n${diGraph}`)
    })
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
