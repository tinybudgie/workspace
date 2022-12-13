// import { CommonError, CommonErrorEnum } from '@info-system/core/errors'
// import { JwtModule } from '@nestjs/jwt'
// import { Test, TestingModule } from '@nestjs/testing'
// import { Admin, PrismaClient, RefreshToken, RoleEnum } from '@prisma/client'
// import { CustomInjectorModule } from 'nestjs-custom-injector'
// import { TokensService } from './auth-tokens.service'
// import { AuthService } from './auth.service'
// import { AUTH_TOKEN_CONFIG } from './auth-token.config'
// import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
// import * as bcrypt from 'bcrypt'
// import {
//     PrismaClientModule,
//     PrismaClientService,
// } from '@info-system/core/prisma-client'

// type Context = {
//     prisma: PrismaClientService
// }

// type MockContext = {
//     prisma: DeepMockProxy<PrismaClient>
// }

// const createMockContext = (): MockContext => {
//     return {
//         prisma: mockDeep<PrismaClient>(),
//     }
// }

// describe('AuthService', () => {
//     let authService: AuthService
//     let mockPrisma: MockContext
//     let prisma: Context
//     let prismaMockedAdmin: Admin
//     let prismaMockedToken: RefreshToken

//     beforeEach(async () => {
//         mockPrisma = createMockContext()
//         prisma = mockPrisma as unknown as Context

//         const module: TestingModule = await Test.createTestingModule({
//             imports: [
//                 JwtModule,
//                 CustomInjectorModule,
//                 PrismaClientModule.forRoot({
//                     databaseUrl:
//                         'postgres://user:secret@localhost:5432/user?schema=public',
//                     logging: 'long_queries',
//                     maxQueryExecutionTime: 10000,
//                 }),
//             ],
//             providers: [
//                 AuthService,
//                 TokensService,
//                 {
//                     provide: AUTH_TOKEN_CONFIG,
//                     useValue: {
//                         jwt: {
//                             issuerUrl: 'testIssuer',
//                             accessTTL: 600,
//                             refreshTTL: 86400,
//                             secret: 'secret',
//                             expiresIn: '10m',
//                             algorithm: 'HS256',
//                         },
//                     },
//                 },
//                 {
//                     provide: PrismaClientService,
//                     useValue: prisma.prisma,
//                 },
//             ],
//         }).compile()

//         const salt = await bcrypt.genSalt()
//         const hashedPassword = await bcrypt.hash('examplePassword', salt)

//         prismaMockedAdmin = {
//             id: 'exampleAdmin',
//             name: 'exampleName',
//             surname: 'exampleSurname',
//             login: 'testAdmin',
//             role: RoleEnum.ADMIN,
//             telegramId: '@exampleTelegramId',
//             password: hashedPassword,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             deleted: false,
//         }

//         prismaMockedToken = {
//             id: 'exampleTokenId',
//             adminId: 'exampleAdminId',
//             isRevoked: false,
//             expiresAt: new Date(),
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             deleted: false,
//         }

//         authService = module.get<AuthService>(AuthService)
//     })

//     it('should be defined', () => {
//         expect(authService).toBeDefined()
//     })

//     it('should signIn with login and password', async () => {
//         const adminLogin = {
//             login: 'testAdmin',
//             password: 'examplePassword',
//         }

//         mockPrisma.prisma.admin.findUnique.mockResolvedValue(prismaMockedAdmin)
//         mockPrisma.prisma.refreshToken.create.mockResolvedValue(
//             prismaMockedToken,
//         )

//         const adminSignInResult = await authService.signIn(adminLogin)

//         const admin = await authService.findOne(adminSignInResult.adminId)

//         expect(adminSignInResult.adminId).toEqual(admin.id)
//     })

//     it('should signIn with telegramId', async () => {
//         const adminsTelegramId = '@exampleTelegramId'

//         mockPrisma.prisma.admin.findUnique.mockResolvedValue(prismaMockedAdmin)
//         mockPrisma.prisma.refreshToken.create.mockResolvedValue(
//             prismaMockedToken,
//         )

//         const adminSignInResult = await authService.signInTelegram(
//             adminsTelegramId,
//         )

//         const admin = await authService.findOne(adminSignInResult.adminId)

//         expect(adminSignInResult.adminId).toEqual(admin.id)
//     })

//     describe('Should fail tests', () => {
//         it('should fail signIn with login and password, admin not found error', async () => {
//             const adminLogin = {
//                 login: 'notExistLogin',
//                 password: 'notExistPassword',
//             }

//             mockPrisma.prisma.admin.findUnique.mockResolvedValue(
//                 prismaMockedAdmin,
//             )
//             mockPrisma.prisma.refreshToken.create.mockResolvedValue(
//                 prismaMockedToken,
//             )

//             await expect(authService.signIn(adminLogin)).rejects.toEqual(
//                 new CommonError<CommonErrorEnum>(
//                     CommonErrorEnum.RequestError,
//                     'Invalid login or password',
//                 ),
//             )
//         })

//         it('should fail signIn with telegramId, admin not found error', async () => {
//             const adminsTelegramId = '@exampleAdmin'

//             mockPrisma.prisma.admin.findUnique.mockResolvedValue(null)

//             await expect(
//                 authService.signInTelegram(adminsTelegramId),
//             ).rejects.toEqual(
//                 new CommonError<CommonErrorEnum>(
//                     CommonErrorEnum.RequestError,
//                     'Not an admin',
//                 ),
//             )
//         })
//     })
// })
