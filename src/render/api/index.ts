import { EVENTS } from '@common/events';
import { ipcInstance } from '@render/plugins';

export function sendMsgToMainProcess(msg: string) {
    return ipcInstance.send<string>(EVENTS.SEND_MSG, msg);
}