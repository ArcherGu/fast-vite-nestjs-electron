import { ipcInstance } from '@render/plugins'

export function sendMsgToMainProcess(msg: string) {
  return ipcInstance.send<string>('msg', msg)
}
