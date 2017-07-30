import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
const state = {
  userInfo: null // 用户信息
}
const createStore = () => { // nuxt就是要一个方法，return new store，直接导出来不行。
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  })
}
export default createStore

