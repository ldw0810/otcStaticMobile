/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex';
import Vue from 'vue';
import store_state from './state';
import store_getters from './getters';
import store_mutations from './mutations';
import store_actions from './actions';

Vue.use(Vuex);
export default new Vuex.Store({
    state: store_state,
    getters: store_getters,
    mutations: store_mutations,
    actions: store_actions
});