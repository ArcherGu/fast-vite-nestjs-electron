import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { handleBuild, handleDev } from './handle'
import { resolveOptions } from './options'
import type { ResolvedViteElectronBuilderOptions, ViteElectronBuilderOptions } from './types'

export function VitePluginElectronBuilder(userOptions: Partial<ViteElectronBuilderOptions> = {}): Plugin {
  let viteConfig: ResolvedConfig
  let options: ResolvedViteElectronBuilderOptions

  return {
    name: 'vite-plugin-electron-builder',
    configResolved(config) {
      viteConfig = config
      options = resolveOptions(userOptions, viteConfig)
    },
    configureServer: ({ httpServer }: ViteDevServer) => {
      httpServer.on('listening', () => {
        const address: any = httpServer.address()
        options.env.DEV_SERVER_URL = `http://${address.address}:${address.port}`

        handleDev(options)
      })
    },
    closeBundle: () => {
      handleBuild(options)
    },
  }
}
