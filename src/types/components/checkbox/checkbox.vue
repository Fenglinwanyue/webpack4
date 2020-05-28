<template>
    <div class='checkbox-wrap'>
        <input type='checkbox'
               :id='id'
               :checked='checked'
               @change='changed' />
        {{label}}
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
// import { CheckboxData } from '@/types/components/checkbox.interface'
import { CheckboxData, OmitObjType } from './checkbox.interface';
// import {  } from '@/components' // 组件

@Component({})
export default class MyCheckbox extends Vue {
    // prop
    @Prop({
        type: String,
        default: '请选择'
    })
    private label: number;
    @Prop({ type: String }) private id: string;

    @Prop() private OmitObj: OmitObjType; // 无法校验

    @Model('change')
    private checked: boolean;

    // data
    private data: CheckboxData = {
        componentName: 'checkbox'
    };

    // omit test
    private omitData: Omit<OmitObjType, 'role'> = {
        // 剔除某些属性
        username: 'test',
        id: 1,
        avatar: 's'
    };

    private changed(ev: any): void {
        this.$emit('change', ev.target.checked);
    }
    private created() {
        console.log(this.OmitObj);
    }

    private activated() {
        //
    }

    private mounted() {
        //
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '~@/assets/stylus/variables'
.checkbox-wrap
    width 100%
</style>

