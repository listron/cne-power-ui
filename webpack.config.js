

  const path = require('path');
  const webpack = require('webpack');
  const HappyPack = require('happypack');
  const os = require('os');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const ProgressBarPlugin = require('progress-bar-webpack-plugin');

  const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
  const smp = new SpeedMeasurePlugin();
  const { mockConfig } = require('./mock.config.js');

  // console.log(process.env.NODE_ENV)

  module.exports = smp.wrap({
    mode: 'development',
    entry: ['@babel/polyfill', './src/app.js'],
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      port: 8080,
      hot: true,
      before(server) {
        mockConfig.forEach(e=>{
          server[e.method](`${e.api}`, (req, res) => {
            setTimeout(()=>res.json(e.response), e.delay || 2000);
          });
        });
      },
    },
    resolve: {
      alias: {
        '@common': path.resolve(__dirname, 'src/common'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@path$': path.resolve(__dirname, 'src/constants/path.js'),
        '@containers': path.resolve(__dirname, 'src/containers'),
        '@theme': path.resolve(__dirname, 'src/theme'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
      extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [{
        test: /\.(js|jsx|ts|tsx)$/,
        // use: 'babel-loader',
        use: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]__[hash:base64:5]',
            },
          }],
          use: 'happypack/loader?id=cssBabel',
        }),
        // use: [{
        //   loader:'style-loader'
        // },{
        //   loader:'css-loader',
        //   options: {
        //     modules: true,
        //     localIdentName: '[local]__[hash:base64:5]'
        //   }
        // }]
      }, {//antd样式处理
        test: /\.css$/,
        exclude: /src/,
        use: ExtractTextPlugin.extract({
          fallback: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
          ],
          use: 'happypack/loader?id=antdBabel',
        }),
        // use:[
        //   { loader: "style-loader"},
        //   {
        //     loader: "css-loader",
        //     options:{
        //       importLoaders: 1
        //     }
        //   }
        // ]
      }, {
        test: /\.less$/,
        exclude: /src/,
        use: 'happypack/loader?id=lessBabel',
        // use: [{
        //   loader: "style-loader"
        // }, {
        //     loader: "css-loader",
        // }, {
        //   loader: "less-loader",
        //   options: {
        //     importLoaders: 1,
        //     modifyVars: {
        //       'primary-color': '#199475',
        //       'link-color': '#199475',
        //     },
        //     javascriptEnabled: true,
        //   },
        // }]
      }, {
        test: /\.scss$/,
        use: 'happypack/loader?id=scssBabel',
        // use: [{
        //   loader: "style-loader"
        // }, {
        //     loader: "css-loader",
        //     options: {
        //       modules: true,
        //       localIdentName: '[local]__[hash:base64:5]'
        //     }
        // }, {
        //     loader: "sass-loader"
        // }]
      }, {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader?name=[name].[ext]',
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?name=[name].[ext]&limit=10000&minetype=application/font-woff',
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=[name].[ext]',
      }],
    },
    plugins: [
      new ProgressBarPlugin(),
      // new webpack.DefinePlugin({
      //   ENV: '"test"',
      //   DEV: '"development"',
      //   PRO: '"production"',
      // }),
      new CopyWebpackPlugin([{
        from: __dirname + '/assets',
        to: __dirname + '/dist',
      }]),
      new HtmlWebpackPlugin({
        title: 'Donut-UI',
        template: __dirname + '/index.ejs',
      }),
      new webpack.HotModuleReplacementPlugin(),
      ...['reacts', 'uiPlugin', 'chartPlugin', 'restPlugin'].map(name => {
        return new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require(`./assets/vendors/${name}-manifest.json`),
        });
      }),
      new HappyPack({
        id: 'happyBabel',
        use: [{
          loader: 'babel-loader',
        }],
        threadPool: happyThreadPool,
        verbose: true,
      }),
      new HappyPack({
        id: 'cssBabel',
        use: [
          {
            loader: 'babel-loader',
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]__[hash:base64:5]',
            },
          },
        ],
        threadPool: happyThreadPool,
        verbose: true,
      }),
      new HappyPack({
        id: 'antdBabel',
        use: [
          {
            loader: 'babel-loader?cacheDirectory=true',
          }, {
            loader: 'css-loader?cacheDirectory=true',
            options: {
              importLoaders: 1,
            },
          },
        ],
        threadPool: happyThreadPool,
        verbose: true,
      }),
      new HappyPack({
        id: 'lessBabel',
        use: [{
          loader: 'style-loader',
        }, {
            loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: {
            importLoaders: 1,
            modifyVars: {
              'primary-color': '#199475',
              'link-color': '#199475',
            },
            javascriptEnabled: true,
          },
        }],
        threadPool: happyThreadPool,
        verbose: true,
      }),
      new HappyPack({
        id: 'scssBabel',
        use: [{
          loader: 'style-loader',
        }, {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]__[hash:base64:5]',
            },
        }, {
            loader: 'sass-loader',
        }],
        threadPool: happyThreadPool,
        verbose: true,
      }),
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].async.js',
    },
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
