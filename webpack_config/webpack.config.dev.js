const path = require('path');

module.exports = {
    mode: 'development',
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    entry: {
        index: path.resolve('static/jsx/index.jsx'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve('static/js/'),
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-react",
                    ]
                }
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
               ]
            }
        ]
    }
};
