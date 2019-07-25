import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const input = './src/index.ts';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const external = id => !id.startsWith('.') && !path.isAbsolute(id);

export default [

    // commonjs
    {
        input,
        output: {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        external,
        plugins: [
            babel({
                extensions,
                runtimeHelpers: true,
                plugins: ['@babel/transform-runtime'],
                sourceMaps: true,
            }),
            nodeResolve({
                extensions
            }),
            commonjs(),
        ],
    },

    // es modules
    {
        input,
        output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
        external,
        plugins: [
            babel({
                extensions,
                runtimeHelpers: true,
                plugins: [
                    ['@babel/transform-runtime', {
                        useESModules: true
                    }]
                ],
                sourceMaps: true,
            }),
            nodeResolve({
                extensions
            }),
            commonjs()
        ],
    }
];