import { ipcInstance } from '@renderer/plugins'

export function sendMsgToMainProcess(msg: string) {
  return ipcInstance.send<string>('msg', msg)
}
