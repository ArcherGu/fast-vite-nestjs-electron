import type { IpcResponse } from '@doubleshot/nest-electron-ipc-transport'

declare global {
  interface Window {
    electron: {
      sendMsg(msg: string): Promise<IpcResponse<string>>,
      onReplyMsg(cb: (msg: string) => any): void
    }
  }
}

export { }
