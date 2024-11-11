import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {RolesGuard} from "../guards/roles/roles.guard";
import {Reflector} from "@nestjs/core";

@Module({
  imports: [PrismaModule, ClientsModule.register([{
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: {
        host: 'host.docker.internal',
        port: 3001
      }
    }
  ])],
  controllers: [UserController],
  providers: [UserService, RolesGuard, Reflector], exports: [RolesGuard]
})
export class UserModule {}
