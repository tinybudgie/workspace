import { GenericContainer, StartedTestContainer } from 'testcontainers'

describe('NATS', () => {
    jest.setTimeout(5 * 60 * 1000)

    const SERVER_PORT = 4222
    const serverUrls: string[] = []
    let natsContainer: StartedTestContainer

    beforeAll(async () => {
        // NATS generic container doesn't start with 'nats:latest' -- idk why
        natsContainer = await new GenericContainer('nats:2.9.14-alpine')
            .withExposedPorts(SERVER_PORT)
            .withCommand(['--jetstream'])
            .start()

        serverUrls.push(
            `nats://${natsContainer.getHost()}:${natsContainer.getMappedPort(
                SERVER_PORT,
            )}`,
        )
    })

    afterAll(async () => {
        await natsContainer.stop()
    })

    it('should launch half-life 4', async () => {
        expect(true).toEqual(true)
    })
})
