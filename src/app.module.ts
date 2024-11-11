import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import { UserModule } from './user/user.module';
import {SeedService} from "./seed/seed.service";
import {PrismaModule} from "./prisma/prisma.module";

@Module({
  imports: [
      ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: 3001
          }
        }
      ]),
      UserModule, PrismaModule
  ],
  controllers: [],
  providers: [SeedService],exports: [SeedService]
})
export class AppModule {}
