import { builtinModules } from 'node:module'
import path from 'path'
import { defineConfig } from 'vite'
import * as kolorist from 'kolorist'
import pkg from './../../package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(kolorist.green(`config ${command} ${mode}`))
  return {
    root: __dirname,
    build: {
      outDir: '../../dist/main',
      emptyOutDir: true,
      minify: process.env./* from mode option */NODE_ENV === 'production',
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        // name: 'main',
        formats: ['cjs'],
        fileName: format => format === 'cjs' ? '[name].cjs' : `[name].${format}.js`,
      },
      rollupOptions: {
        external: [
          'electron',
          ...builtinModules,
          ...Object.keys(pkg.dependencies || {}),
        ],
      },
    },
    resolve: {
      alias: {
        '@renderer': path.join(__dirname, '../../packages/renderer/src'),
        '@main': path.join(__dirname, '../../packages/main/src'),
        '@common': path.join(__dirname, '../../packages/common'),
      },
    },
  }
})
