import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import { UserModule } from './user/user.module';

@Module({
  imports: [
      ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 3001
          }
        }
      ]),
      UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
