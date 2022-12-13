import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthConfig } from '../auth.config'
import { AuthErrorEnum } from '../enums/auth-error.enum'
import { RoleEnum } from '../enums/role.enum'

export interface AccessTokenPayload {
    role: RoleEnum
    sub: string
}

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(private readonly _authConfig: AuthConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _authConfig.jwt.secret,
            signOptions: {
                expiresIn: _authConfig.jwt.expiresIn || '10m',
                algorithm: _authConfig.jwt.algorithm,
            },
        })
    }

    async validate(payload: AccessTokenPayload): Promise<boolean> {
        const { role } = payload

        if (role !== RoleEnum.USER) {
            throw new Error(AuthErrorEnum.FORBIDDEN)
        }

        return true
    }
}
