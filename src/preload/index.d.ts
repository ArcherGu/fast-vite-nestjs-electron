import type electron from './electron'

type IpcRendererAsVoid<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => IpcRenderer
    ? (...args: Args) => void
    : T[K]
}

declare global {
  interface Window {
    electron: IpcRendererAsVoid<typeof electron>
  }
}
