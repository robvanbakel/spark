export default {
  schedules(state) {
    return state.schedules
  },
  nonEmptySchedules(state) {
    let nonEmptySchedules = []

    for (const weekId in state.schedules) {
      if (Object.keys(state.schedules[weekId]).length !== 0) {
        nonEmptySchedules.push(weekId)
      }
    }

    return nonEmptySchedules
  },
  currentWeekSchedule(state, getters, rootState, rootGetters) {
    const weekId = rootGetters["date/weekId"]
    const schedule = state.schedules[weekId]

    if (schedule && Object.keys(schedule).length !== 0) {
      return schedule
    }
  },
  activeShiftId(state) {
    return state.activeShiftId
  },
  breaks(state) {
    return state.breaks
  },
  suggestions(state) {
    return state.suggestions
  },
  newShift(state) {
    return state.newShift
  },
}
