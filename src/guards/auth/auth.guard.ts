import {CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
     @Inject('AUTH_SERVICE') private readonly client: ClientProxy
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) throw new HttpException('Authorization header is missing', HttpStatus.UNAUTHORIZED);

    const token = authorization.split('Bearer ')[1];
    if (!token) throw new HttpException('Bearer token is missing',HttpStatus.UNAUTHORIZED);

    const tokenDetails = await this.verifyToken(token)
    if (tokenDetails === null) throw new HttpException('Invalid/token token has expired.', HttpStatus.UNAUTHORIZED);
    request.user = tokenDetails;

    return true;
  }

  private async verifyToken(token: string): Promise<void> {
    const decoded = this.client.send({ cmd: 'verify-token' }, { token });
    const [response] = await Promise.all([decoded.toPromise()]);
    return response;
  }
}
