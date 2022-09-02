import type { IpcResponse } from '@doubleshot/nest-electron'

declare global {
  interface Window {
    electron: {
      sendMsg(msg: string): Promise<IpcResponse<string>>,
      onReplyMsg(cb: (msg: string) => any): void
    }
  }
}

export { }
