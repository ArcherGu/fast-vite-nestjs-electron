import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinModule } from './win/win.module';

@Module({
    imports: [WinModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
