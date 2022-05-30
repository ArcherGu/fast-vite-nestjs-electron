import { join } from 'path'
import { Module } from '@nestjs/common'
import { BrowserWindow, app } from 'electron'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

@Module({
  providers: [{
    provide: 'WEB_CONTENTS',
    async useFactory(isDev: boolean) {
      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
          app.quit()
      })

      if (isDev) {
        if (process.platform === 'win32') {
          process.on('message', (data) => {
            if (data === 'graceful-exit')
              app.quit()
          })
        }
        else {
          process.on('SIGTERM', () => {
            app.quit()
          })
        }
      }

      await app.whenReady()

      const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: join(__dirname, '../preload/index.cjs'),
          devTools: isDev,
        },
        autoHideMenuBar: !isDev,
      })

      win.maximize()

      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
      const URL = isDev
      // eslint-disable-next-line dot-notation
        ? (process.env.DEV_SERVER_URL || `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`)
        : `file://${join(app.getAppPath(), 'dist/renderer/index.html')}`

      await win.loadURL(URL)

      if (isDev)
        win.webContents.openDevTools()

      else
        win.removeMenu()

      win.on('closed', () => {
        win.destroy()
      })

      return win.webContents
    },
    inject: ['IS_DEV'],
  }],
  exports: ['WEB_CONTENTS'],
})
export class WinModule { }
