import { EVENTS } from '@common/events';
import { applyDecorators } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ipcMain } from 'electron';
import { ipcMessageDispatcher } from './core/IPCMessageDispatcher';

export function IpcInvoke(event: EVENTS) {
    const messageChannel = event.toString();
    ipcMain.handle(messageChannel, (...args) => ipcMessageDispatcher.emit(messageChannel, ...args));

    return applyDecorators(
        MessagePattern(messageChannel),
    );
}
