import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'
import * as kolorist from 'kolorist'
import { build } from 'esbuild'
import electron from 'electron'
import { build as electronBuilder } from 'electron-builder'
import { createEsbuildOptions } from './esbuild.options'
import type { ResolvedViteElectronBuilderOptions } from './types'

function exitMainProcess() {
  console.info(kolorist.yellow('Main Process Exited'))
  process.exit(0)
}

function runMainProcess(mainFile: string) {
  return spawn(electron as any, [mainFile], { stdio: 'inherit' }).on('exit', exitMainProcess)
}

export function handleDev(options: ResolvedViteElectronBuilderOptions) {
  const { mainFile } = options
  const esbuildOptions = createEsbuildOptions(options)

  let child: ChildProcess
  build({
    ...esbuildOptions,
    watch: {
      onRebuild(error) {
        if (error) {
          console.error(kolorist.red('Rebuild Failed:'), error)
        }
        else {
          console.log(kolorist.green('Rebuild Succeeded'))
          if (child) {
            child.off('exit', exitMainProcess)
            child.kill()
          }

          child = runMainProcess(mainFile)
        }
      },
    },
  }).then(() => {
    console.log(kolorist.lightYellow('⚡Main Process Running'))
    if (child) {
      child.off('exit', exitMainProcess)
      child.kill()
    }

    child = runMainProcess(mainFile)
  })
}

export function handleBuild(options: ResolvedViteElectronBuilderOptions) {
  const { electronBuilderConfig } = options
  const esbuildOptions = createEsbuildOptions(options)

  build(esbuildOptions).then(async () => {
    await options.afterEsbuildBuild()

    await electronBuilder({
      config: electronBuilderConfig,
    })

    console.log(kolorist.green('Main Process Build Succeeded.'))
  }).catch((error) => {
    console.log(`\n${kolorist.red('Main Process Build Failed')}\n`, error, '\n')
  })
}
