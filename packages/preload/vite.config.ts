import { builtinModules } from 'module'
import path from 'path'
import { defineConfig } from 'vite'
import * as kolorist from 'kolorist'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(kolorist.green(`config ${command} ${mode}`))
  return {
    root: __dirname,
    build: {
      outDir: '../../dist/preload',
      emptyOutDir: true,
      minify: process.env./* from mode option */NODE_ENV === 'production',
      // https://github.com/caoxiemeihao/electron-vue-vite/issues/61
      sourcemap: 'inline',
      rollupOptions: {
        input: {
          // multiple entry
          index: path.join(__dirname, 'src', 'index.ts'),
        },
        output: {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          manualChunks: {},
        },
        external: [
          'electron',
          ...builtinModules,
          ...Object.keys(pkg.dependencies || {}),
        ],
      },
    },
  }
})
