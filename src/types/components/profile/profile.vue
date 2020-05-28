<template>
  <div class="profile-wrap">
    {{data.componentName}}
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator"
  import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
  // import { ProfileData } from '@/types/components/profile.interface'
  import { ProfileData } from './profile.interface'
  // import {  } from "@/components" // 组件

  @Component({})
  export default class About extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) name!: string

    // data
    data: ProfileData = {
      componentName: 'profile'
    }

    created() {
      //
    }
    
    activated() {
      //
    }

    mounted() {
      //
    }

  }
</script>

<style lang="stylus" scoped>
  @import "～@/assets/stylus/variables";

  .profile-wrap {
    width: 100%;
  }
</style>

