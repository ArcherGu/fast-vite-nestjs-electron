import { EventEmitter } from 'events';

class IPCMessageDispatcher extends EventEmitter {
    // @ts-ignore
    async emit(messageChannel: string, ...args: any[]): Promise<any> {
        const [ipcHandler] = this.listeners('ipc-message');

        if (ipcHandler) {
            return Reflect.apply(ipcHandler, this, [messageChannel, ...args]);
        }
    }
}

export const ipcMessageDispatcher = new IPCMessageDispatcher();