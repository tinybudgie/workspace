import { Injectable } from '@nestjs/common'
import { User } from '../interfaces/user.interface'
import { CreateUser } from '../interfaces/create-user.interface'
import { UpdateUser } from '../interfaces/update-admin'
import { SignIn } from '../interfaces/sign-in.interface'
import { TokensService } from './auth-tokens.service'
import * as bcrypt from 'bcrypt'
import { FindUsersFilter } from '../interfaces/find-users-filter.interface'
import { AuthorizedUser } from '../interfaces/authorized-user.interface'
import { MILLISECONDS } from '../constants/milliseconds.constant'
import { CustomInject } from 'nestjs-custom-injector'
import { AuthErrorEnum } from '../enums/auth-error.enum'
import { FindOneUserFilter } from '../interfaces/find-one-user-filter'
import { AUTH_INTEGRATION_PROVIDER, AuthIntegration } from '../auth.config'

@Injectable()
export class AuthService {
    @CustomInject(AUTH_INTEGRATION_PROVIDER)
    private readonly _authIntegration!: AuthIntegration

    constructor(private readonly _tokensService: TokensService) {}

    /**
     * Create new user in database
     */
    async createUser(data: CreateUser): Promise<User> {
        const { password, login } = data

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await this._authIntegration.findOneUser({
            login,
        })

        if (user) {
            throw new Error(AuthErrorEnum.USER_EXISTS)
        }

        const newUser = await this._authIntegration.createUser({
            ...data,
            password: hashedPassword,
        })

        return newUser
    }

    /**
     * Update users's fields in database
     */
    async updateUser(id: string, data: UpdateUser): Promise<User> {
        const user = this._authIntegration.updateUser(id, data)

        return user
    }

    /**
     * Delete user from database
     */
    async deleteUser(id: string): Promise<boolean> {
        await this._authIntegration.deleteUser(id)

        return true
    }

    /**
     * Find one user from database
     */
    async findOne(filter: FindOneUserFilter): Promise<User> {
        const user = await this._authIntegration.findOneUser(filter)

        if (!user) {
            throw new Error(AuthErrorEnum.USER_NOT_FOUND)
        }

        return user
    }

    /**
     * Get all users by filter
     */
    async find(data: FindUsersFilter): Promise<User[]> {
        const users = await this._authIntegration.findUsers(data)

        return users
    }

    /**
     * Auth admin with login and password and generate new tokens
     */
    async signIn(data: SignIn): Promise<AuthorizedUser> {
        const { login } = data

        const user = await this._authIntegration.findOneUser({
            login,
        })

        if (!user) {
            throw new Error(AuthErrorEnum.USER_NOT_FOUND)
        }

        const { id, password } = user

        const isPasswordValid = await bcrypt.compare(data.password, password)

        if (!isPasswordValid) {
            throw new Error(AuthErrorEnum.USER_NOT_FOUND)
        }

        const refreshToken = await this._tokensService.generateRefreshToken(id)

        const accessToken = await this._tokensService.generateAccessToken(id)

        return {
            userId: id,
            accessToken,
            refreshToken,
            expiresAt:
                Math.floor(Date.now() / MILLISECONDS) +
                this._tokensService.accessTokenTTL,
        }
    }
}
