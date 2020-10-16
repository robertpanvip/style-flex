const path = require('path');
const webpack = require('webpack');
//"build": "prepare.sh"
const compiler=webpack({
    entry: [
        './src/Flex.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'flex.min.js',
        library:'Flex',
        libraryTarget: 'umd'
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
                                   /* 'browsers': ['ie >= 9', 'chrome >= 62'],*/
                                    'esmodules':true
                                }
                            }
                        ],
                        ['@babel/preset-react'],
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                        ["@babel/plugin-transform-runtime"]
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
        minimize:true
    }
});
compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        // 在这里处理错误
        console.log(err,stats)
    }
    // 处理完成
});
