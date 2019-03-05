
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendors: ['antd', 'axios', 'echarts', 'immutable', 'js-base64', 'js-cookie', 'moment', 'prop-types', 'qs', 'react', 'react-dom', 'react-loadable', 'react-player', 'react-redux', 'react-router-dom', 'react-transition-group', 'redux', 'redux-saga'],
  },
  output: {
    path: path.resolve(__dirname, './vendors'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './vendors/manifest.json'),
      name: '[name]',
      context: __dirname,
    })
  ]
}
