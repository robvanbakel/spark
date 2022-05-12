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
  updateShiftLocally(state, payload) {
    state.shifts = state.shifts.filter((shift) => shift.shiftId !== payload.shiftId);
    state.shifts.push(payload);
  },
  acceptShiftLocally(state, { weekId, shiftId, selectedShift }) {
    const index = state.schedules[weekId].findIndex((shift) => shift?.shiftId === shiftId);
    state.schedules[weekId][index] = {
      ...selectedShift,
      accepted: true,
    };
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
    state.shifts = state.shifts.filter((shift) => shift.shiftId !== shiftId);
  },
  deleteWeekLocally(state, weekId) {
    delete state.schedules[weekId];
  },
};
