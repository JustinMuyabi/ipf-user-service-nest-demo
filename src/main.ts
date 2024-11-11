import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from "@nestjs/microservices";
import { SeedService } from "./seed/seed.service";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001
    },
  })

  const seeder: SeedService = app.get(SeedService);

  await seeder.seed();
  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().then(() => console.log('User service started'));
