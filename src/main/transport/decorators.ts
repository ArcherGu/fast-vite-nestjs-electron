import { applyDecorators, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ipcMain } from 'electron';
import { ipcMessageDispatcher } from './dispatcher';
import { AllExceptionsFilter } from './filter';

function GetParamsFromMessageChannel() {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function (args: any[]) {
            const [ipcMainEventObject, ...payload] = args;
            const newArgs = [
                ...payload,
                {
                    evt: ipcMainEventObject,
                },
            ];
            return method.apply(this, newArgs);
        };
        return descriptor;
    };
}

export function IpcInvoke(messageChannel: string) {
    ipcMain.handle(messageChannel, (...args) => ipcMessageDispatcher.emit(messageChannel, ...args));

    // Do not modify the order!
    return applyDecorators(
        GetParamsFromMessageChannel(),
        MessagePattern(messageChannel),
        UseFilters(new AllExceptionsFilter()),
    );
}
