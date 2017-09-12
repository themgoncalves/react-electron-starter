require('babel-polyfill');
const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({fallback: 'style-loader', use : 'css-loader?sourceMap&minimize&localIdentName=[local]___[hash:base64:5]!sass-loader?outputStyle=expanded'}),
    exclude: ['node_modules']
});

module.exports = {
    entry: {
        'app':
            [
                'babel-polyfill',
                './src/index.jsx',
            ]
    },
    devtool: 'cheap-module-source-map',
    output: {
        publicPath: './',
        path: path.join(__dirname, 'public'),
        filename: 'assets/js/[name].bundle.[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            scss: path.resolve(__dirname, 'src/scss/'),
            vendors: path.resolve(__dirname, 'static/vendors/'),
        },
    },
    module: {
        loaders
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi]
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['app'],
            minChunks: ({resource}) => /node_modules/.test(resource)
        }),
        new ExtractTextPlugin({
            filename: 'assets/css/main.css',
            allChunks: true
        }),
        new CopyWebpackPlugin([
            { from: 'static', to: 'assets' },
        ], {
            ignore:
                [
                    '*.css',
                    '*.scss',
                    '*.sass',
                ],
            copyUnmodified: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.hbs',
            minify: {
                collapseWhitespace: true,
                preserveLineBreaks: false
            },
        }),
        /*new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'js/file.js',
            ],
            append: true,
        }), */
    ]
};