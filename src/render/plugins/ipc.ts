import { IpcResponse } from '@common/types';
import { getCurrentInstance, onUnmounted, toRaw } from 'vue';
const { ipcRenderer } = window.require('electron');

interface IpcInstance {
    send: <T = any>(target: string, ...args: any[]) => Promise<IpcResponse<T>>;
    on: (event: string, callback: (...args: any[]) => void) => void;
}

export const ipcInstance: IpcInstance = {
    send: async <T = any>(target: string, ...args: any[]) => {
        const payloads: any[] = args.map((e) => toRaw(e));
        const response: IpcResponse<T> = await ipcRenderer.invoke(target, ...payloads);
        if (response.hasOwnProperty('error')) {
            throw response.error;
        }

        return response;
    },
    on: (event, callback) => {
        ipcRenderer.on(event, (e, ...args) => {
            callback(...args);

        });

        // Use tryOnUnmounted if use @vueuse https://vueuse.org/shared/tryOnUnmounted/
        if (getCurrentInstance()) {
            onUnmounted(() => {
                ipcRenderer.removeAllListeners(event)
            });
        }
    },
};

export function useIpc() {
    return ipcInstance;
}
