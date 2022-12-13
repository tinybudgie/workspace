import { DynamicModule, Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { UserGuard } from './guards/user.guard'
import { UserStrategy } from './strategies/user.strategies'
import {
    AuthConfig,
    AUTH_INTEGRATION_PROVIDER,
    AUTH_JWT_CONFIG,
} from './auth.config'
import { JwtModule } from '@nestjs/jwt'
import { CustomInjectorModule } from 'nestjs-custom-injector'
import { TokensService } from './services/auth-tokens.service'

@Module({})
export class AuthModule {
    static forRoot(config: AuthConfig): DynamicModule {
        const { jwt, integration } = config

        return {
            module: AuthModule,
            imports: [JwtModule, CustomInjectorModule],
            providers: [
                AuthService,
                TokensService,
                UserGuard,
                UserStrategy,
                {
                    provide: AUTH_JWT_CONFIG,
                    useValue: jwt,
                },
                {
                    provide: AUTH_INTEGRATION_PROVIDER,
                    useValue: integration,
                },
            ],
        }
    }
}
