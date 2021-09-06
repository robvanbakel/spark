import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  namespaced: true,
  state() {
    return {
      weekId: null,
      dateIds: [],
      daysVisible: 7,
      datesShort: [],
      dayNames: [],
      dates: [],
      calendarPoint: new Date()
    }
  },
  mutations,
  actions,
  getters
}