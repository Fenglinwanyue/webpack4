import { RootState } from './../types'
import state from './state'
import { ActionTree } from 'vuex'

const actions: ActionTree<RootState, any> = {
  SET_AUTHOR_ASYN({ commit, state: RootState }, payload: string) {
    commit('SET_AUTHOR', payload)
  }
}

export default actions
