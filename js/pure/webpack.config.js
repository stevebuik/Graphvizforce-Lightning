const path = require('path');

module.exports = {
    entry: './src/pure.js',
    mode: "production",
    output: {
        filename: 'pure.resource',
        path: path.resolve(__dirname, '../../graphviz/main/default/staticresources'),
        libraryTarget: "umd",
        library: "pure"
    },
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