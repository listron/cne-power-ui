

const webpack = require('webpack');
const path = require('path');
const resolve = path.resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename:'[name].[hash].async.js',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
};