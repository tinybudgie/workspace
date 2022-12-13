import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class UserGuard extends AuthGuard('user') {
    getRequest(context: ExecutionContext): Request {
        return context.switchToHttp().getRequest()
    }
}
