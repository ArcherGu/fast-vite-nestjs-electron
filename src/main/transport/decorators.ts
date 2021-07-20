import { applyDecorators } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ipcMain } from 'electron';
import { ipcMessageDispatcher } from './dispatcher';

export function IpcInvoke(messageChannel: string) {
    ipcMain.handle(messageChannel, (...args) => ipcMessageDispatcher.emit(messageChannel, ...args));

    return applyDecorators(
        MessagePattern(messageChannel),
    );
}
