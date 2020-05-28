/*
 * @Description: 组件快速生成脚本
 */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const basePath = path.resolve(__dirname, '../src')

const dirName = process.argv[2]

if (!dirName) {
  console.log(chalk.red(`文件夹名称不能为空！\n`))
  console.log(chalk.red('示例：\n npm run tep ${capPirName}'))
  process.exit(0)
}

const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1)

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{data.componentName}}
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator"
  import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
  // import { ${capPirName}Data } from '@/types/components/${dirName}.interface'
  import { ${capPirName}Data } from './${dirName}.interface'
  // import {  } from "@/components" // 组件

  @Component({})
  export default class About extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) private name!: string

    // data
    private data: ${capPirName}Data = {
      componentName: '${dirName}'
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

  }
</script>

<style lang="stylus" scoped>
  @import "~@/assets/stylus/variables";

  .${dirName}-wrap {
    width: 100%;
  }
</style>

`

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  componentName: string
}

`
function chdir(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`目录:\n${filePath}\n不存在！\n`))
    process.exit(0)
  }
  process.chdir(filePath)
}
if (fs.existsSync(`${basePath}/types/components/${dirName}`)) {
  console.log(chalk.red(`components文件下已存在相同名称的文件\n不可重复添加!!!\n`))
  process.exit(0)
}
fs.mkdirSync(`${basePath}/types/components/${dirName}`) // mkdir

chdir(`${basePath}/types/components/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue 

chdir(`${basePath}/types/components`) // cd components
fs.writeFileSync(`${dirName}/${dirName}.interface.ts`, interfaceTep) // interface 

process.exit(0)