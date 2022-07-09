import { NestFactory } from '@nestjs/core'
import { app } from 'electron'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { ElectronIpcTransport } from './transport'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        strategy: new ElectronIpcTransport(),
      },
    )

    await nestApp.listen()
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    app.quit()
  }
}

bootstrap()

