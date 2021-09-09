export default {
  schedules(state, payload) {
    state.schedules = payload
  },
  activeShift(state, payload) {
    state.activeShift = payload
  },
  activeShiftId(state, payload) {
    state.activeShiftId = payload
  },
  newShift(state, payload) {
    state.newShift = payload
  },
  addSuggestion(state, payload) {
    state.suggestions.push(payload.suggestion)
  },
  updateShiftLocally(state, payload) {
    const { weekId, day, employeeId } = payload.shiftId
    state.schedules[weekId][employeeId][day] = payload.shiftInfo
  },
  createEmptySchedule(state, { weekId, employeeId }) {
    if (!state.schedules[weekId]) {
      state.schedules[weekId] = {}
    }

    if (!state.schedules[weekId][employeeId]) {
      state.schedules[weekId][employeeId] = new Array(7).fill(null)
    }
  },
  removeShiftLocally(state, { weekId, day, employeeId }) {
    state.schedules[weekId][employeeId][day] = null
  },
}
