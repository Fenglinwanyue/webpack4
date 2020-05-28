<template>
    <div>
        <div class="testStylus"
             @click='toast'>
            {{message}}
        </div>
        <div class="onepxborder">
            {{author}}
        </div>
        <!-- <div class="onepx">
     333
   </div> -->
        <MyCheckbox :label="checkbox.label"
                    :id="checkbox.id"
                    :OmitObj="OmitObj"
                    v-model="checkbox.checked" />
        {{JSON.stringify(checkbox)}}
    </div>
</template>

<script lang="ts">
import { Getter, Mutation } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import MyCheckbox from './../components/checkbox/checkbox.vue';
@Component({
    components: {
        MyCheckbox
    }
})
export default class HelloWord extends Vue {
    @Getter private author!: string;
    @Mutation private SET_AUTHOR!: (author: string) => void;

    private message: string = 'hello vuets';
    // test Omit
    private OmitObj = {
        username: 11
    };
    private checkbox = {
        label: 'test checkbox',
        id: 'checkbox-id',
        checked: true
    };

    private toast(): void {
        window.alert(this.message);
    }
    // myThis: any = this;
    private mounted() {
        // this.myThis.$message.info('普通消息');
        // (this as any).$message.info('普通消息');
        this.$message.info('普通消息');
        console.log(Vue.prototype.$message.info('普通消息'));
        this.changeAuthor('vue');
    }

    private changeAuthor(name: string) {
        this.SET_AUTHOR(name);
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '~@/assets/stylus/mixin'
.testStylus
    font-size 15px
    // background url('./imgs/sea')
    display flex // test add 前缀
    // border: 1px solid;
    // border-image: svg(1px-border param(--color #00b1ff)) 1 stretch;
.onepxborder
    // background: white svg(square param(--color #000000));
    // border: 1px solid;
    // border-image: svg(1px-border param(--color #00b1ff)) 1 stretch;
    height 50px
    width 100%
    box-sizing border-box
    margin-top 5px
    background #fff
.onepx
    border 1px solid red
    margin-top 5px
.unuse
    background yellow
    margin 5px
    font 1
</style>
