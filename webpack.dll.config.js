
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    reacts: ['react', 'react-dom', 'redux', 'react-loadable', 'react-player', 'react-redux', 'react-router-dom', 'react-transition-group', 'redux-saga'],
    uiPlugin: ['antd'],
    chartPlugin: ['echarts'],
    restPlugin: ['axios', 'immutable', 'js-base64', 'js-cookie', 'moment', 'prop-types', 'qs']
  },
  output: {
    path: path.resolve(__dirname, './assets/vendors'),
    filename: '[name].dll.js',
    library: '[name]_dll_lib'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './assets/vendors/[name]-manifest.json'),
      name: '[name]_dll_lib',
      context: __dirname,
    })
  ]
}
