const path = require('path');
var webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    plugins: [
        new MinifyPlugin()
    ]
};