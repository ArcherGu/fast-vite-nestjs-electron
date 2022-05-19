import { esbuildDecorators } from '@anatine/esbuild-decorators'
import type { BuildOptions } from 'esbuild'
import type { ResolvedViteElectronBuilderOptions } from './types'

export function createEsbuildOptions(options: ResolvedViteElectronBuilderOptions): BuildOptions {
  const define = Object.entries(options.env).reduce((preVal, [key, value]) => ({
    ...preVal,
    [`process.env.${key}`]: JSON.stringify(value),
  }), {})

  const { entryFile, outdir, preloadFile, tsconfig, external } = options
  return {
    entryPoints: typeof preloadFile === 'string' ? [entryFile, preloadFile] : [entryFile],
    target: 'es2020',
    outdir,
    format: 'cjs',
    bundle: true,
    platform: 'node',
    define,
    tsconfig,
    plugins: [
      esbuildDecorators({ tsconfig }),
    ],
    external,
  }
}
