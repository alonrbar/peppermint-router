import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [{
    input: './test/index.ts',
    output: {
        file: '.tmp/dist-test/index.js',
        format: 'iife',
        name: 'PeppermintRouter',
        sourcemap: true,
        globals: {},
    },
    plugins: [
        babel({
            extensions,
            sourceMaps: true,
        }),
        nodeResolve({
            extensions
        }),
        commonjs(),
        serve({
            open: true,
            contentBase: ['test', '.tmp/dist-test'],
            port: 3000
        })
    ],
}];