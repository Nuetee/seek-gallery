import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    provider: null,
    access_token: null,
    profile_image: null,
    thumbnail_image: null
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getProvider (state) {
      return state.provider
    },
    getToken (state) {
      return state.access_token
    },
    getProfile (state) {
      return state.profile_image
    },
    getThumbnail (state) {
      return state.thumbnail_image
    },
  },
  mutations: {
    setUser (state, data) {
      state.user = data
    },
    setProvider (state, data) {
      state.provider = data
    },
    setToken (state, data) {
      state.access_token = data
    },
    setProfile (state, data) {
      state.profile_image = data
    },
    setThumbnail (state, data) {
      state.thumbnail_image = data
    }
  },
  actions: {
    setUser (context, data) {
      return new Promise(function (resolve) {
        context.commit('setUser', data.user)
        context.commit('setProvider', data.provider)
        context.commit('setToken', data.access_token)
        context.commit('setProfile', data.profile_image)
        context.commit('setThumbnail', data.thumbnail_image)
        resolve()
      })
    },
    setEmpty (context) {
      return new Promise(function (resolve) {
        context.commit('setUser', null)
        context.commit('setProvider', null)
        context.commit('setToken', null)
        context.commit('setProfile', null)
        context.commit('setThumbnail', null)
        resolve()
      })
    }
  },
  modules: {
  }
})
