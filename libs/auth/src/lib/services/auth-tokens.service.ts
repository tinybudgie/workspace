import { JwtService } from '@nestjs/jwt'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import { CustomInject } from 'nestjs-custom-injector'

import { MILLISECONDS } from '../constants/milliseconds.constant'
import { AuthErrorEnum } from '../enums/auth-error.enum'
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface'
import {
    AuthConfig,
    AuthIntegration,
    AUTH_INTEGRATION_PROVIDER,
    AUTH_JWT_CONFIG,
} from '../auth.config'
import { RoleEnum } from '../enums/role.enum'

@Injectable()
export class TokensService {
    @CustomInject(AUTH_JWT_CONFIG)
    private readonly _authConfig!: AuthConfig

    @CustomInject(AUTH_INTEGRATION_PROVIDER)
    private readonly _authIntegration!: AuthIntegration

    constructor(private readonly _jwtService: JwtService) {}

    async generateAccessToken(
        adminId: string,
        role: RoleEnum = RoleEnum.USER,
    ): Promise<string> {
        const signOptions: SignOptions = {
            issuer: this._authConfig.jwt.issuerUrl,
            audience: this._authConfig.jwt.issuerUrl,
            expiresIn: this._authConfig.jwt.accessTTL,
            subject: adminId,
        }

        return await this._jwtService.signAsync(
            {
                role,
            },
            {
                ...signOptions,
                secret: this._authConfig.jwt.secret,
            },
        )
    }

    async generateRefreshToken(
        id: string,
        role: RoleEnum = RoleEnum.USER,
    ): Promise<string> {
        const refreshTokenId = await this._authIntegration.createRefreshToken({
            userId: id,
            expiresAt: new Date(
                Date.now() + this._authConfig.jwt.refreshTTL * MILLISECONDS,
            ),
        })

        const opts: SignOptions = {
            issuer: this._authConfig.jwt.issuerUrl,
            audience: this._authConfig.jwt.issuerUrl,
            expiresIn: this._authConfig.jwt.refreshTTL,
            subject: id,
            jwtid: refreshTokenId,
        }

        return await this._jwtService.signAsync(
            {
                role,
            },
            {
                ...opts,
                secret: this._authConfig.jwt.secret,
            },
        )
    }

    async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        try {
            return await this._jwtService.verifyAsync(token, {
                secret: this._authConfig.jwt.secret,
            })
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new Error(AuthErrorEnum.REFRESH_EXPIRED)
            }

            throw new Error(AuthErrorEnum.REFRESH_MALFORMED)
        }
    }

    get accessTokenTTL(): number {
        return this._authConfig.jwt.accessTTL
    }

    get refreshTokenTTL(): number {
        return this._authConfig.jwt.refreshTTL
    }
}
