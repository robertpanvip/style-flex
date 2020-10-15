const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');// js压缩
const webpack = require('webpack');
const compiler=webpack({
    entry: [
        './src/Flex.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'flex.min.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                'targets': {
                                    'browsers': ['ie >= 9', 'chrome >= 62']
                                },
                                'useBuiltIns': 'usage',
                                'corejs': 3
                            }
                        ],
                        ['@babel/preset-react'],
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', {
                            'corejs': 3,
                            'loose': true
                        }],
                        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                        ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                    ]
                },
                include: [
                    path.join(__dirname, './src'),
                ]
            }
        ]
    },
    mode: 'production',
    optimization: {
        minimizer:  [// 压缩js
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ]//是否压缩代码
    }
});
compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        // 在这里处理错误
        console.log(err)
    }
    // 处理完成
});
