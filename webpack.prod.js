
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', './src/app.js'],
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
    }, {
      test: /\.less$/,
      exclude: /src/,
      use: 'happypack/loader?id=lessBabel',
    }, {
      test: /\.scss$/,
      use: 'happypack/loader?id=scssBabel',
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
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // echartsLib: {
        //   test: /echarts/,
        // /[\/]node_modules[\/][^\/]{0,}?echarts[^\/]{0,}?[\/]/.test('/node_modules/element-ui/')
        // test: (module) => { return /react|redux|prop-types/.test(module.context); }, // 可直接使用 函数 做路径匹配
        //   name: 'echartsLib',
        //   priority: 10,
        // },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 1,
        },
        common: {
          test: /[\\/]src[\\/]/,
          name: 'common',
          minChunks: 3,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].async.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'donut-PV3.0',
      template: __dirname + '/index.ejs',
    }),
    new CopyWebpackPlugin([{
      from: __dirname + '/assets',
      to: __dirname + '/dist',
    }]),
    new UglifyJSPlugin(),
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
    // new BundleAnalyzerPlugin(),
  ],
};
