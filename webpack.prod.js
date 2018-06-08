
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode:'production',
  entry: {
    index: './src/app.js', 
  },
  resolve:{
    extensions: [".js", ".json", ".jsx"]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
        loader:'style-loader'
      },{
        loader:'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]__[hash:base64:5]'
        }
      }]
    }, {//antd样式处理
      test:/\.css$/,
      exclude:/src/,
      use:[
        { loader: "style-loader"},
        {
          loader: "css-loader",
          options:{
            importLoaders: 1
          }
        }
      ]
    }, {
      test: /\.scss$/,
      use: [{
        loader: "style-loader" 
      }, {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: '[local]__[hash:base64:5]'
          }
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
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename:'[name].[hash].async.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'donut-PV3.0',
      template : __dirname + '/index.ejs',
    }),
    new CopyWebpackPlugin([{
      from: __dirname + '/assets',
      to:__dirname + '/dist'
    }]),
    new UglifyJSPlugin()
  ]
};