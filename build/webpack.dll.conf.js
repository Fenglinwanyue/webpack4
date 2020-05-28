//webpack.dll.conf.js

const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const dllPath = path.resolve(__dirname, '../src/assets/dll/') // dll文件存放的目录
module.exports = {
  mode: 'production',
  entry: {
    lib: ['fastclick', 'axios'],
    vue: ['vue', 'vue-router', 'vuex', 'vue-class-component', 'vue-property-decorator']
  },
  output: {
    path: path.join(__dirname, '../src/assets/dll'),
    filename: '[name].[hash].dll.js',
    library: '[name]'
  },
  plugins: [
    new CleanWebpackPlugin({
      root: dllPath
    }),
    new BundleAnalyzerPlugin({
      analyzerPort: 8082
    }),
    new webpack.DllPlugin({
      path: 'src/assets/dll/[name]-manifest.json',
      name: '[name]'
    })
  ],
  optimization: {
    // 压缩 只是为了包更小一点
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false, // 去除LICENSE
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: true, // 不跳过错误的名称
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      })
    ]
  }
}
