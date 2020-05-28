import { RootState } from './../types'
import state from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<RootState> = {
  SET_AUTHOR(state: RootState, payload: string) {
    state.author = payload;
  }
}

export default mutations
