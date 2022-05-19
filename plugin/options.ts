import { join } from 'path'
import { builtinModules } from 'module'
import type { ResolvedConfig } from 'vite'
import type { ResolvedViteElectronBuilderOptions, ViteElectronBuilderOptions } from './types'

export function resolveOptions(options: Partial<ViteElectronBuilderOptions>, viteConfig: ResolvedConfig) {
  const root = options.root || process.cwd()
  const external = Array.from(new Set([
    ...builtinModules.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x)),
    'electron',
    ...(Array.isArray(options.external) ? options.external : []),
  ]))

  const {
    mainFile = join(root, 'dist/main/index.js'),
    preloadFile = false,
    entryFile = join(root, 'src/main/index.ts'),
    outdir = join(root, 'dist'),
    tsconfig,
    electronBuilderConfig,
    afterEsbuildBuild = async () => { },
  } = options

  const { env, command } = viteConfig

  const resolvedViteElectronBuilderOptions: ResolvedViteElectronBuilderOptions = {
    root,
    mainFile,
    preloadFile,
    entryFile,
    outdir,
    tsconfig,
    electronBuilderConfig,
    env,
    command,
    external,
    afterEsbuildBuild,
  }

  return resolvedViteElectronBuilderOptions
}

