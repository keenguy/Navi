const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')

const BUILD_PATH = path.join(__dirname,'dist')

module.exports = function (config) {
    // console.log(config)
    // config.entry = newConfig.entry
    // config.output = newConfig.output
    return config
}

const newConfig = {
    entry: {main:'./src/main/index.js'},
    output: {
        path: BUILD_PATH,
        filename: 'main/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    }
}