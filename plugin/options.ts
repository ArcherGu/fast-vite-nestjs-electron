import { join } from 'path';
import { builtinModules } from "module";
import { ResolvedConfig } from 'vite';
import { ResolvedViteElectronBuilderOptions, ViteElectronBuilderOptions } from './types';

export function resolveOptions(options: Partial<ViteElectronBuilderOptions>, viteConfig: ResolvedConfig) {
    const root = options.root || process.cwd();
    const external = Array.from(new Set([
        ...builtinModules.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x)),
        'electron',
        ...(Array.isArray(options.external) ? options.external : [])
    ]))

    const {
        mainFile = join(root, 'dist/main/index.js'),
        entryFile = join(root, 'src/main/index.ts'),
        tsconfig,
        electronBuilderConfig,
        afterEsbuildBuild = async () => { },
    } = options;

    const { env, command } = viteConfig;


    const resolvedViteElectronBuilderOptions: ResolvedViteElectronBuilderOptions = {
        root,
        mainFile,
        entryFile,
        tsconfig,
        electronBuilderConfig,
        env,
        command,
        external,
        afterEsbuildBuild
    }

    return resolvedViteElectronBuilderOptions
}

