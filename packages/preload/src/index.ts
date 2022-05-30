import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'ipcRenderer',
  {
    invoke: ipcRenderer.invoke.bind(ipcRenderer),
    on: ipcRenderer.on.bind(ipcRenderer),
    removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
  },
)
