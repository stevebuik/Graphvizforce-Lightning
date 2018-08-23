const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        libraryTarget: 'umd',
        library: "viewer",
        filename: 'dev-viewer-app.js',
        path: path.resolve(__dirname, './dist')
    },
    // output: {
    //     libraryTarget: 'umd',
    //     library: "viewer",
    //     filename: 'DiagramViewerApp.resource',
    //     path: path.resolve(__dirname, '../../graphviz/main/default/staticresources')
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};