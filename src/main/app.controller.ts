import { Controller, Inject } from '@nestjs/common'
import { WebContents } from 'electron'
import { AppService } from './app.service'
import { IpcInvoke } from './transport'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('WEB_CONTENTS') private readonly webContents: WebContents,
  ) { }

  @IpcInvoke('msg')
  public async handleSendMsg(msg: string): Promise<string> {
    this.webContents.send('reply-msg', 'this is msg from webContents.send')
    return `The main process received your message: ${msg} at time: ${this.appService.getTime()}`
  }
}
