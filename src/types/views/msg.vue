<template>
    <div>
        <input v-model="msg">
        <p>msg: {{ msg }}</p>
        <p>vuex module: {{firstName}}</p>
        <p>computed msg: {{ computedMsg }}</p>
        <button @click="greet">Greet</button>
    </div>
</template>

<script lang="ts">
import { Getter, Mutation, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
const profile = namespace('profile');

@Component
export default class App extends Vue {
    // 初始化数据
    private msg = 123;
    @profile.Getter private firstName!: string;
    @profile.Mutation private setProfile!: (obj: any) => void;
    // private created() {}
    // 声明周期钩子
    private mounted() {
        console.log('----', this.firstName);
        // this.setProfile({firstName: 'ccc',lastName: 'yyy'})
        // this.greet()
    }

    // 计算属性
    private get computedMsg() {
        return 'computed ' + this.msg;
    }

    // 方法
    private greet() {
        alert('greeting: ' + this.msg);
    }
}
</script>
