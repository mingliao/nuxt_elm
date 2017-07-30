import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
const state = {
  userInfo: null // 用户信息
}
const createStore = () => {
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  })
}
export default createStore

