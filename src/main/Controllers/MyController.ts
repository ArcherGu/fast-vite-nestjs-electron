import { Controller, IpcInvoke, IpcOn } from '../decorators';
import { MyService } from '../Services/MyService';
import { EVENTS } from '@common/events';

@Controller()
export class MyController {
    constructor(
        private myService: MyService
    ) {

    }

    @IpcOn(EVENTS.REPLY_MSG)
    public async replyMsg(msg: string) {
        return `${this.myService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`;
    }

    @IpcInvoke(EVENTS.SEND_MSG)
    public async handleSendMsg(msg: string): Promise<string> {
        setTimeout(() => {
            this.replyMsg(msg);
        }, this.myService.getDelayTime() * 1000);

        return `The main process received your message: ${msg}`;
    }
}
