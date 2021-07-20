import { Controller } from '@nestjs/common';
import { EVENTS } from '@common/events';
import { AppService } from './app.service';
import { IpcInvoke } from './transport';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @IpcInvoke(EVENTS.SEND_MSG)
    public async handleSendMsg(msg: string): Promise<string> {
        return `The main process received your message: ${msg} + ${this.appService.getDelayTime()}`;
    }
}
