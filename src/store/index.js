import Vue from 'vue';
import Vuex from 'vuex';
import main from './modules/main.js';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    main
  },
  plugins: [vuexLocal.plugin]
});
