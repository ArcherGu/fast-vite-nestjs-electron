import { NestFactory } from '@nestjs/core';
import { app, BrowserWindow } from 'electron';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ElectronIPCTransport } from './transport';
import { AppModule } from './app.module';

const isDev = !app.isPackaged;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

async function bootstrap() {
    try {
        const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
            AppModule,
            {
                strategy: new ElectronIPCTransport(),
            },
        );

        await nestApp.listen();

        const win = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                enableRemoteModule: true,
                contextIsolation: false,
            },
            autoHideMenuBar: isDev ? false : true,
        });

        win.maximize();

        const URL = isDev
            ? `http://localhost:${process.env.PORT}`
            : `file://${join(app.getAppPath(), 'dist/render/index.html')}`;

        win.loadURL(URL);

        if (isDev) {
            win.webContents.openDevTools();
        }

        win.on('closed', () => {
            win.destroy();
        });
    } catch (error) {
        console.log(error);
        app.quit();
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) bootstrap();
});

app.on('ready', async () => {
    bootstrap();
});

if (isDev) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
