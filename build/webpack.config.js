const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const PostCss_CssNext = require('postcss-cssnext')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const PostStylus = require('poststylus')
const HappyPack = require('happypack') // 没用，只能js其它报错，未解决。js也无效果
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const argv = JSON.parse(process.env.npm_config_argv).original
const devMode = argv[1].includes('dev')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createHappyPlugin = (id, loaders) =>
  new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: false
  })
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.ts'
  },
  output: {
    filename: devMode ? '[name].[hash:8].js' : 'static/js/[name].[chunkhash:16].js',
    chunkFilename: devMode ? '[name].[hash:8].js' : 'static/js/[name].[chunkhash:16].js',
    path: path.resolve(__dirname, '../dist'), // 要绝对路径
    publicPath: devMode ? '' : './'
  },
  resolve: {
    modules: [resolve('src'), resolve('node_modules')],
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json', '.jsx', '.css', '.styl', '.scss', '.png', '.jpg'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      // 'vue$': 'vue/dist/vue.common.js',
      // 'vue-router': "vue-router/dist/vue-router.esm.js",
      '@': resolve('src')
    }
  },
  // mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
  performance: {
    // 关闭性能警告 https://www.webpackjs.com/configuration/performance/
    hints: false // WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
  },
  plugins: [
    // new DashboardPlugin(dashboard.setData), // 无法使用，报错
    new webpack.DefinePlugin({
      'process.env.buildEnv': JSON.stringify(process.env.BUILD_ENV) || 'prod'
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $http: 'axios'
    }),
    // 添加VueLoaderPlugin，以响应vue-loader
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({
      // stylus加前缀
      options: {
        stylus: {
          use: [PostStylus(['autoprefixer'])]
        }
      }
    }),
    createHappyPlugin('happyBabel', [
      // {
      //     loader: 'babel-loader?cacheDirectory= true' // 通过设置 cacheDirectory 来开启缓存，这样，babel-loader 就会将每次的编译结果写进硬盘文件（默认是在项目根目录下的node_modules/.cache/babel-loader目录内，当然你也可以自定义）
      // }
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 启用缓存
          presets: [
            // 用 babel-loader 把 es6 转化成 es5
            '@babel/preset-env'
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 2,
                helpers: true,
                regenerator: true,
                useESModules: false
              }
            ],
            '@babel/plugin-syntax-dynamic-import' // 支持 import then 语法
          ]
        }
      }
    ]),
    // createHappyPlugin('happyTSBabel', [
    //     {
    //         loader: 'babel-loader',
    //         options: {
    //             plugins: [
    //                 '@babel/plugin-syntax-dynamic-import' // 动态import
    //             ]
    //         }
    //     },
    //     {
    //         loader: 'ts-loader',
    //         options: { appendTsxSuffixTo: [/\.vue$/] }
    //     },
    //     {
    //         loader: 'tslint-loader'
    //     }
    // ]),
    new HtmlWebpackPlugin({
      buildEnv: process.env.BUILD_ENV || 'prod',
      title: 'test webpack', // 不能和templateParameters共存
      template: 'index.html',
      // templateParameters: {
      //   title: "webpack",
      //   param1: '参数1'
      // },
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 压缩document中空白的文本节点
        collapseInlineTagWhitespace: true // 压缩行级元素的空白，会保留&nbsp;实体空格
      },
      hash: true,
      chunksSortMode: 'dependency'
    }),
    new InlineManifestWebpackPlugin(), //放在htmlWebpackPlugin的后面才能生效
    new MiniCssExtractPlugin({
      // 为抽取出的独立的CSS文件设置配置参数
      filename: devMode ? '[name].css' : 'static/css/[name].[chunkhash:16].css',
      chunkFilename: devMode ? '[id].css' : 'static/css/[id].[chunkhash:16].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
      // moduleFilename: ({ name }) => `${name.replace('/js/', '/css/')}.css` // TODO:nouse
      // publicPath:'../../'
    }),
    // new PurgecssPlugin({
    //     paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    // })
    new PurgecssPlugin({
      paths: glob.sync([resolve('./**/*.vue')], { nodir: true })
    })
  ],
  module: {
    // npx webpack need this
    // noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1
            }
          },
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-dynamic-import' // 动态import
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsxSuffixTo: [/\.vue$/],
              happyPackMode: true,
              transpileOnly: false // 关闭ts-loader自身的类型检查功能 可使用new ForkTsCheckerWebpackPlugin() 用于新建进程执行类型检查
            }
          },
          {
            loader: 'tslint-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          },
          compilerOptions: {
            // 设置两个行内块元素无空格 inline-block之间的空隙
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=happyBabel',
        // use: {
        //     // loader: 'babel-loader',
        //     loader: 'happypack/loader?id=happyBabel',
        //     options: {
        //         presets: [
        //             // 用 babel-loader 把 es6 转化成 es5
        //             '@babel/preset-env'
        //         ],
        //         plugins: [
        //             ['@babel/plugin-proposal-decorators', { legacy: true }],
        //             ['@babel/plugin-proposal-class-properties', { loose: true }],
        //             '@babel/plugin-transform-runtime',
        //             '@babel/plugin-syntax-dynamic-import'
        //         ]
        //     }
        // },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 公共路径
              // 默认情况下，使用的是webpackOptions.output中publicPath
              // publicPath: '../',
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/'
              },
              //开发环境配置热更新
              hmr: devMode
              // if hmr does not work, this is a forceful method.
              // reloadAll: true,
            }
          },
          // 'css-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          // 'postcss-loader'
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // 表示下面的插件是对postcss使用的
              plugins: [
                PostCss_CssNext() // 允许使用未来的css（包含AutoPrefixer功能）
              ]
            }
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader // 建议生产环境采用此方式解耦CSS文件与js文件
          },
          {
            loader: 'css-loader' // CSS加载器
            // vue-loader 集成了css modules scoped 缺点：全局样式仍会覆盖
            // options: { importLoaders: 2, modules: true}// 指定css-loader处理前最多可以经过的loader个数 将CSS代码中的样式名替换为哈希值
          },
          {
            loader: 'postcss-loader', // 承载autoprefixer功能
            options: {
              // // ident: 'postcss',
              // plugins: (loader) =>  [
              //   require('postcss-import')({ root: loader.resourcePath }),
              //   require('postcss-cssnext')(),
              //   require('autoprefixer')(),
              //   //require('cssnano')()
              // ]
            }
          },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 建议生产环境采用此方式解耦CSS文件与js文件
            options: {
              hmr: devMode
            }
          },
          {
            loader: 'css-loader', // CSS加载器
            options: { importLoaders: 2, modules: true } // 指定css-loader处理前最多可以经过的loader个数 将CSS代码中的样式名替换为哈希值
          },
          {
            loader: 'postcss-loader' // 承载autoprefixer功能
          },
          {
            loader: 'sass-loader' // SCSS加载器，webpack默认使用node-sass进行编译
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]',
          fallback: 'file-loader', // 大于limit限制的将转交给指定的loader处理
          outputPath: 'static/img/', // 会在dist目录下创建一个img目录
          publicPath: '/static/img' // 配置服务器的图片加载地址
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  optimization: {
    noEmitOnErrors: true
  }
}
