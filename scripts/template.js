/*
 * @Description: 页面快速生成脚本
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const basePath = path.resolve(__dirname, '../src');

const dirName = process.argv[2];

if (!dirName) {
    console.log(chalk.red(`文件夹名称不能为空！\n`));
    console.log(chalk.red('示例：\n npm run tep ${capPirName}'));
    process.exit(0);
}

const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{data.pageName}}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="stylus" scoped>
  @import './${dirName}.styl'
</style>

`;

// ts 模版
const tsTep = `import { Component, Vue } from "vue-property-decorator"
import { State, Getter, Action, Mutation, namespace} from "vuex-class"
import { ${capPirName}Data } from '@/types/views/${dirName}.interface'
// import {  } from "@/components" // 组件

@Component({})
export default class About extends Vue {
  // Getter
  // @Getter ${dirName}.author

  // Action
  // @Action GET_DATA_ASYN

  // data
  private data: ${capPirName}Data = {
    pageName: '${dirName}'
  }

  private created() {
    //
  }

  private activated() {
    //
  }

  private mounted() {
    //
  }

  // 初始化函数
  private init() {
    //
  }

}
`;

// scss 模版
const scssTep = `@import "～@/assets/stylus/variables.styl";

.${dirName}-wrap {
  width: 100%;
}
`;

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  pageName: string
}

// VUEX ${dirName}.State 参数类型
export interface ${capPirName}State {
  data?: any
}

// GET_DATA_ASYN 接口参数类型
// export interface DataOptions {}

`;

// vuex 模版
const vuexTep = `import { ${capPirName}State } from '@/types/views/${dirName}.interface'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as ${capPirName}Api from '@/api/${dirName}'

const state: ${capPirName}State = {
  ${dirName}: {
   author: undefined
  }
}

// 强制使用getter获取state
const getters: GetterTree<${capPirName}State, any> = {
  author: (state: ${capPirName}State) => state.${dirName}.author
}

// 更改state
const mutations: MutationTree<${capPirName}State> = {
  // 更新state都用该方法
  UPDATE_STATE(state: ${capPirName}State, data: ${capPirName}State) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { return }
      state[key] = data[key]
    }
  }
}

const actions: ActionTree<${capPirName}State, any> = {
  UPDATE_STATE_ASYN({ commit, state: ${capPirName}State }, data: ${capPirName}State) {
    commit('UPDATE_STATE', data)
  },
  // GET_DATA_ASYN({ commit, state: LoginState }) {
  //   ${capPirName}.getData()
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}

`;

// api 接口模版
const apiTep = `import Api from '@/utils/request'

export const getData = () => {
  return Api.getData()
}

`;
function chdir(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(chalk.red(`目录:\n${filePath}\n不存在！\n`));
        process.exit(0);
    }
    process.chdir(filePath);
}
if (fs.existsSync(`${basePath}/types/views/${dirName}`)) {
    console.log(chalk.red(`views文件下已存在相同名称的文件\n不可重复添加!!!\n`));
    process.exit(0);
}
fs.mkdirSync(`${basePath}/types/views/${dirName}`); // mkdir

chdir(`${basePath}/types/views/${dirName}`); // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep); // vue
fs.writeFileSync(`${dirName}.ts`, tsTep); // ts
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss

chdir(`${basePath}/types/views`); // cd types
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep); // interface

chdir(`${basePath}/store/modules`); // cd store
fs.writeFileSync(`${dirName}.ts`, vuexTep); // vuex

chdir(`${basePath}/api`); // cd api
fs.writeFileSync(`${dirName}.ts`, apiTep); // api

process.exit(0);
