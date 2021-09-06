export default {
  schedules(state, payload) {
    state.schedules = payload;
  },
  activeShift(state, payload) {
    state.activeShift = payload
  },
  newShift(state, payload) {
    state.newShift = payload;
  },
  addSuggestion(state, payload) {
    state.suggestions.push(payload.suggestion)
  },
  updateShiftLocally(state, payload) {

    if (payload.newShiftId) {

      state.schedules.push({
        id: payload.newShiftId,
        ...payload.shift
      })

    } else {

      for (const key in state.schedules) {
        if (state.schedules[key].id === payload.activeShiftId) {
          state.schedules[key] = {
            id: payload.activeShiftId,
            ...payload.shift
          }
        }
      }
    }
  },
  removeShiftLocally(state, id) {

    for (const key in state.schedules) {
      if (state.schedules[key].id === id) {
        state.schedules[key] = {
          id: null,
        }
      }
    }

  }
}