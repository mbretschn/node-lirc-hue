import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    active: true,
    mute: false,
    multi: false,
    yamaha: 15,
    interruptYamaha: false
  },
  mutations: {
    active: (state, payload) => {
      state.active = !!payload
    },
    mute: (state, payload) => {
      state.mute = !!payload
    },
    multi: (state, payload) => {
      state.multi = !!payload
    },
    yamaha: (state, payload) => {
      state.yamaha = payload
    }
  },
  actions: {
    SOCKET_active: (store, payload) => {
      store.commit('active', payload)
    },
    SOCKET_mute: (store, payload) => {
      store.commit('mute', payload)
    },    
    SOCKET_multi: (store, payload) => {
      store.commit('multi', payload)
    },    
    SOCKET_yamaha: (store, payload) => {
      if (store.state.interruptYamaha) return
      store.commit('yamaha', payload)
    }
  },
  modules: {
  }
})
