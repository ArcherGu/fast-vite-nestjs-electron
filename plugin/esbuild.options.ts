import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { BuildOptions } from "esbuild";
import { ResolvedViteElectronBuilderOptions } from './types';

export function createEsbuildOptions(options: ResolvedViteElectronBuilderOptions): BuildOptions {
    const define = Object.entries(options.env).reduce((preVal, [key, value]) => ({
        ...preVal,
        [`process.env.${key}`]: JSON.stringify(value)
    }), {})

    const { entryFile, mainFile, tsconfig, external } = options;
    return {
        entryPoints: [entryFile],
        target: 'es2020',
        outfile: mainFile,
        format: 'cjs',
        bundle: true,
        platform: 'node',
        define,
        tsconfig,
        plugins: [
            esbuildDecorators({ tsconfig })
        ],
        external,
    };
};