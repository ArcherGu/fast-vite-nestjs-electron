import { CustomTransportStrategy, MessageHandler, Server } from '@nestjs/microservices';
import { ipcMessageDispatcher } from './IPCMessageDispatcher';

export class ElectronIPCTransport extends Server implements CustomTransportStrategy {
    async onMessage(messageChannel: string, ...args: any[]): Promise<any> {
        const handler: MessageHandler | undefined = this.messageHandlers.get(messageChannel);
        if (!handler) {
            return this.logger.warn(`No handlers for message ${messageChannel}`);
        }

        try {
            this.logger.debug(`Process message ${messageChannel}`);

            const [ipcMainEventObject, payload] = args;

            const result = await handler(payload, {
                evt: ipcMainEventObject,
            });

            return {
                data: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                error: error,
            };
        }
    }

    close(): any {
    }

    listen(callback: () => void): any {
        ipcMessageDispatcher.on('ipc-message', this.onMessage.bind(this));
        callback();
    }
}