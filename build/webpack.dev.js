// 定义开发配置
const path = require('path')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config')
const Friendlyerrorsplugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const webpack = require('webpack')
const ErudaWebpackPlugin = require('eruda-webpack-plugin')
const icon = path.join(__dirname, 'icon.png')

const os = require('os')
const networkInterfaces = os.networkInterfaces()
let ip = networkInterfaces.en0
const port = '9999'
ip.find(obj => {
  if (obj.family === 'IPv4') ip = obj.address
})

module.exports = merge(webpackConfigBase, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    stats: 'errors-only',
    overlay: true,
    contentBase: './dist',
    compress: true,
    host: ip || '0.0.0.0',
    port: port || '9999',
    hot: true,
    inline: true,
    historyApiFallback: true,
    openPage: '',
    quiet: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Friendlyerrorsplugin({
      compilationSuccessInfo: {
        messages: [`你的应用程序在这里运行http://${ip}:${port}`],
        notes: ['build success!!']
      },
      onerrors: function(severity, errors) {
        if (severity !== 'error') {
          return
        }
        const error = errors[0]
        notifier.notify({
          title: 'webpack error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: icon
        })
      },
      clearconsole: true,
      additionalformatters: [],
      additionaltransformers: []
    })
  ],
  mode: 'development'
})
