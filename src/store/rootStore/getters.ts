import { RootState } from './../types'
import { GetterTree } from 'vuex'
import state from './state'

const getters: GetterTree<RootState, any> = {
  author: (state: RootState) => state.author
}

export default getters
