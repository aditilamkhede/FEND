const path = require("path")
const webpack = require("webpack")
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  entry: './src/client/index.js',
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  module: {
     rules: [
         {
             test: '/\.js$/',
             exclude: /node_modules/,
             loader: "babel-loader"
         },
         {
              test: /\.scss$/,
              use: [ MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader' ]
              // use: [ 'style-loader', 'css-loader', 'sass-loader' ]
          },
          {
               test: /\.(png|svg|jpg|gif)$/,
               use: [
                 'file-loader',
               ],
           },
     ]
   },
   plugins: [
    new HtmlWebPackPlugin({
        template: "./src/client/views/index.html",
        filename: "./index.html",
    }),
    new CleanWebpackPlugin({
        // Simulate the removal of files
        dry: false,
        // Write Logs to Console
        verbose: true,
        // Automatically remove all unused webpack assets on rebuild
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: false
    }),
    new MiniCSSExtractPlugin({filename: '[name].css'}),
]
}
