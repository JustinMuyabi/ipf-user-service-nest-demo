import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 4001,
    },
  })
  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().then(() => console.log('User service started'));
