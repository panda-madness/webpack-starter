let webpack = require('webpack');
let jsonfile = require('jsonfile');
let path = require('path');
let glob = require('glob');

let ExtractTextPlugin = require('extract-text-webpack-plugin');
let PurifyCSSPlugin = require('purifycss-webpack');

let inProduction = (process.env.NODE_ENV === 'production');

let config = jsonfile.readFileSync('config.json');

module.exports = {
    entry: {
        app: [
            config.js.entry,
            config.sass.entry
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ['css-loader']
            },

            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),

        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, config.templatesPath)),
            minimize: inProduction
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        })
    ]

};

if(inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}