<p align="center">
    <img width="400" src="https://github.com/ArcherGu/fast-vite-nestjs-electron/blob/main/logo.png" alt="logo">
</p>

# ⚡Vite + Electron + Nestjs & Esbuild Template

This template is used to build [vite](https://vitejs.dev/) + [electron](https://www.electronjs.org/) + [nestjs](https://nestjs.com/) projects. Build whit esbuild, crazy fast!

**NOTE:** Main process is built with esbuild. After some modifications, it currently supports [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata).

## Introduce
This is a template based on my repo: [fast-vite-electron](https://github.com/ArcherGu/fast-vite-electron). In the main process, I integrated nestjs. In the main process, you can build your code just as you would write a nestjs backend. Desktop clients built from this template can quickly split the electron when you need to switch to B/S.

## How to use

- Click the [Use this template](https://github.com/ArcherGu/fast-vite-electron/generate) button (you must be logged in) or just clone this repo.
- In the project folder: 
  ```bash
  # install dependencies
  yarn # npm install

  # run in developer mode
  yarn dev # npm run dev

  # build
  yarn build # npm run build
  ```

## Note for PNPM

In order to use with `pnpm`, you'll need to adjust your `.npmrc` to use any one the following approaches in order for your dependencies to be bundled correctly (ref: [#6389](https://github.com/electron-userland/electron-builder/issues/6289#issuecomment-1042620422)):
```
node-linker=hoisted
```
```
public-hoist-pattern=*
```
```
shamefully-hoist=true
```

## Relative

My blog post:

- [极速 DX Vite + Electron + esbuild](https://archergu.me/posts/vite-electron-esbuild)
- [用装饰器给 Electron 提供一个基础 API 框架](https://archergu.me/posts/electron-decorators)