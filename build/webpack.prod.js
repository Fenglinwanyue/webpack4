'use strict'
const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config')
const Friendlyerrorsplugin = require('friendly-errors-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin') // 暂时无效果
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // CSS模块资源优化插件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const merge = require('webpack-merge')

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier') // 桌面通知

const buildType = process.env.BUILD_ENV === 'test'
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer)
  } else if (m.name) {
    return m.name
  } else {
    return false
  }
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = merge(webpackConfigBase, {
  mode: 'production',
  devtool: buildType ? 'cheap-module-eval-source-map' : false, // product
  plugins: [
    new CleanWebpackPlugin(),
    new ProgressBarPlugin(),
    new Friendlyerrorsplugin(),
    new webpack.DllReferencePlugin({
      manifest: require('../src/assets/dll/lib-manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../src/assets/dll/vue-manifest.json')
    }),
    new AddAssetHtmlPlugin([
      {
        filepath: resolve('src/assets/dll/*.js'),
        outputPath: './static/js',
        publicPath: './static/js',
        includeSourcemap: false,
        hash: true
      }
    ]),
    new WebpackBuildNotifierPlugin({
      title: '打包完成✅',
      logo: path.resolve('./img/favicon.png'),
      suppressSuccess: true
    }),
    new PurgecssPlugin({
      paths: glob.sync([resolve('./**/*.vue')], { nodir: true })
    })
  ],
  optimization: {
    concatenateModules: true,
    minimize: !buildType, // mode: 'production' 默认压缩 false 关闭UglifyJsPlugin
    minimizer: [
      new TerserJSPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
            dead_code: true
          },
          mangle: true,
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true },
          autoprefixer: false
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          priority: 10
        },
        styles: {
          name: 'styles',
          test: (m, c, entry = 'app') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
})

buildType &&
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8081
    })
  )

module.exports = webpackConfig
