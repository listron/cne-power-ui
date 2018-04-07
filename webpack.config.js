

const webpack = require('webpack');
const path = require('path');
const resolve = path.resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:'development',
  entry: {
    index: './src/app.js', 
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename:'[name].[hash].async.js',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [{
        loader:'style-loader'
      },{
        loader:'css-loader',
        options: { modules: true }
      }]
    }, {
      test: /\.scss$/,
      use: [{
        loader: "style-loader" 
      }, {
          loader: "css-loader",
      }, {
          loader: "sass-loader" 
      }]
    }, {
      test: /\.(png|jpg|gif)$/,
      use: 'file-loader?name=[name].[ext]'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?name=[name].[ext]&limit=10000&minetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'file-loader?name=[name].[ext]'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Donut-UI',
      template : __dirname + '/index.ejs',
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};