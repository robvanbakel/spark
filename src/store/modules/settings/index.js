import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state() {
    return {
      admin: null,
      hideSidebar: false,
      sidebarAutoHidden: false,
      settings: null,
      breaks: ['0', '15', '30', '45', '60'],
      statuses: ['ACTIVE', 'UNAVAILABLE', 'SICK', 'INACTIVE', 'STAGED'],
    };
  },
  mutations,
  actions,
  getters,
};
