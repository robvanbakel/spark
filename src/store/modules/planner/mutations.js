export default {
  schedules(state, payload) {
    state.schedules = payload;
  },
  shifts(state, payload) {
    state.shifts = payload;
  },
  activeShiftId(state, payload) {
    state.activeShiftId = payload;
  },
  newShiftPrefillData(state, payload) {
    state.newShiftPrefillData = payload;
  },
  emptyWeek(state, payload) {
    state.emptyWeek = payload;
  },
  updateShiftLocally(state, payload) {
    if (payload.status === 'NEW') {
      state.shifts.push({
        ...payload,
        status: 'PROPOSED',
        statusUpdated: new Date().toISOString(),
      });

      return;
    }

    state.shifts = state.shifts.map((shift) => {
      if (shift.id !== payload.id) return shift;

      const newRequestNeeded = shift.employeeId !== payload.employeeId || !shift.from.isSame(payload.from, 'minute') || !shift.to.isSame(payload.to, 'minute');

      return {
        ...shift,
        ...payload,
        status: newRequestNeeded ? 'PROPOSED' : payload.status,
      };
    });
  },
  setSchedule(state, { weekId, schedule }) {
    state.schedules[weekId] = JSON.parse(JSON.stringify(schedule));
  },
  createEmptySchedule(state, { weekId, employeeId }) {
    // If weekId does not exist, create empty weekId
    if (!state.schedules[weekId]) {
      state.schedules[weekId] = {};
    }

    // If schedule does not exist, create empty schedule
    if (!state.schedules[weekId][employeeId]) {
      state.schedules[weekId][employeeId] = new Array(7).fill(null);
    }
  },
  deleteShiftLocally(state, shiftId) {
    state.shifts = state.shifts.filter((shift) => shift.id !== shiftId);
  },
  deleteWeekLocally(state, weekId) {
    delete state.schedules[weekId];
  },
};
