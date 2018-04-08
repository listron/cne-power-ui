

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common,{
  mode:'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename:'[name].[hash].async.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin()
  ]
});