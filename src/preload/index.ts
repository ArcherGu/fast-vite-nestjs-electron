import { contextBridge } from 'electron'
import electron from './electron'

contextBridge.exposeInMainWorld('electron', electron)
