const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')

const BUILD_PATH = path.join(__dirname,'dist')

module.exports = function (config) {
    // console.log(config)
    config.plugins = config.plugins.concat(newConfig.plugins)
    // config.module = config.module
    // config.entry = newConfig.entry
    // config.output = newConfig.output
    return config
}

const newConfig = {
    target: 'electron-renderer',
    entry: {index: './src/renderer/index.js'},
    output: {
        path: BUILD_PATH,
        filename: 'renderer/[name].js',
        chunkFilename: 'renderer/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options:{
                        presets:['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "src/pages/index.html",
            filename: "index.html"
        })
    ]
}