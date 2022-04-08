export default {
  schedules(state) {
    return state.schedules;
  },
  activeShiftId(state) {
    return state.activeShiftId;
  },
  currentWeekSchedule(state, getters, rootState, rootGetters) {
    const schedule = state.schedules[rootGetters['date/weekId']];

    if (!schedule || !Object.keys(schedule).length) return null;

    return schedule;
  },

};
