# webpack-vue-ts-tslint

### 支持 TS 版本的 Vue 项目模版

# start

npm i

# build

first: npm run build:dll
end: npm run build:prod

# point

## 1、html 处理：html-webpack-plugin

个性化内容填充（例如页面标题，描述，关键词）
多余空格删除（连续多个空白字符的合并）
代码压缩（多余空白字符的合并）
去除注释

"sideEffects": false // 告诉编译器该项目或模块是 pure 的，可以进行无用模块删除
UglifyJs 无法对 ES6+的代码进行压缩，需使用 babel-minify 获取更好的 treeshaking 效果。webapck4 目前已经支持压缩 ES6+的代码。
webpack4 支持 json 模块和 tree-shaking，之前 json 文件的加载需要 json-loader 的支持，webpack4 已经能够支持 json 模块（JSON Module），不需要额外的配置

#webpack4 配置文件的变化点
如何配置 webpack4 下的配置文件，需要大致了解 webapck4 的配置项的改动点。
mode：开发模式 development

开启 dev-tool，方便浏览器调试
提供详细的错误提示
利用缓存机制，实现快速构建
开启 output.pathinfo，在产出的 bundle 中显示模块路径信息
开启 NamedModulesPlugin
开启 NoEmitOnErrorsPlugin
mode：生产模式 production

启动各种优化插件（ModuleConcatenationPlugin、optimization.minimize、ModuleConcatenationPlugin、Tree-shaking），压缩、合并、拆分，产出更小体积的 chunk
关闭内存缓存
开启 NoEmitOnErrorsPlugin
plugin

内置 optimization.minimize 来压缩代码，不用再显示引入 UglifyJsPlugin；
废弃 CommonsChunkPlugin 插件，使用 optimization.splitChunks 和 optimization.runtimeChunk 来代替；
使用 optimization.noEmitOnErrors 来替换 NoEmitOnErrorsPlugin 插件
使用 optimization.namedModules 来替换 NamedModulesPlugin 插件
loader

废弃 json-loader，友好支持 json 模块，以 ESMoudle 的语法引入，还可以对 json 模块进行 tree-shaking 处理；

'vue-style-loader' // <- 这是 vue-loader 的依赖，所以如果使用 npm3，则不需要显式安装

## webpack4.0 版本为例来演示 CSS 模块的处理方式，需要用到的插件及功能如下：

style-loader——将处理结束的 CSS 代码存储在 js 中，运行时嵌入<style>后挂载至 html 页面上
css-loader——加载器，使 webpack 可以识别 css 模块
postcss-loader——加载器，下一篇将详细描述
sass-loader——加载器，使 webpack 可以识别 scss/sass 文件，默认使用 node-sass 进行编译
mini-css-extract-plugin——插件，4.0 版本启用的插件，替代原 extract-text-webpack-plugin 插件，将处理后的 CSS 代码提取为独立的 CSS 文件
optimize-css-assets-webpack-plugin——插件，实现 CSS 代码压缩
autoprefixer——自动化添加跨浏览器兼容前缀
#vue-loader
vue-loader 会解析文件，提取每个语言块，如有必要会通过其它 loader 处理（比如<script>默认用 babel-loader 处理，<style>默认用 style-loader 处理），最后将他们组装成一个 CommonJS 模块，module.exports 出一个 Vue.js 组件对象。

用 terser-webpack-plugin 替换掉 uglifyjs-webpack-plugin 解决 uglifyjs 不支持 es6 语法问题

通过 url-loader 来优化项目中对于资源的引用路径，并设定大小限制，当资源的体积小于 limit 时将其直接进行 Base64 转换后嵌入引用文件，体积大于 limit 时可通过 fallback 参数指定的 loader 进行处理。

## 二. Js 文件的一般打包需求

代码编译（TS 或 ES6 代码的编译）
脚本合并
公共模块识别
代码分割
代码压缩混淆

splitChunks 提供了更精确的分割策略，但是似乎无法直接通过 html-webpack-plugin 配置参数来动态解决分割后代码的注入问题，因为分包名称是不确定的。这个场景在使用 chunks:'async'默认配置时是不存在的，因为异步模块的引用代码是不需要以<script>标签的形式注入 html 文件的。

当 chunks 配置项设置为 all 或 initial 时，就会有问题

设置了 mode 之后会把 process.env.NODE_ENV 也设置为 development 或者 production

optimization.splitChunks 默认是不用设置的。如果 mode 是 production，那 Webpack 4 就会开启 Code Splitting。

eslint-plugin-html 该插件用于检查在写在 script 标签中的代码
eslint-friendly-formatter 规定报错时输入的信息格式

friendly-errors-webpack-plugin 通过将 webpack config quiet 选项设置为 true 来关闭所有错误日志记录。
桌面通知的原生支持，需要引入 node-notifier

使用 purifycss-webpack 来实现 css 的 Tree Shaking，Tree Shaking 意思是摇树，即为将项目中没有用到的 css 代码或 js 代码过滤掉，不将其打包到文件中: purify-css purifycss-webpack
glob-all 用于处理多路径文件，使用 purifycss 的时候要用到 glob.sync 方法

# bugs

mini-css-extract-plugin 不生效：原因 sideEffects
devServer 失效，原因：publicPath: './'
热更新(HMR)不能和[chunkhash]同时使用
引入 dll 后报：Cannot read Property 'call' of undefined 解决办法：修改打包的// library: 'vendors\_[hash]' 为 library: '[name]'
生成 dll 文件后，app.js 仍打包了第三方模块，解决方法：DllReferencePlugin 去除 context
生成多个 dll 需要对应多个 DllReferencePlugin
Exceeds maximum line length of 120 ->
// tslint:disable:max-line-length 放到文件头部-忽略此文件中每行字数限制问题
Property '\$test' does not exist on type 'HelloWord' vue.prototype 上的方法不能直接在 this 上使用，需要在.d.ts 声明，.d.ts 修改后需要重新 ctrl+A，ctrl+c，ctrl+v 保存，重启服务即可

获取 refs，在其后面加上 as HTMLDivElement（不知道是不是这插件引起的，懒得管，直接干就是）
let layoutList:any = this.\$refs.layout as HTMLDivElement

/_ tslint:disable:no-unused-expression _/
单文件去除 tslint 校验 无用的表达式 三元 &&

###执行顺序
// loader 处理顺序从右往左
// enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
// enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
一组 Loader 执行顺序默认是从右往左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放在前面或者最后。

module.noParse 配置项可以让 webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做有助于提高构建性能。比如：

module: {
noParse: (content) => /jquery|lodash/.test(content)
}
module.rules.parser 属性可以更细粒度的配置哪些模块需要解析，哪些不需要，和 noParse 配置项的区别在于 parser 可以精确到语法层面，而 noParse 只能控制哪些文件不被解析。

module: {
rules: [
{
test: /\.js\$/,
use: ['babel-loader'],
parser: {
amd: false, // 禁用 AMD
commonjs: false, // 禁用 CommonJS
...
}
}
]
}

### 优化

webpack-parallel-uglify-plugin 提升打包速度
happypack 提升 loader 的解析速度
HashedModuleIdsPlugin，这是一个内置插件，它会根据模块路径生成模块 id

vue-class-component：强化 Vue 组件，使用 TypeScript/装饰器 增强 Vue 组件
vue-property-decorator：在 vue-class-component 上增强更多的结合 Vue 特性的装饰器
ts-loader：TypeScript 为 Webpack 提供了 ts-loader，其实就是为了让 webpack 识别 .ts .tsx 文件
tslint-loader 跟 tslint：我想你也会在.ts .tsx 文件 约束代码格式（作用等同于 eslint）
tslint-config-standard：tslint 配置 standard 风格的约束
去除 purify-css purifycss-webpack 使用 purgecss-webpack-plugin 代替 剔除未使用的 css
HappyPack(作者已经不再维护)
axios 已经有自己的 ts 文件了不需要额外安装了
poss-cssnext 使用 postcss-preset-env 替换
安装 postcss-preset-env，无需再安装 autoprefixer，由于 postcss-preset-env 已经内置了相关功能。

在代码中导入 _.vue 文件的时候，需要写上 .vue 后缀。原因还是因为 TypeScript 默认只识别 _.ts 文件，不识别 \*.vue 文件

### 待优化

1、rpx
2、生成模版 scaffold-generator 根据指定的模板和数据自动创建项目可替换模版中的指定数据 inquirer 交互式操作
3、mixin
4、已解决的问题 ios5 date input 输入 定时器...
5、Stylelint
6、unit test
7、css 提取未使用的，css 压缩 图片压缩 image-webpack-loader
