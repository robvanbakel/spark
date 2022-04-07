import mutations from './mutations';
import actions from './actions';
import getters from './getters';

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
      location: {},
      dateNotation: null,
      breaks: ['0', '15', '30', '45', '60'],
      statuses: ['active', 'unavailable', 'sick', 'inactive', 'staged'],
    };
  },
  mutations,
  actions,
  getters,
};
