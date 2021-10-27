import { EventEmitter } from 'events';

class IPCMessageDispatcher extends EventEmitter {
    emit(messageChannel: string, ...args: any[]): any {
        const [ipcHandler] = this.listeners('ipc-message');

        if (ipcHandler) {
            return Reflect.apply(ipcHandler, this, [messageChannel, ...args]);
        }
    }
}

export const ipcMessageDispatcher = new IPCMessageDispatcher();