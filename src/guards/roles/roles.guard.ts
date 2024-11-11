import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
      private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new HttpException('User is not authenticated', HttpStatus.UNAUTHORIZED);

    const hasRole = roles.includes(user.role);
    if (!hasRole) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);

    return hasRole;
  }
}
