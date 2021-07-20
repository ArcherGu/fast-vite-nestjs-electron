import { EVENTS } from '@common/events';
import { IpcResponse } from '@common/types';
import { toRaw } from 'vue';
const { ipcRenderer } = window.require('electron');

interface IpcInstance {
    send: <T = any>(target: EVENTS, ...args: any[]) => Promise<IpcResponse<T>>;
    on: (event: EVENTS, callback: (...args: any[]) => void) => void;
    off: (event: EVENTS) => void;
}

export const ipcInstance: IpcInstance = {
    send: async <T = any>(target, ...args) => {
        const payloads: any[] = args.map((e) => toRaw(e));
        const response: IpcResponse<T> = await ipcRenderer.invoke(target.toString(), ...payloads);
        if (response.hasOwnProperty('error')) {
            throw response;
        }

        return response;
    },
    on: (event, callback) => ipcRenderer.on(event.toString(), (event, ...args) => {
        callback(...args);
    }),
    off: (event) => ipcRenderer.removeAllListeners(event.toString()),
};

export function useIpc() {
    return ipcInstance;
}
