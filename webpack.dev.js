

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode:'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port:8080,
    inline:true
  },
  // plugins:[
  //   // new webpack.NamedModulesPlugin(),
  //   // new webpack.HotModuleReplacementPlugin()
  // ]
});
