import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import RootStore from './rootStore'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

import vuexModule from './modules'

Vue.use(Vuex)

const debug = process.env.buildEnv === 'test'

const store: StoreOptions<RootState> = {
  // state is rootState
  // state: {
  //   version: '1.0.0'
  // },
  ...RootStore,
  modules: vuexModule,
  strict: debug,
  plugins: debug
    ? [createPersistedState({ storage: window.sessionStorage }), createLogger()]
    : [createPersistedState({ storage: window.sessionStorage })]
}
export default new Vuex.Store<RootState>(store)
// export default new Vuex.Store({
//   modules: vuexModule,
//   strict: debug,
//   plugins: debug
//     ? [createPersistedState(), createLogger()]
//     : [createPersistedState()]
// })
