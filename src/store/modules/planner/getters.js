export default {
  schedules(state) {
    return state.schedules
  },
  nonEmptySchedules(state) {
    return Object.keys(state.schedules).filter((weekId) => Object.keys(state.schedules[weekId]).length)
  },
  activeShiftId(state) {
    return state.activeShiftId
  },
  currentWeekSchedule(state, getters, rootState, rootGetters) {
    const schedule = state.schedules[rootGetters["date/weekId"]]

    if (schedule && Object.keys(schedule).length) {
      return schedule
    }
  },

}
