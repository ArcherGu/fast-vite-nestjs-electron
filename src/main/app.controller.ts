import type { BrowserWindow } from 'electron'
import type { Observable } from 'rxjs'
import { IpcHandle, Window } from '@doubleshot/nest-electron'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { of } from 'rxjs'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Window() private readonly mainWin: BrowserWindow,
  ) { }

  @IpcHandle('msg')
  public handleSendMsg(@Payload() msg: string): Observable<string> {
    const { webContents } = this.mainWin
    webContents.send('reply-msg', 'this is msg from webContents.send')
    return of(`The main process received your message: ${msg} at time: ${this.appService.getTime()}`)
  }
}
