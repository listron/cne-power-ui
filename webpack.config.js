

  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

  const smp = new SpeedMeasurePlugin();
  const { mockConfig } = require('./mock.config.js');

  module.exports = smp.wrap({
    mode:'development',
    entry: {
      app: './src/app.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      port: 8080,
      hot: true,
      before(server) {
        mockConfig.forEach(e=>{
          server[e.method](`${e.api}`, (req, res) => {
            setTimeout(()=>res.json(e.response),e.delay || 2000)
          });
        })
      },
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
      },{
        test: /\.less$/,
        exclude: /src/,
        use: [{
          loader: "style-loader" 
        }, {
            loader: "css-loader",
        }, {
          loader: "less-loader",
          options: {
            importLoaders: 1,
            modifyVars: {
              'primary-color': '#199475',
              'link-color': '#199475',
            },
            javascriptEnabled: true,
          },
        }]
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
    plugins: [
      new CopyWebpackPlugin([{
        from: __dirname + '/assets',
        to:__dirname + '/dist'
      }]),
      // new webpack.DllReferencePlugin({
      //   context: __dirname,
      //   manifest: require('./vendors/manifest.json'),
      //   name: './vendors/vendors.dll.js'
      // }),
      new HtmlWebpackPlugin({
        title: 'Donut-UI',
        template : __dirname + '/index.ejs',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js',
      chunkFilename:'[name].[hash].async.js',
    }
  });


// module.exports = {
//   devServer: {
//     historyApiFallback: true,
//     hot:true
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin()
//   ]
// };