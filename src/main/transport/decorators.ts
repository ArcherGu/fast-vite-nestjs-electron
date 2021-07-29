import { applyDecorators, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ipcMain } from 'electron';
import { ipcMessageDispatcher } from './dispatcher';
import { AllExceptionsFilter } from './filter';

export function IpcInvoke(messageChannel: string) {
    ipcMain.handle(messageChannel, (...args) => ipcMessageDispatcher.emit(messageChannel, ...args));

    return applyDecorators(
        UseFilters(new AllExceptionsFilter()),
        MessagePattern(messageChannel),
    );
}
