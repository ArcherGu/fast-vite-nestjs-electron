import { Logger } from '@nestjs/common';
import { CustomTransportStrategy, MessageHandler, Server } from '@nestjs/microservices';
import { ipcMessageDispatcher } from './dispatcher';

export class ElectronIpcTransport extends Server implements CustomTransportStrategy {
    protected readonly logger = new Logger(ElectronIpcTransport.name);

    async onMessage(messageChannel: string, ...args: any[]): Promise<any> {
        const handler: MessageHandler | undefined = this.messageHandlers.get(messageChannel);
        if (!handler) {
            return this.logger.warn(`No handlers for message ${messageChannel}`);
        }

        try {
            this.logger.debug(`Process message ${messageChannel}`);

            const result = await handler(args);

            return {
                data: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                error,
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

export * from "./decorators";
