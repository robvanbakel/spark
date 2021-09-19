import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  namespaced: true,
  state() {
    return {
      schedules: null,
      newShift: null,
      activeShiftId: null,
      breaks: ['-', '15', '30', '45', '60'],
    }
  },
  mutations,
  actions,
  getters
}