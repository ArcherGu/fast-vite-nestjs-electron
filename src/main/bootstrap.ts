import { EVENTS } from '@common/events';
import { ipcMain, WebContents } from 'electron';
import { MyController } from './Controllers';

export type Construct<T = any> = new (...args: Array<any>) => T;

const controllers: Construct[] = [MyController];

const ExistInjectable = {};
function factory<T>(constructor: Construct<T>): T {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor);
    const providers = paramtypes.map((provider: Construct<T>) => {
        const name = Reflect.getMetadata('name', provider);
        const item = ExistInjectable[name] || factory(provider);
        ExistInjectable[name] = item;
        return item;
    });
    return new constructor(...providers);
}

export async function bootstrap(webContents: WebContents) {
    for (const ControllerClass of controllers) {
        const controller = factory(ControllerClass);
        const proto = ControllerClass.prototype;
        const funcs = Object.getOwnPropertyNames(proto).filter(
            (item) => typeof controller[item] === 'function' && item !== 'constructor'
        );

        funcs.forEach((funcName) => {
            let event: string | null = null;
            event = Reflect.getMetadata('ipc-invoke', proto, funcName);
            if (event) {
                ipcMain.handle(event, async (e, ...args) => {
                    try {
                        const result = await controller[funcName].call(controller, ...args);

                        return {
                            data: result,
                        };
                    } catch (error) {
                        console.log(error);
                        return {
                            error: error,
                        };
                    }
                });
            }
            else {
                event = Reflect.getMetadata('ipc-on', proto, funcName);
                if (!event) return;
                const returnType = Reflect.getMetadata('design:returntype', ControllerClass.prototype, funcName);
                const func = controller[funcName];

                if (returnType.name === 'Promise') {
                    controller[funcName] = async (...args: any[]) => {
                        const result = await func.call(controller, ...args);
                        webContents.send(event, result);
                        return result;
                    };
                }
                else {
                    controller[funcName] = (...args: any[]) => {
                        const result = func.call(controller, ...args);
                        webContents.send(event, result);
                        return result;
                    };
                }
            }
        });
    }
}

export function destroy() {
    for (const EVENT in EVENTS) {
        ipcMain.removeHandler(EVENTS[EVENT]);
    }

    for (const exist in ExistInjectable) {
        ExistInjectable[exist].destroy && ExistInjectable[exist].destroy();
    }
}
