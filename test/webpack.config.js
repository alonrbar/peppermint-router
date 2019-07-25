const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const babelConfig = require('../babel.config');

module.exports = {
    entry: './src/index.tsx',
    devServer: {
        port: 3000,
        hot: true,
        stats: "minimal"
    },
    devtool: 'source-map',
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        rules: [
            {
                test: /(\.js|\.jsx|\.ts|\.tsx)$/,
                exclude: /node_modules/,
                use: { 
                    loader: 'babel-loader',
                    options: babelConfig
                }
            },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        modules: [path.resolve("./src"), "node_modules"]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            minify: false
        }),
        new ProgressBarPlugin({
            clear: true
        }),
        new WebpackBuildNotifierPlugin({
            suppressSuccess: true,
            successSound: false,
            failureSound: false
        }),
    ]
};