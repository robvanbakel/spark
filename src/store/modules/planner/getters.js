export default {
  schedules(state) {
    return state.schedules
  },
  currentWeekSchedule(state, getters, rootState, rootGetters) {
    return state.schedules[rootGetters['date/weekId']]
  },
  activeShiftId(state) {
    return state.activeShiftId
  },
  breaks(state) {
    return state.breaks;
  },
  suggestions(state) {
    return state.suggestions;
  },
  newShift(state) {
    return state.newShift;
  },

}