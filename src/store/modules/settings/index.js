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
      breaks: ['0', '15', '30', '45', '60'],
    }
  },
  mutations,
  actions,
  getters
}