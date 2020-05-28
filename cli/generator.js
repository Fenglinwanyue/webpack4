// https://juejin.im/post/5a31d210f265da431a43330e 实现脚手架给模板插值的功能
const Scaffold = require("scaffold-generator");
const mustache = require("mustache");
const errorPath = require("is-invalid-path"); // 如果Windows文件路径包含无效字符，则返回true。
const fs = require("fs");
const rootPath = process.cwd();
const glob = require("glob"); // npm i glob
const ora = require("ora"); // 用ora优化加载等待的交互
const logSymbols = require("log-symbols");
const chalk = require("chalk"); // 用chalk优化终端信息的显示效果

// const list = glob.sync('*')  // 遍历当前目录

mustache.escape = v => v;
exports.create = function(params, cb) {
    console.log(`${rootPath}${params.fpath}`, `${rootPath}${params.tpath}`);
    new Scaffold({
        // data: {
        //     name: "my-module",
        //     main: "lib/index.js"
        // },
        data: params.data,
        override: true,
        backup: false,
        // function `options.render` accepts `str` and `data`, then returns a `str`
        render: mustache.render
    })
        .copy(`${rootPath}${params.fpath}`, `${rootPath}${params.tpath}`)
        .then(() => {
            if (cb) cb();
        });
    // .catch(e => {
    //     console.error(logSymbols.error, chalk.red(`Fail!!!!!!!!:${e}`));
    // });
};

exports.createView = function(params, cb) {
    // let viewName = params.viewName.trim();
    let isErrPath = errorPath(params.basePath); // 无法校验/\之类的错误
    console.log(params.basePath, isErrPath);
    if (isErrPath) {
        console.error(logSymbols.error, chalk.red(`输入文件路径格式有误`));
        return;
    }
    // TODO:其它格式校验
    this.isExistFile(`${rootPath}${params.basePath}`).then(res => {
        if (res) console.warn(logSymbols.warning, chalk.red(`文件已存在`));
        return;
    });

    const spinner = ora(`正在创建文件...：${params.basePath}`);
    spinner.start();
    // spinner.fail() // wrong :(
    // spinner.succeed() // ok :)
    try {
        this.create(
            {
                data: {
                    viewName: params.viewName
                },
                fpath: "/cli/templates/view/view.tpl.vue",
                tpath: params.basePath
            },
            () => {
                console.log("done");
                // this.create({
                //     data: {},
                //     fromPath: "/cli/templates/view/view.tpl.vue",
                //     toPath: `params.basePath`
                // });
                spinner.succeed("文件已生成");
            }
        );
    } catch (e) {
        spinner.fail();
        console.error(logSymbols.error, chalk.red(`create file Fail!!!!!!!!:${e}`));
    }
};
// stats.isFile() 文件
// stats.isDirectory() 目录
exports.isExistFile = function(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, function(err, stats) {
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
};
