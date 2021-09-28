import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  namespaced: true,
  state() {
    return {
      suggestions: null,
      admin: null,
      roles: null,
      shareWithEmployees: {},
      hideSidebar: false,
      sidebarAutoHidden: false,
    }
  },
  mutations,
  actions,
  getters
}