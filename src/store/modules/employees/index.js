import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state() {
    return {
      users: [],
      totalHours: {},
      activeUserId: null,
    };
  },
  mutations,
  actions,
  getters,
};
