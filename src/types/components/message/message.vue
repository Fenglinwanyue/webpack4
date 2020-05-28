<template>
    <transition name="fade">
        <div class="message-wrap"
             :class="type"
             v-show="show">
            <span class="text">{{text}}</span>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
// import { MessageData } from '@/types/components/message.interface'
import { MessageData } from './message.interface';
// import {  } from "@/components" // 组件

@Component({})
export default class About extends Vue {
    // prop
    @Prop({
        type: String,
        required: true,
        default: 'info',
        validator: val => ['info', 'success', 'warning', 'error'].includes(val)
    })
    private type: string;
    @Prop({
        type: String,
        required: true,
        default: ''
    })
    private text: string;

    @Prop({
        type: Boolean,
        required: true,
        default: false
    })
    private show: boolean;

    // data
    private data: MessageData = {
        componentName: 'message'
    };

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
@import '~@/assets/stylus/variables'
.fade-enter-active, .fade-leave-active
    transition opacity 0.3s
.fade-enter, .fade-leave-to
    opacity 0
.message-wrap
    position fixed
    top 40px
    text-align center
    left 50%
    transform translateX(-50%)
    min-width 400px
    padding 10px 20px
    color $strong-text-color
    background #f5f5f5
    font-size 14px
    line-height 1.4
    border-radius 4px
    z-index 1000
    box-shadow 0 0 10px rgba(0, 0, 0, 0.3)
    &.info
        color $strong-text-color
    &.success
        color $success-color
    &.error
        color $danger-color
    &.warning
        color $warning-color
</style>

