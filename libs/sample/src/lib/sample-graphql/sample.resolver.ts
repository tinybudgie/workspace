import { Query, Resolver } from '@nestjs/graphql'

import { SamplePrismaService } from '../sample-services/sample-prisma.service'

@Resolver()
export class SampleResolver {
    constructor(private readonly prisma: SamplePrismaService) {}

    @Query(() => String)
    async samplePing(): Promise<string> {
        return 'pong'
    }
}
