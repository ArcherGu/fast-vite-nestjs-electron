import { IpcResponse } from '@common/types';
import { toRaw } from 'vue';
const { ipcRenderer } = window.require('electron');

interface IpcInstance {
    send: <T = any>(target: string, ...args: any[]) => Promise<IpcResponse<T>>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string) => void;
}

export const ipcInstance: IpcInstance = {
    send: async <T = any>(target: string, ...args: any[]) => {
        const payloads: any[] = args.map((e) => toRaw(e));
        const response: IpcResponse<T> = await ipcRenderer.invoke(target, ...payloads);
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
