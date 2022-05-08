export default {
  schedules(state) {
    return state.schedules;
  },
  shifts(state) {
    return state.shifts;
  },
  activeShiftId(state) {
    return state.activeShiftId;
  },
  randomShiftId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let string = '';
    for (let i = 0; i < 20; i += 1) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
  },
  newShiftPrefillData(state) {
    return state.newShiftPrefillData;
  },
  currentWeekSchedule(state, getters, rootState, rootGetters) {
    const schedule = state.schedules[rootGetters['date/weekId']];

    if (!schedule || !Object.keys(schedule).length) return null;

    return schedule;
  },

};
