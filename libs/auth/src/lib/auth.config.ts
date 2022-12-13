import { CreateRefreshToken } from './interfaces/create-refresh-token.interface'
import { CreateUser } from './interfaces/create-user.interface'
import { FindOneUserFilter } from './interfaces/find-one-user-filter'
import { FindUsersFilter } from './interfaces/find-users-filter.interface'
import { UpdateUser } from './interfaces/update-admin'
import { User } from './interfaces/user.interface'

export const AUTH_JWT_CONFIG = Symbol('AUTH_JWT_CONFIG')
export const AUTH_INTEGRATION_PROVIDER = Symbol('AUTH_INTEGRATION_PROVIDER')

export interface AuthConfig {
    jwt: JWTConfig
    integration: AuthIntegration
}

export interface JWTConfig {
    issuerUrl: string
    accessTTL: number
    refreshTTL: number
    secret: string
    expiresIn: string
    algorithm: string
}

export interface AuthIntegration {
    createUser(payload: CreateUser): Promise<User>
    updateUser(id: string, payload: UpdateUser): Promise<User>
    deleteUser(id: string): Promise<User>
    findOneUser(filter: FindOneUserFilter): Promise<User>
    findUsers(filter: FindUsersFilter): Promise<User[]>
    createRefreshToken(data: CreateRefreshToken): Promise<string>
}
