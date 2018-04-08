

const webpack = require('webpack');
const path = require('path');
const resolve = path.resolve;
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode:'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename:'[name].[hash].async.js',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline:true
  },
  plugins:[new webpack.HotModuleReplacementPlugin(),]
});
