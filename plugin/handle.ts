import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'
import chalk from 'chalk'
import { build } from 'esbuild'
import electron from 'electron'
import { build as electronBuilder } from 'electron-builder'
import { createEsbuildOptions } from './esbuild.options'
import type { ResolvedViteElectronBuilderOptions } from './types'

function runMainProcess(mainFile: string) {
  return spawn(electron as any, [mainFile], { stdio: 'inherit' })
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
          console.error(chalk.red('Rebuild Failed:'), error)
        }
        else {
          console.log(chalk.green('Rebuild Succeeded'))
          if (child)
            child.kill()
          child = runMainProcess(mainFile)
        }
      },
    },
  }).then(() => {
    console.log(chalk.yellowBright('⚡Main Process Running'))
    if (child)
      child.kill()
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

    console.log(chalk.green('Main Process Build Succeeded.'))
  }).catch((error) => {
    console.log(`\n${chalk.red('Main Process Build Failed')}\n`, error, '\n')
  })
}
