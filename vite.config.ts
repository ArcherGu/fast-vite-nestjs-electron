import { join } from 'path'
import { writeFileSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { compileFile } from 'bytenode'
import { VitePluginDoubleshot } from 'vite-plugin-doubleshot'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  root: join(__dirname, 'src/render'),
  plugins: [
    vue(),
    VitePluginDoubleshot({
      type: 'electron',
      main: 'dist/main/index.js',
      entry: 'src/main/index.ts',
      outDir: 'dist/main',
      external: ['electron', '@nestjs'],
      afterBuild: async () => {
        await compileFile({
          filename: './dist/main/index.js',
          output: './dist/main/main.jsc',
          electron: true,
        })

        writeFileSync('./dist/main/index.js', 'require(\'bytenode\');require(\'./main.jsc\')')
      },
      electron: {
        build: {
          config: './electron-builder.config.js',
        },
        preload: {
          entry: 'src/preload/index.ts',
          outDir: 'dist/preload',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@render': join(__dirname, 'src/render'),
      '@main': join(__dirname, 'src/main'),
      '@common': join(__dirname, 'src/common'),
    },
  },
  base: './',
  build: {
    outDir: join(__dirname, 'dist/render'),
    emptyOutDir: true,
  },
})
