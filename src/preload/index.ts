import type { IpcResponse } from '@doubleshot/nest-electron-ipc-transport'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'electron',
  {
    sendMsg: (msg: string): Promise<IpcResponse<string>> => ipcRenderer.invoke('msg', msg),
    onReplyMsg: (cb: (msg: string) => any) => ipcRenderer.on('reply-msg', (e, msg: string) => {
      cb(msg)
    }),
  },
)
