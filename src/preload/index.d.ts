import type { IpcRenderer } from 'electron'
import type electron from './electron'

declare global {
  interface Window {
    electron: {
      [K in keyof typeof electron]: typeof electron[K] extends (...args: infer Args) => IpcRenderer
        ? (...args: Args) => void
        : typeof electron[K]
    }
  }
}
