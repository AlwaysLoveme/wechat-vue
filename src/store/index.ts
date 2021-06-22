import { createStore } from "vuex";

export default createStore({
  state: {
    user: {},
  },
  mutations: {
    setUserInfo(state, payload) {
      state.user = payload;
    },
  },
  actions: {},
  modules: {},
});
