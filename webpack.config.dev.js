var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var CleanWebpackPlugin = require('clean-webpack-plugin');

    module.exports = {
        entry: [
            './app/index.js'
        ],
        output: {
            path: __dirname + '/dist',
            filename: "index_bundle.[hash].js"
        },
        devServer: {
            contentBase: '.', // Relative directory for base of server
            devtool: 'eval',
            hot: true, // Live-reload
            inline: true,
            port: 8080, // Port Number
            host: 'localhost', // Change to '0.0.0.0' for external facing server
        },
        devtool: 'eval',
        module: {
            loaders: [
                {
                    test: /\.js$/, exclude: /node_modules/,
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.css$/,
                    loader: 'style!css?modules',
                    include: /flexboxgrid/,
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader!postcss-loader",
                    exclude: /flexboxgrid/
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/octet-stream"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=image/svg+xml"
                },
                {
                    test: /\.jpe?g$|\.gif$|\.png$/i,
                    loader: "file-loader?name=/assets/images/[name].[ext]"
                },
                {
                    test: /\.json$/,
                    loader: "json-loader"
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass', 'postcss']
                }
            ]
        },
        postcss: [
            autoprefixer({ browsers: ['last 3 versions'] })
        ],
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new CleanWebpackPlugin([__dirname + '/dist/'], {
                root: __dirname,
                verbose: false,
                dry: false
            }),
            new HtmlWebpackPlugin({
                template: __dirname + '/app/index.html',
                filename: 'index.html',
                inject: 'body'
            })
        ]
    };
