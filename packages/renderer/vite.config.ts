import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import resolve, { lib2esm } from 'vite-plugin-resolve'
import electron from 'vite-plugin-electron/renderer'
import * as kolorist from 'kolorist'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(kolorist.green(`config ${command} ${mode}`))
  return {
    mode: process.env.NODE_ENV,
    root: __dirname,
    plugins: [
      vue(),
      electron(),
      resolve(
        /**
               * Here you can specify other modules
               * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
               *    which will ensure that the electron-builder can package it correctly
               */
        {
          // If you use the following modules, the following configuration will work
          // What they have in common is that they will return - ESM format code snippets

          // ESM format string
          'electron-store': 'export default require("electron-store");',
          // Use lib2esm() to easy to convert ESM
          // Equivalent to
          /**
                   * sqlite3: () => `
                   * const _M_ = require('sqlite3');
                   * const _D_ = _M_.default || _M_;
                   * export { _D_ as default }
                   * `
                   */
          'sqlite3': lib2esm('sqlite3', { format: 'cjs' }),
          'serialport': lib2esm(
            // CJS lib name
            'serialport',
            // export memebers
            [
              'SerialPort',
              'SerialPortMock',
            ],
            { format: 'cjs' },
          ),
        },
      ),
    ],
    base: './',
    build: {
      outDir: '../../dist/renderer',
      emptyOutDir: true,
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@renderer': path.join(__dirname, '../../packages/renderer/src'),
        '@main': path.join(__dirname, '../../packages/main/src'),
        '@common': path.join(__dirname, '../../packages/common'),
      },
    },
    server: {
      host: pkg.env.VITE_DEV_SERVER_HOST,
      port: pkg.env.VITE_DEV_SERVER_PORT,
    },
  }
})
